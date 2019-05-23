import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { OpenIdConnectConfiguration } from '../interfaces/OpenIdConnectConfiguration'
import { OpenIdConnectTokens } from '../interfaces/OpenIdConnectTokens'
import axios from 'axios'
import { OpenIdUrlHelpers } from '../utils/OpenIdUrlHelpers'

@Module({ namespaced: true, name: 'openid' })
export class OpenIdConnectModule extends VuexModule {
  accessToken: string = ''
  refreshToken: string = ''
  configuration: OpenIdConnectConfiguration = {
    baseUrl: '',
    tokenEndpoint: '',
    authEndpoint: '',
    logoutEndpoint: '',
    clientId: '',
    loginRedirectPath: '',
    logoutRedirectPath: ''
  }

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
  initializeConfig (configuration: OpenIdConnectConfiguration) {
    this.configuration = configuration
  }

  @Action({})
  login () {
    const redirectUrl = OpenIdUrlHelpers.buildInternalRedirectUrl('openid/redirect')
    // Build openIdConnect url
    const baseOpenIdConnectUrl = `${this.configuration.baseUrl}/${this.configuration.authEndpoint}`
    const openIdParameters = {
      scope: this.configuration.scope ? this.configuration.scope : 'openid',
      client_id: this.configuration.clientId,
      response_type: 'code',
      redirect_uri: redirectUrl
    }
    const openIdConnectUrl = baseOpenIdConnectUrl + '?' + OpenIdUrlHelpers.buildOpenIdParameterString(openIdParameters)
    window.location.href = openIdConnectUrl
  }

  @Action({})
  fetchTokens (authCode: string) {
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
    ).then((result: any) => {
      const tokens = {
        accessToken: result['access_token'],
        refreshToken: result['refresh_token']
      }
      this.context.commit('setTokens', tokens)
      return this.configuration.loginRedirectPath
    })
  }

  @Action({})
  refreshTokens () {
    const openIdConnectTokenUrl = `${this.configuration.baseUrl}/${this.configuration.tokenEndpoint}`

    let body = {
      grant_type: 'refresh_token',
      client_id: this.configuration.clientId,
      refresh_token: this.refreshToken
    }

    axios.post(
      openIdConnectTokenUrl,
      OpenIdUrlHelpers.buildFormUrlEncoded(body),
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
    const redirectUrl = OpenIdUrlHelpers.buildInternalRedirectUrl(this.configuration.logoutRedirectPath)

    // Build openIdConnect url
    const baseOpenIdConnectUrl = `${this.configuration.baseUrl}/${this.configuration.logoutEndpoint}`
    const openIdParameters = {
      scope: this.configuration.scope ? this.configuration.scope : 'openid',
      client_id: this.configuration.clientId,
      redirect_uri: redirectUrl
    }
    const openIdConnectUrl = baseOpenIdConnectUrl + '?' + OpenIdUrlHelpers.buildOpenIdParameterString(openIdParameters)
    window.location.href = openIdConnectUrl
  }
}
