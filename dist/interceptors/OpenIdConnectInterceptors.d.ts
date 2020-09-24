import { AxiosRequestConfig } from 'axios';
import { Store } from 'vuex';
export declare class OpenIdConnectInterceptors {
    static buildRequestTokenInterceptorCallback(store: Store<any>): (config: AxiosRequestConfig) => AxiosRequestConfig;
    static buildResponseErrorInterceptorCallback(errorVm: any, store: Store<any>, retryAxiosInstance?: any): Promise<{}>;
}
