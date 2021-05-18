import { OpenIdConnectConfiguration } from '@/interfaces/OpenIdConnectConfiguration';
import { OpenIdConnectTokens } from '@/interfaces/OpenIdConnectTokens';
import { OpenIdConnectRepository } from '@/repositories/OpenIdConnectRepository';
export declare enum Tokens {
    AccessToken = "access_token",
    RefreshToken = "refresh_token"
}
declare const _default: {
    state: () => {
        openid: {
            accessToken: string;
            refreshToken: string;
            configuration: OpenIdConnectConfiguration;
            refreshTokenPromise: PromiseConstructor;
            repository: OpenIdConnectRepository;
        };
    };
    mutations: {
        CLEAR_TOKENS(state: any): void;
        SET_TOKENS(state: any, tokens: OpenIdConnectTokens): void;
        LOAD_SESSION_TOKENS(state: any): void;
        INITIALIZE_CONFIG(state: any, configuration: OpenIdConnectConfiguration): void;
        SET_REFRESH_TOKEN_PROMISE(state: any, promise: Promise<any>): void;
    };
    actions: {
        clearTokens({ commit }: any, data: any): void;
        setTokens({ commit }: any, data: any): void;
        loadSessionTokens({ commit }: any, data: any): void;
        initializeConfig({ commit }: any, data: any): void;
        setRefreshTokenPromise({ commit }: any, data: any): void;
        login({ commit, state }: any, finalRedirectRoute?: string): boolean;
        fetchTokens({ dispatch, state }: any, authCode: string): any;
        refreshTokens({ dispatch, store }: any): any;
        logout({ commit, state }: any, data: any): void;
    };
    getters: {
        isLoggedIn(state: any): boolean;
        accessToken(state: any): string;
    };
};
export default _default;
