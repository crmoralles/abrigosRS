export interface AuthorizationProvider {
  authorize(token: string): Promise<boolean>;
}
