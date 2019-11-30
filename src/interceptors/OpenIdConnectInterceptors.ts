import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Store } from 'vuex'

export class OpenIdConnectInterceptors {
  public static buildRequestTokenInterceptorCallback (store: Store<any>) {
    return function (config: AxiosRequestConfig) {
      config.headers.common['Authorization'] = `Bearer ${store.state.openid.accessToken}`
      return config
    }
  }

  public static async buildResponseErrorInterceptorCallback (errorVm: any, store: Store<any>, retryAxiosInstance?: any) {
    // Only intercept 401 unauthorized calls
    if (errorVm.response && errorVm.response.status && errorVm.response.status === 401) {
      try {
        // Refresh tokens and retry call
        return store.dispatch('openid/refreshTokens').then((newTokens: any) => {
          errorVm.response.config.headers.Authorization = `Bearer ${newTokens.accessToken}`
          // Use custom retryAxiosInstance if given
          if (retryAxiosInstance) {
            return new Promise((resolve, reject) => {
              retryAxiosInstance.request(errorVm.response.config).then((response : any) => {
                resolve(response)
              }).catch((error: any) => {
                reject(error)
              })
            })
          } else {
            return new Promise((resolve, reject) => {
              axios.request(errorVm.response.config).then(response => {
                resolve(response)
              }).catch((error) => {
                reject(error)
              })
            })
          }
        })
      } catch (e) {
        throw errorVm
      }
    }
    throw errorVm
    // }
  }
}
