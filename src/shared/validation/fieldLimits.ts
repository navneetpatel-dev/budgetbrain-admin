/** Keep in sync with backend/src/validation/limits.ts + messages.ts */
export const FieldLimits = {
  email: { min: 1, max: 255 },
  password: { min: 8, max: 72 },
  name: { min: 1, max: 255 },
  adminNotes: { min: 1, max: 5000 },
} as const;

export type FieldLimitKey = keyof typeof FieldLimits;

export const ValidationMessages = {
  minChars: (min: number) => `Must be at least ${min} characters`,
  maxChars: (max: number) => `Must be at most ${max} characters`,
  emailRequired: 'Email is required',
  emailMax: `Email must be at most ${FieldLimits.email.max} characters`,
  emailInvalid: 'Enter a valid email address',
  passwordRequired: 'Password is required',
  passwordMax: `Password must be at most ${FieldLimits.password.max} characters`,
} as const;

export function maxLen(key: FieldLimitKey): number {
  return FieldLimits[key].max;
}

export function validateText(key: FieldLimitKey, value: string | undefined | null): string | undefined {
  const { min, max } = FieldLimits[key];
  const v = (value ?? '').trim();
  if (v.length < min) return ValidationMessages.minChars(min);
  if (v.length > max) return ValidationMessages.maxChars(max);
  return undefined;
}

export function validateOptionalText(
  key: FieldLimitKey,
  value: string | undefined | null
): string | undefined {
  const { min, max } = FieldLimits[key];
  const v = (value ?? '').trim();
  if (!v) return undefined;
  if (v.length < min) return ValidationMessages.minChars(min);
  if (v.length > max) return ValidationMessages.maxChars(max);
  return undefined;
}
