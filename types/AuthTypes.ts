export interface AuthData {
  accessToken: string | null | undefined;
  refreshToken?: string | null | undefined;
  user?: {
    name?: string | null | undefined;
    email?: string | null | undefined;
  };
}

export interface AuthContextType {
  authData: AuthData | null;
  saveAuthData: (data: AuthData) => Promise<void>;
  clearAuthData: () => Promise<void>;
}
