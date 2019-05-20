export interface OpenIdConnectConfiguration {
  baseUrl: string,
  tokenEndpoint: string,
  authEndpoint: string,
  logoutEndpoint: string,
  clientId: string,
  clientSecret?: string,
  loginRedirectPath: string,
  logoutRedirectPath: string,
  scope?: string
}
