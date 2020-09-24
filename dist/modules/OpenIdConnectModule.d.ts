import { VuexModule } from 'vuex-module-decorators';
import { OpenIdConnectConfiguration } from '../interfaces/OpenIdConnectConfiguration';
import { OpenIdConnectTokens } from '../interfaces/OpenIdConnectTokens';
import { OpenIdConnectRepository } from '../repositories/OpenIdConnectRepository';
export declare class OpenIdConnectModule extends VuexModule {
    accessToken: string;
    refreshToken: string;
    configuration: OpenIdConnectConfiguration;
    refreshTokenPromise?: Promise<any>;
    repository: OpenIdConnectRepository;
    clearTokens(): void;
    setTokens(tokens: OpenIdConnectTokens): void;
    loadSessionTokens(tokens: OpenIdConnectTokens): void;
    initializeConfig(configuration: OpenIdConnectConfiguration): void;
    setRefreshTokenPromise(promise: Promise<any>): void;
    login(finalRedirectRoute?: string): boolean;
    fetchTokens(authCode: string): Promise<string>;
    refreshTokens(): Promise<any>;
    logout(): void;
    readonly isLoggedIn: boolean;
}
