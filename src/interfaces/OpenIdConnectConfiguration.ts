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
  // Properties needed for doing token call on backend server (more secure and keeps clientSecret out of frontend config)
  serverBaseUrl?: string;
  serverTokenEndpoint?: string;
  serverRefreshEndpoint?: string;
  InternalRedirectUrl?: string;
  encodeRedirectUrl?: boolean;
}
