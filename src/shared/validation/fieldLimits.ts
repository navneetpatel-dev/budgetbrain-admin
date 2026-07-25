/** Keep in sync with backend/src/validation/limits.ts */
export const FieldLimits = {
  email: { min: 1, max: 255 },
  password: { min: 8, max: 72 },
  name: { min: 1, max: 255 },
  adminNotes: { min: 1, max: 5000 },
} as const;

export type FieldLimitKey = keyof typeof FieldLimits;

export function maxLen(key: FieldLimitKey): number {
  return FieldLimits[key].max;
}
