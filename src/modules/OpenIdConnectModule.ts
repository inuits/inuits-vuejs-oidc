import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { OpenIdConnectConfiguration } from '@/interfaces/OpenIdConnectConfiguration'
import { OpenIdConnectTokens } from '@/interfaces/OpenIdConnectTokens'
import axios from 'axios'

@Module
export class OpenIdConnectModule extends VuexModule {
  accessToken: string = ''
  refreshToken: string = ''
  configuration?: OpenIdConnectConfiguration

  @Mutation
  clearTokens () {
    this.accessToken = ''
    this.refreshToken = ''
  }

  @Mutation
  setTokens (tokens: OpenIdConnectTokens) {
    this.accessToken = tokens.accessToken
    this.refreshToken = tokens.refreshToken
  }

  @Mutation
  setConfiguration (configuration: OpenIdConnectConfiguration) {
    this.configuration = configuration
  }

  @Action({})
  login () {
    const redirectUrl = this.buildInternalRedirectUrl('auth/redirect')

    // Build openIdConnect url
    const baseOpenIdConnectUrl = `${this.configuration!.baseUrl}/${this.configuration!.authEndpoint}`
    const openIdParameters = {
      scope: this.configuration!.scope ? this.configuration!.scope : 'openid',
      client_id: this.configuration!.clientId,
      response_type: 'code',
      redirect_uri: redirectUrl
    }
    const openIdConnectUrl = baseOpenIdConnectUrl + '?' + this.buildOpenIdParameterString(openIdParameters)
    window.location.href = openIdConnectUrl
  }

  @Action({})
  fetchTokens (authCode: string) {
    const redirectUrl = this.buildInternalRedirectUrl('auth/redirect')

    const openIdConnectTokenUrl = `${this.configuration!.baseUrl}/${this.configuration!.tokenEndpoint}`

    let body = {
      code: authCode,
      grant_type: 'authorization_code',
      client_id: this.configuration!.clientId,
      client_secret: this.configuration!.clientSecret,
      redirect_uri: redirectUrl
    }

    axios.post(
      openIdConnectTokenUrl,
      body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).then((result: any) => {
      const tokens = {
        accessToken: result['access_token'],
        refreshToken: result['refresh_token']
      }
      this.context.commit('setTokens', tokens)
    })
  }

  @Action({})
  refreshTokens () {
    const openIdConnectTokenUrl = `${this.configuration!.baseUrl}/${this.configuration!.tokenEndpoint}`

    let body = {
      grant_type: 'refresh_token',
      client_id: this.configuration!.clientId,
      refresh_token: this.refreshToken
    }

    axios.post(
      openIdConnectTokenUrl,
      body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).then(
      (result: any) => {
        const tokens = {
          accessToken: result['access_token'],
          refreshToken: result['refresh_token']
        }
        this.context.commit('setTokens', tokens)
      },
      (error) => {
        this.context.commit('clearTokens')
      }
    )
  }

  @Action({})
  logout () {
    const redirectUrl = this.buildInternalRedirectUrl(this.configuration!.logoutRedirectPath)

    // Build openIdConnect url
    const baseOpenIdConnectUrl = `${this.configuration!.baseUrl}/${this.configuration!.logoutEndpoint}`
    const openIdParameters = {
      scope: this.configuration!.scope ? this.configuration!.scope : 'openid',
      client_id: this.configuration!.clientId,
      redirect_uri: redirectUrl
    }
    const openIdConnectUrl = baseOpenIdConnectUrl + '?' + this.buildOpenIdParameterString(openIdParameters)
    window.location.href = openIdConnectUrl
  }

  private buildInternalRedirectUrl (endpoint: string): string {
    const redirectBaseUrl = location.protocol + '//' + location.hostname
    return encodeURIComponent(redirectBaseUrl + '/' + endpoint)
  }

  private buildOpenIdParameterString (parameters: object): string {
    let parameterString = ''
    for (let [key, param] of Object.entries(parameters)) {
      if (param) {
        parameterString += key + '=' + param
      }
    }
    return parameterString
  }
}
