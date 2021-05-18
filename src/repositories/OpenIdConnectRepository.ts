import axios from 'axios'
import { OpenIdUrlHelpers } from '../utils/OpenIdUrlHelpers'
import { OpenIdConnectConfiguration } from '../interfaces/OpenIdConnectConfiguration'

export class OpenIdConnectRepository {
  private configuration: OpenIdConnectConfiguration

  constructor (configuration: OpenIdConnectConfiguration) {
    this.configuration = configuration
  }

  getTokens (authCode: string): Promise<any> {
    if (this.configuration.serverBaseUrl) {
      return this.getTokensFromServer(authCode)
    } else {
      return this.getTokensFromProvider(authCode)
    }
  }

  getTokensFromProvider (authCode: string): Promise<any> {
    const redirectUrl = OpenIdUrlHelpers.buildInternalRedirectUrl('openid/redirect')
    const openIdConnectTokenUrl = `${this.configuration.baseUrl}/${this.configuration.tokenEndpoint}`

    const body = {
      code: authCode,
      grant_type: 'authorization_code',
      client_id: this.configuration.clientId,
      client_secret: this.configuration.clientSecret,
      redirect_uri: redirectUrl
    }

    return axios.post(
      openIdConnectTokenUrl,
      OpenIdUrlHelpers.buildFormUrlEncoded(body),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  }

  getTokensFromServer (authCode: string): Promise<any> {
    const redirectUrl = OpenIdUrlHelpers.buildInternalRedirectUrl(this.configuration.InternalRedirectUrl, false)
    const serverTokenUrl = `${this.configuration.serverBaseUrl}/${this.configuration.serverTokenEndpoint}`

    const body = {
      authCode: authCode,
      realm: this.configuration.baseUrl,
      clientId: this.configuration.clientId,
      redirectUri: redirectUrl
    }

    return axios.post(
      serverTokenUrl,
      body
    )
  }

  refreshTokens (refreshToken: string): Promise<any> {
    if (this.configuration.serverBaseUrl) {
      return this.refreshTokensFromServer(refreshToken)
    } else {
      return this.refreshTokensFromProvider(refreshToken)
    }
  }

  refreshTokensFromProvider (refreshToken: string): Promise<any> {
    const openIdConnectTokenUrl = `${this.configuration.baseUrl}/${this.configuration.tokenEndpoint}`

    const body = {
      grant_type: 'refresh_token',
      client_id: this.configuration.clientId,
      refresh_token: refreshToken
    }

    return axios.post(
      openIdConnectTokenUrl,
      OpenIdUrlHelpers.buildFormUrlEncoded(body),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
  }

  refreshTokensFromServer (refreshToken: string): Promise<any> {
    const serverRefreshUrl = `${this.configuration.serverBaseUrl}/${this.configuration.serverRefreshEndpoint}`

    const body = {
      realm: this.configuration.baseUrl,
      clientId: this.configuration.clientId,
      refreshToken: refreshToken
    }

    return axios.post(
      serverRefreshUrl,
      body
    )
  }
}
