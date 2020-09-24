import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { OpenIdConnectConfiguration } from '../interfaces/OpenIdConnectConfiguration'
import { OpenIdConnectTokens } from '../interfaces/OpenIdConnectTokens'
import axios from 'axios'
import { OpenIdUrlHelpers } from '../utils/OpenIdUrlHelpers'
import { TokenStorageHelpers } from '../utils/TokenStorageHelpers'
import { RedirectRouteStorageHelpers } from '../utils/RedirectRouteStorageHelpers'
import { OpenIdConnectRepository } from '../repositories/OpenIdConnectRepository'

@Module({ namespaced: true, name: 'openid' })
export class OpenIdConnectModule extends VuexModule {
  // Data
  accessToken: string = TokenStorageHelpers.getSessionAccessToken()
  refreshToken: string = TokenStorageHelpers.getSessionRefreshToken()
  configuration: OpenIdConnectConfiguration = {
    baseUrl: '',
    tokenEndpoint: '',
    authEndpoint: '',
    logoutEndpoint: '',
    clientId: '',
    authorizedRedirectRoute: '',
    InternalRedirectUrl: 'openid/redirect'
  }

  refreshTokenPromise?: Promise<any>

  repository: OpenIdConnectRepository = new OpenIdConnectRepository(this.configuration)

  // Mutations
  @Mutation
  clearTokens () {
    this.accessToken = ''
    this.refreshToken = ''
    TokenStorageHelpers.clearSessionTokens()
  }

  @Mutation
  setTokens (tokens: OpenIdConnectTokens) {
    this.accessToken = tokens.accessToken
    this.refreshToken = tokens.refreshToken

    TokenStorageHelpers.setSessionTokens(tokens)
  }

  @Mutation
  loadSessionTokens (tokens: OpenIdConnectTokens) {
    this.accessToken = TokenStorageHelpers.getSessionAccessToken()
    this.refreshToken = TokenStorageHelpers.getSessionRefreshToken()
  }

  @Mutation
  initializeConfig (configuration: OpenIdConnectConfiguration) {
    console.log('initializeConfig')
    // Make sure that if serverBaseUrl is defined, we also have it's related endpoints
    if (configuration.serverBaseUrl) {
      if (!configuration.serverTokenEndpoint || !configuration.serverRefreshEndpoint) {
        throw new Error('Configuration contains a serverBaseUrl but not all of the required server endpoints')
      }
    }
    this.configuration = configuration
    this.repository = new OpenIdConnectRepository(configuration)
  }

  @Mutation
  setRefreshTokenPromise (promise: Promise<any>) {
    this.refreshTokenPromise = promise
  }

  // Actions
  @Action({})
  login (finalRedirectRoute?: string) {
    console.log('login')
    // First check if there are still tokens in sessionStorage
    this.context.commit('loadSessionTokens')
    if (this.accessToken) {
      return true
    }
    console.log(this.configuration.InternalRedirectUrl)
    const redirectUrl = OpenIdUrlHelpers.buildInternalRedirectUrl(this.configuration.InternalRedirectUrl)
    // Build openIdConnect url
    const baseOpenIdConnectUrl = `${this.configuration.baseUrl}/${this.configuration.authEndpoint}`
    const openIdParameters = {
      scope: this.configuration.scope ? this.configuration.scope : 'openid',
      client_id: this.configuration.clientId,
      response_type: 'code',
      redirect_uri: redirectUrl
    }
    const openIdConnectUrl = baseOpenIdConnectUrl + '?' + OpenIdUrlHelpers.buildOpenIdParameterString(openIdParameters)

    // Save final redirect route in session storage so it can be used at the end of the openid flow
    if (finalRedirectRoute) {
      RedirectRouteStorageHelpers.setRedirectRoute(finalRedirectRoute)
    }
    window.location.href = openIdConnectUrl
  }

  @Action({})
  fetchTokens (authCode: string) {
    console.log('fetchtokens')
    return this.repository.getTokens(authCode).then((result: any) => {
      const tokens = {
        accessToken: result.data['access_token'],
        refreshToken: result.data['refresh_token']
      }
      this.context.commit('setTokens', tokens)

      let redirectRoute = this.configuration.authorizedRedirectRoute

      // Overwrite redirect route if available in session storage
      const storedRedirectRoute = RedirectRouteStorageHelpers.getRedirectRoute()
      if (storedRedirectRoute) {
        redirectRoute = storedRedirectRoute
      }
      return redirectRoute
    })
  }

  @Action({})
  refreshTokens () {
    // Make sure refreshTokens isn't executed multiple times
    console.log('refreshTokens')
    if (!this.refreshTokenPromise) {
      const promise = this.repository.refreshTokens(this.refreshToken)
      this.context.commit('setRefreshTokenPromise', promise)

      return promise.then(
        (result: any) => {
          this.context.commit('setRefreshTokenPromise', null)
          const tokens = {
            accessToken: result.data['access_token'],
            refreshToken: result.data['refresh_token']
          }
          this.context.commit('setTokens', tokens)
          return tokens
        },
        (error) => {
          this.context.commit('setRefreshTokenPromise', null)
          this.context.commit('clearTokens')
          this.context.dispatch('login')
        }
      )
    }
    return this.refreshTokenPromise
  }

  @Action({})
  logout () {
    console.log('logout')
    // Overwrite unauthorized redirect route if given
    let redirectRoute = 'openid/logout'
    if (this.configuration.unauthorizedRedirectRoute) {
      redirectRoute = this.configuration.unauthorizedRedirectRoute
    }

    const redirectUrl = OpenIdUrlHelpers.buildInternalRedirectUrl(redirectRoute)

    // Build openIdConnect url
    const baseOpenIdConnectUrl = `${this.configuration.baseUrl}/${this.configuration.logoutEndpoint}`
    const openIdParameters = {
      scope: this.configuration.scope ? this.configuration.scope : 'openid',
      client_id: this.configuration.clientId,
      redirect_uri: redirectUrl
    }

    this.context.commit('clearTokens')
    const openIdConnectUrl = baseOpenIdConnectUrl + '?' + OpenIdUrlHelpers.buildOpenIdParameterString(openIdParameters)
    window.location.href = openIdConnectUrl
  }

  // Getters
  get isLoggedIn (): boolean {
    return !!this.accessToken
  }
}
