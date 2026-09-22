export interface AuthUser {
  id: string;
  email: string;
  totpEnabled: boolean;
}

export interface EnrollTotpResponse {
  secret: string;
  otpauthUrl: string;
  qrCodeDataUrl: string;
}

export interface ConfirmTotpResponse {
  message: string;
}
