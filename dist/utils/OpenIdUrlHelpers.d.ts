export declare class OpenIdUrlHelpers {
    static buildInternalRedirectUrl(endpoint: string, encoded?: boolean): string;
    static buildOpenIdParameterString(parameters: object, encodeRedirectUrl: boolean): string;
    static buildFormUrlEncoded(object: object): string;
    static buildAuthEnpointWithReturnUrlEncoded(authEnpoint: string, encodeRedirectUrl: boolean): string;
}
