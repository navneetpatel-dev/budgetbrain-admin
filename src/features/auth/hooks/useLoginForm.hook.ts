'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '../api/login.api';
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
      await loginAdmin(trimmedEmail, password);
      if (onLogin) {
        onLogin();
      }
      if (router) {
        router.push('/');
      } else if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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

  return {
    email,
    password,
    error,
    fieldErrors,
    loading,
    handleSubmit,
    handleEmailChange,
    handlePasswordChange,
  };
}
