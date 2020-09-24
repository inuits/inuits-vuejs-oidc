export interface OpenIdConnectConfiguration {
    baseUrl: string;
    tokenEndpoint: string;
    authEndpoint: string;
    logoutEndpoint: string;
    clientId: string;
    clientSecret?: string;
    scope?: string;
    authorizedRedirectRoute: string;
    unauthorizedRedirectRoute?: string;
    serverBaseUrl?: string;
    serverTokenEndpoint?: string;
    serverRefreshEndpoint?: string;
    InternalRedirectUrl?: string;
}
