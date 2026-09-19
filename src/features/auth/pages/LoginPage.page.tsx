'use client';

import React from 'react';
import { useLoginForm } from '../hooks/useLoginForm.hook';
import { LoginForm } from '../components/LoginForm.component';

export function LoginPage({ onLogin }: { onLogin?: () => void } = {}) {
  const {
    email,
    password,
    error,
    fieldErrors,
    loading,
    handleSubmit,
    handleEmailChange,
    handlePasswordChange,
    mfaRequired,
    mfaCode,
    mfaError,
    handleMfaSubmit,
    handleMfaCodeChange,
  } = useLoginForm(onLogin);

  return (
    <LoginForm
      email={email}
      password={password}
      error={error}
      fieldErrors={fieldErrors}
      loading={loading}
      onSubmit={handleSubmit}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      mfaRequired={mfaRequired}
      mfaCode={mfaCode}
      mfaError={mfaError}
      onMfaSubmit={handleMfaSubmit}
      onMfaCodeChange={handleMfaCodeChange}
    />
  );
}

export default LoginPage;
