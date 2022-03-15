import { OpenIdConnectConfiguration } from '@/interfaces/OpenIdConnectConfiguration'
import { OpenIdConnectTokens } from '@/interfaces/OpenIdConnectTokens'
import { OpenIdConnectRepository } from '@/repositories/OpenIdConnectRepository'
import { OpenIdUrlHelpers } from '@/utils/OpenIdUrlHelpers'
import { RedirectRouteStorageHelpers } from '@/utils/RedirectRouteStorageHelpers'
import { TokenStorageHelpers } from '../../utils/TokenStorageHelpers'

const configuration: OpenIdConnectConfiguration = {
  baseUrl: '',
  tokenEndpoint: '',
  authEndpoint: '',
  logoutEndpoint: '',
  clientId: '',
  authorizedRedirectRoute: '',
  InternalRedirectUrl: 'openid/redirect',
  encodeRedirectUrl: false
}

export enum Tokens {
  AccessToken = 'access_token',
  RefreshToken = 'refresh_token',
}

export default {
  state: () => ({
    openid: {
      accessToken: TokenStorageHelpers.getSessionAccessToken(),
      refreshToken: TokenStorageHelpers.getSessionRefreshToken(),
      configuration: configuration,
      refreshTokenPromise: false,
      repository: new OpenIdConnectRepository(configuration)
    }
  }),
  mutations: {
    CLEAR_TOKENS (state: any) {
      state.openid.accessToken = ''
      state.openid.refreshToken = ''
      TokenStorageHelpers.clearSessionTokens()
    },
    SET_TOKENS (state: any, tokens: OpenIdConnectTokens) {
      state.openid.accessToken = tokens.accessToken
      state.openid.refreshToken = tokens.refreshToken
      TokenStorageHelpers.setSessionTokens(tokens)
    },
    LOAD_SESSION_TOKENS (state: any) {
      state.openid.accessToken = TokenStorageHelpers.getSessionAccessToken()
      state.openid.refreshToken = TokenStorageHelpers.getSessionRefreshToken()
    },
    INITIALIZE_CONFIG (state: any, configuration: OpenIdConnectConfiguration) {
      // Make sure that if serverBaseUrl is defined, we also have it's related endpoints
      if (configuration.serverBaseUrl) {
        if (
          !configuration.serverTokenEndpoint ||
          !configuration.serverRefreshEndpoint
        ) {
          throw new Error(
            'Configuration contains a serverBaseUrl but not all of the required server endpoints'
          )
        }
      }
      if (!configuration.InternalRedirectUrl) {
        configuration.InternalRedirectUrl = 'openid/redirect'
      }
      state.openid.configuration = configuration
      state.openid.repository = new OpenIdConnectRepository(configuration)
    },
    SET_REFRESH_TOKEN_PROMISE (state: any, promise: Promise<any>) {
      state.openid.refreshTokenPromise = promise
    }
  },
  actions: {
    clearTokens ({ commit }: any, data: any) {
      commit('CLEAR_TOKENS', data)
    },
    setTokens ({ commit }: any, data: any) {
      console.log('SETTING TOKENS!!!')
      commit('SET_TOKENS', data)
    },
    loadSessionTokens ({ commit }: any, data: any) {
      commit('LOAD_SESSION_TOKENS', data)
    },
    initializeConfig ({ commit }: any, data: any) {
      commit('INITIALIZE_CONFIG', data)
    },
    setRefreshTokenPromise ({ commit }: any, data: any) {
      commit('SET_REFRESH_TOKEN_PROMISE', data)
    },
    login ({ commit, state }: any, finalRedirectRoute?: string) {
      // First check if there are still tokens in sessionStorage
      commit('LOAD_SESSION_TOKENS')
      if (state.openid.accessToken) {
        return true
      }
      const redirectUrl = OpenIdUrlHelpers.buildInternalRedirectUrl(
        state.openid.configuration.InternalRedirectUrl,
        !state.openid.configuration.encodeRedirectUrl
      )
      // Build openIdConnect url

      const authEndpoint =
        OpenIdUrlHelpers.buildAuthEnpointWithReturnUrlEncoded(
          state.openid.configuration.authEndpoint,
          state.openid.configuration.encodeRedirectUrl
        )
      const baseOpenIdConnectUrl = `${state.openid.configuration.baseUrl}/${authEndpoint}`

      const openIdParameters = {
        scope: state.openid.configuration.scope
          ? state.openid.configuration.scope
          : 'openid',
        client_id: state.openid.configuration.clientId,
        response_type: 'code',
        redirect_uri: redirectUrl
      }

      const openIdConnectUrl =
        baseOpenIdConnectUrl +
        OpenIdUrlHelpers.buildOpenIdParameterString(
          openIdParameters,
          state.openid.configuration.encodeRedirectUrl
        )

      // Save final redirect route in session storage so it can be used at the end of the openid flow
      if (finalRedirectRoute) {
        RedirectRouteStorageHelpers.setRedirectRoute(finalRedirectRoute)
      }
      window.location.href = openIdConnectUrl
    },
    fetchTokens ({ dispatch, state }: any, authCode: string) {
      return state.openid.repository.getTokens(authCode).then((result: any) => {
        const tokens = {
          accessToken: result.data[Tokens.AccessToken],
          refreshToken: result.data[Tokens.RefreshToken]
        }
        dispatch('setTokens', tokens)

        let redirectRoute = state.openid.configuration.authorizedRedirectRoute

        // Overwrite redirect route if available in session storage
        const storedRedirectRoute =
          RedirectRouteStorageHelpers.getRedirectRoute()
        if (storedRedirectRoute) {
          redirectRoute = storedRedirectRoute
        }
        return redirectRoute
      })
    },
    refreshTokens ({ dispatch, state }: any) {
      if (!state.openid.refreshTokenPromise) {
        console.log('Refreshing tokens')
        const promise = state.openid.repository.refreshTokens(
          state.openid.refreshToken
        )
        dispatch('setRefreshTokenPromise', promise)

        return promise.then(
          (result: any) => {
            console.log('AWAIT IMPLEMENTED 8', result)
            dispatch('setRefreshTokenPromise', null)
            const tokens = {
              accessToken: result.data[Tokens.AccessToken],
              refreshToken: result.data[Tokens.RefreshToken]
            }
            dispatch('setTokens', tokens)
            return tokens
          },
          (error: any) => {
            dispatch('setRefreshTokenPromise', null)
            dispatch('clearTokens')
            dispatch('login')
          }
        )
      }
      console.log('AWAIT IMPLEMENTED 6')
      console.log('Using existing refresh token promise')
      return state.openid.refreshTokenPromise
    },
    logout ({ commit, state }: any, data: any) {
      // Overwrite unauthorized redirect route if given
      let redirectRoute = 'openid/logout'
      if (state.openid.configuration.unauthorizedRedirectRoute) {
        redirectRoute = state.openid.configuration.unauthorizedRedirectRoute
      }

      const redirectUrl =
        OpenIdUrlHelpers.buildInternalRedirectUrl(redirectRoute)

      // Build openIdConnect url
      const baseOpenIdConnectUrl = `${state.openid.configuration.baseUrl}/${state.openid.configuration.logoutEndpoint}`
      const openIdParameters = {
        scope: state.openid.configuration.scope
          ? state.openid.configuration.scope
          : 'openid',
        client_id: state.openid.configuration.clientId,
        redirect_uri: redirectUrl
      }

      commit('clearTokens')
      const openIdConnectUrl =
        baseOpenIdConnectUrl +
        '?' +
        OpenIdUrlHelpers.buildOpenIdParameterString(
          openIdParameters,
          state.openid.configuration.encodeRedirectUrl
        )
      window.location.href = openIdConnectUrl
    }
  },
  getters: {
    isLoggedIn (state: any): boolean {
      return !!state.openid.accessToken
    },
    accessToken (state: any): string {
      return state.openid.accessToken
    }
  }
}
