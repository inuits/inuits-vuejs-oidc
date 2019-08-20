export interface OpenIdConnectConfiguration {
  baseUrl: string,
  tokenEndpoint: string,
  authEndpoint: string,
  logoutEndpoint: string,
  clientId: string,
  clientSecret?: string,
  scope?: string,
  authorizedRedirectRoute: string,
  // If not filled in then application will automatically redirect to openid provider
  unauthorizedRedirectRoute?: string
}
