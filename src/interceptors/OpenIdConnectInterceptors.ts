import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Store } from 'vuex'

export class OpenIdConnectInterceptors {
  public static buildRequestTokenInterceptorCallback (store: Store<any>) {
    return function (config: AxiosRequestConfig) {
      config.headers.common['Authorization'] = `Bearer ${store.state.openid.accessToken}`
      return config
    }
  }

  public static buildResponseErrorInterceptorCallback (store: Store<any>, retryAxiosInstance?: any) {
    return async function (error: any) {
      // Only intercept 401 unauthorized calls
      if (error.response && error.response.status && error.response.status === 401) {
        try {
          // Refresh tokens and retry call
          const newTokens = await store.dispatch('openid/refreshTokens')
          error.config.headers.common['Authorization'] = `Bearer ${newTokens.accessToken}`

          // Use custom retryAxiosInstance if given
          if (retryAxiosInstance) {
            return retryAxiosInstance.request(error.config)
          } else {
            return axios.request(error.config)
          }
        } catch (e) {
          throw error
        }
      }
      throw error
    }
  }
}
