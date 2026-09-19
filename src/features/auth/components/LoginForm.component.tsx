'use client';

import React, { type FormEvent } from 'react';
import { BrandMark } from '@/shared/components/BrandMark';
import { maxLen } from '@/shared/validation/fieldLimits';
import { loginStyles } from '../styles/login.styles';

export interface LoginFormProps {
  email: string;
  password: string;
  error: string;
  fieldErrors: { email?: string; password?: string };
  loading: boolean;
  onSubmit: (e: FormEvent) => void;
  onEmailChange: (val: string) => void;
  onPasswordChange: (val: string) => void;
  mfaRequired: boolean;
  mfaCode: string;
  mfaError: string;
  onMfaSubmit: (e: FormEvent) => void;
  onMfaCodeChange: (val: string) => void;
}

export function LoginForm({
  email,
  password,
  error,
  fieldErrors,
  loading,
  onSubmit,
  onEmailChange,
  onPasswordChange,
  mfaRequired,
  mfaCode,
  mfaError,
  onMfaSubmit,
  onMfaCodeChange,
}: LoginFormProps) {
  if (mfaRequired) {
    return (
      <div className={loginStyles.page}>
        <div className={loginStyles.hero}>
          <div className={loginStyles.logoWrapper}>
            <BrandMark size={32} />
          </div>
          <h1 className={loginStyles.title}>
            Budget<span className={loginStyles.titleAccent}>Brain</span>
          </h1>
          <div className={loginStyles.divider} />
          <p className={loginStyles.subtitle}>Track smarter. Save better.</p>
        </div>

        <div className={loginStyles.panel}>
          <h2 className={loginStyles.panelTitle}>Two-factor verification</h2>
          <p className={loginStyles.subtitle}>Enter the 6-digit code from your authenticator app.</p>

          <form onSubmit={onMfaSubmit} className={loginStyles.form} noValidate>
            {mfaError ? (
              <div className={loginStyles.errorBanner} role="alert">
                {mfaError}
              </div>
            ) : null}

            <div className={loginStyles.fieldGroup}>
              <label htmlFor="mfa-code" className={loginStyles.label}>
                Authenticator code
              </label>
              <input
                id="mfa-code"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                autoComplete="one-time-code"
                className={mfaError ? loginStyles.inputInvalid : loginStyles.input}
                placeholder="123456"
                value={mfaCode}
                onChange={(e) => onMfaCodeChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                autoFocus
              />
            </div>

            <button type="submit" disabled={loading} className={loginStyles.submitButton}>
              {loading ? 'Verifying…' : 'Verify'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={loginStyles.page}>
      <div className={loginStyles.hero}>
        <div className={loginStyles.logoWrapper}>
          <BrandMark size={32} />
        </div>
        <h1 className={loginStyles.title}>
          Budget<span className={loginStyles.titleAccent}>Brain</span>
        </h1>
        <div className={loginStyles.divider} />
        <p className={loginStyles.subtitle}>Track smarter. Save better.</p>
      </div>

      <div className={loginStyles.panel}>
        <h2 className={loginStyles.panelTitle}>Admin sign in</h2>

        <form onSubmit={onSubmit} className={loginStyles.form} noValidate>
          {error ? (
            <div className={loginStyles.errorBanner} role="alert">
              {error}
            </div>
          ) : null}

          <div className={loginStyles.fieldGroup}>
            <label htmlFor="email" className={loginStyles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={fieldErrors.email ? loginStyles.inputInvalid : loginStyles.input}
              placeholder="admin@example.com"
              value={email}
              maxLength={maxLen('email')}
              onChange={(e) => onEmailChange(e.target.value)}
              autoComplete="email"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            />
            {fieldErrors.email ? (
              <p id="email-error" className={loginStyles.fieldError}>
                {fieldErrors.email}
              </p>
            ) : null}
          </div>

          <div className={loginStyles.fieldGroup}>
            <label htmlFor="password" className={loginStyles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className={fieldErrors.password ? loginStyles.inputInvalid : loginStyles.input}
              placeholder="••••••••"
              value={password}
              maxLength={maxLen('password')}
              onChange={(e) => onPasswordChange(e.target.value)}
              autoComplete="current-password"
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? 'password-error' : undefined}
            />
            {fieldErrors.password ? (
              <p id="password-error" className={loginStyles.fieldError}>
                {fieldErrors.password}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={loginStyles.submitButton}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
