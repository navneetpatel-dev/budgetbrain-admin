/** Keep in sync with backend/src/validation/limits.ts + messages.ts */
export const FieldLimits = {
  email: { min: 1, max: 255 },
  password: { min: 8, max: 72 },
  name: { min: 1, max: 255 },
  adminNotes: { min: 1, max: 5000 },
} as const;

export type FieldLimitKey = keyof typeof FieldLimits;

export const ValidationMessages = {
  emailRequired: 'Email is required',
  emailMax: `Email must be at most ${FieldLimits.email.max} characters`,
  emailInvalid: 'Enter a valid email address',
  passwordRequired: 'Password is required',
  passwordMax: `Password must be at most ${FieldLimits.password.max} characters`,
} as const;

export function maxLen(key: FieldLimitKey): number {
  return FieldLimits[key].max;
}
