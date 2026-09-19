'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin, verifyMfaCode } from '../api/login.api';
import { FieldLimits, ValidationMessages } from '@/shared/validation/fieldLimits';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useLoginForm(onLogin?: () => void) {
  let router: { push: (url: string) => void } | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    router = useRouter();
  } catch {
    router = null;
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  // Second-step state, populated once the backend responds with mfaRequired.
  const [mfaToken, setMfaToken] = useState<string | null>(null);
  const [mfaCode, setMfaCode] = useState('');
  const [mfaError, setMfaError] = useState('');

  const completeNavigation = () => {
    if (onLogin) {
      onLogin();
    }
    if (router) {
      router.push('/');
    } else if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const next: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      next.email = ValidationMessages.emailRequired;
    } else if (trimmedEmail.length > FieldLimits.email.max) {
      next.email = ValidationMessages.emailMax;
    } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
      next.email = ValidationMessages.emailInvalid;
    }

    if (!password) {
      next.password = ValidationMessages.passwordRequired;
    } else if (password.length > FieldLimits.password.max) {
      next.password = ValidationMessages.passwordMax;
    }

    setFieldErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      const result = await loginAdmin(trimmedEmail, password);
      if (result.mfaRequired) {
        setMfaToken(result.mfaToken);
        return;
      }
      completeNavigation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMfaError('');
    if (!mfaToken) return;

    if (!/^\d{6}$/.test(mfaCode)) {
      setMfaError('Enter the 6-digit code from your authenticator app.');
      return;
    }

    setLoading(true);
    try {
      await verifyMfaCode(mfaToken, mfaCode);
      completeNavigation();
    } catch (err) {
      setMfaError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setFieldErrors((f) => ({ ...f, email: undefined }));
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    setFieldErrors((f) => ({ ...f, password: undefined }));
  };

  const handleMfaCodeChange = (val: string) => {
    setMfaCode(val);
    setMfaError('');
  };

  return {
    email,
    password,
    error,
    fieldErrors,
    loading,
    handleSubmit,
    handleEmailChange,
    handlePasswordChange,
    // Second-step (TOTP) state — LoginForm renders the code-entry form when mfaToken is set.
    mfaRequired: mfaToken !== null,
    mfaCode,
    mfaError,
    handleMfaSubmit,
    handleMfaCodeChange,
  };
}
