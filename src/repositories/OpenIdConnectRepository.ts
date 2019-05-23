import axios from 'axios'
import { OpenIdUrlHelpers } from '../utils/OpenIdUrlHelpers'
import { OpenIdConnectConfiguration } from '../interfaces/OpenIdConnectConfiguration'

export class OpenIdConnectRepository {
  private configuration: OpenIdConnectConfiguration = {
    baseUrl: '',
    tokenEndpoint: '',
    authEndpoint: '',
    logoutEndpoint: '',
    clientId: '',
    loginRedirectPath: '',
    logoutRedirectPath: ''
  }

  constructor (configuration: OpenIdConnectConfiguration) {
    this.configuration = configuration
  }

  getTokens (authCode: string): Promise<any> {
    const redirectUrl = OpenIdUrlHelpers.buildInternalRedirectUrl('openid/redirect')

    const openIdConnectTokenUrl = `${this.configuration.baseUrl}/${this.configuration.tokenEndpoint}`

    let body = {
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

  refreshTokens (refreshToken: string): Promise<any> {
    const openIdConnectTokenUrl = `${this.configuration.baseUrl}/${this.configuration.tokenEndpoint}`

    let body = {
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
}
