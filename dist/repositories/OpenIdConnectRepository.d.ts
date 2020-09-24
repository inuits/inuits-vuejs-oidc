import { OpenIdConnectConfiguration } from '../interfaces/OpenIdConnectConfiguration';
export declare class OpenIdConnectRepository {
    private configuration;
    constructor(configuration: OpenIdConnectConfiguration);
    getTokens(authCode: string): Promise<any>;
    getTokensFromProvider(authCode: string): Promise<any>;
    getTokensFromServer(authCode: string): Promise<any>;
    refreshTokens(refreshToken: string): Promise<any>;
    refreshTokensFromProvider(refreshToken: string): Promise<any>;
    refreshTokensFromServer(refreshToken: string): Promise<any>;
}
