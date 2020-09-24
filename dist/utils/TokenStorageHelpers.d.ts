import { OpenIdConnectTokens } from '../interfaces/OpenIdConnectTokens';
export declare class TokenStorageHelpers {
    static getSessionAccessToken(): string;
    static getSessionRefreshToken(): string;
    static setSessionTokens(tokens: OpenIdConnectTokens): void;
    static clearSessionTokens(): void;
}
