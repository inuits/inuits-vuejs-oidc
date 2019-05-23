import { OpenIdConnectTokens } from '../interfaces/OpenIdConnectTokens'

const accessTokenKey = 'oidc-access-token'
const refreshTokenKey = 'oidc-refresh-token'

export class TokenStorageHelpers {
  public static getSessionAccessToken (): string {
    return sessionStorage.getItem(accessTokenKey) ? sessionStorage.getItem(accessTokenKey)! : ''
  }

  public static getSessionRefreshToken (): string {
    return sessionStorage.getItem(refreshTokenKey) ? sessionStorage.getItem(refreshTokenKey)! : ''
  }

  public static setSessionTokens (tokens: OpenIdConnectTokens) {
    sessionStorage.setItem(accessTokenKey, tokens.accessToken)
    sessionStorage.setItem(refreshTokenKey, tokens.refreshToken)
  }

  public static clearSessionTokens () {
    sessionStorage.removeItem(accessTokenKey)
    sessionStorage.removeItem(refreshTokenKey)
  }
}
