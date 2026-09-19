'use client';

import { useEffect, useState } from 'react';
import { confirmTotp, enrollTotp, fetchCurrentUser } from '../api/totp.api';

export function useTotpEnrollment() {
  const [loading, setLoading] = useState(true);
  const [totpEnabled, setTotpEnabled] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCurrentUser()
      .then((user) => setTotpEnabled(user.totpEnabled))
      .catch(() => setError('Could not load your security settings.'))
      .finally(() => setLoading(false));
  }, []);

  const startEnrollment = async () => {
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const result = await enrollTotp();
      setQrCodeDataUrl(result.qrCodeDataUrl);
      setSecret(result.secret);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start enrollment.');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmEnrollment = async () => {
    setError('');
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code from your authenticator app.');
      return;
    }
    setSubmitting(true);
    try {
      await confirmTotp(code);
      setTotpEnabled(true);
      setQrCodeDataUrl(null);
      setSecret(null);
      setCode('');
      setSuccess('Two-factor authentication is now enabled on your account.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code — try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    loading,
    totpEnabled,
    qrCodeDataUrl,
    secret,
    code,
    setCode,
    error,
    success,
    submitting,
    startEnrollment,
    confirmEnrollment,
  };
}
