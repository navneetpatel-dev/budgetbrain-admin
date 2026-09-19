'use client';

import { useTotpEnrollment } from '../hooks/useTotpEnrollment.hook';
import { securityStyles } from '../styles/security.styles';

export function SecuritySettingsPage() {
  const {
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
  } = useTotpEnrollment();

  if (loading) {
    return <div className={securityStyles.subtitle}>Loading security settings…</div>;
  }

  return (
    <div className={securityStyles.view}>
      <div className={securityStyles.header}>
        <h2 className={securityStyles.title}>Security</h2>
        <p className={securityStyles.subtitle}>
          Add an authenticator-app second factor to your admin login.
        </p>
      </div>

      <div className={securityStyles.card}>
        {totpEnabled ? (
          <span className={securityStyles.statusPillEnabled}>Two-factor authentication enabled</span>
        ) : (
          <span className={securityStyles.statusPillDisabled}>Two-factor authentication disabled</span>
        )}

        {error ? <div className={securityStyles.errorBanner}>{error}</div> : null}
        {success ? <div className={securityStyles.successBanner}>{success}</div> : null}

        {!totpEnabled && !qrCodeDataUrl ? (
          <button
            type="button"
            className={securityStyles.button}
            disabled={submitting}
            onClick={() => void startEnrollment()}
          >
            {submitting ? 'Starting…' : 'Set up two-factor authentication'}
          </button>
        ) : null}

        {qrCodeDataUrl ? (
          <>
            <p className={securityStyles.subtitle}>
              Scan this with an authenticator app (e.g. Google Authenticator, 1Password), then
              enter the 6-digit code it shows.
            </p>
            {/* Server-generated data URI — a plain <img> is intentional, no client QR library needed. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCodeDataUrl} alt="Scan with your authenticator app" className={securityStyles.qrImage} />
            {secret ? <p className={securityStyles.secretText}>Manual entry key: {secret}</p> : null}
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              className={securityStyles.input}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            />
            <button
              type="button"
              className={securityStyles.button}
              disabled={submitting}
              onClick={() => void confirmEnrollment()}
            >
              {submitting ? 'Verifying…' : 'Confirm and enable'}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default SecuritySettingsPage;
