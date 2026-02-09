export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  iat?: number;
  exp?: number;
}

export const SESSION_CONSTANTS = {
  COOKIE_NAME: 'access_token',
  MAX_AGE: 60 * 60 * 24 * 7, // 7 días
} as const;
