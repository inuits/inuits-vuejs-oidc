import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Store } from 'vuex'

export class OpenIdConnectInterceptors {
  public static buildRequestTokenInterceptorCallback (store: Store<any>) {
    return function (config: AxiosRequestConfig) {
      const authorization = 'Authorization'
      config.headers.common[authorization] = `Bearer ${store.getters.accessToken}`
      return config
    }
  }

  public static async buildResponseErrorInterceptorCallback (errorVm: any, store: Store<any>, retryAxiosInstance?: any) {
    console.log('AWAIT IMPLEMENTED 1')
    // Only intercept 401 unauthorized calls
    if (errorVm.response && errorVm.response.status && errorVm.response.status === 401) {
      console.log('AWAIT IMPLEMENTED 2')
      try {
        // Refresh tokens and retry call
        console.log('AWAIT IMPLEMENTED 3')
        return await store.dispatch('refreshTokens').then((newTokens: any) => {
          errorVm.response.config.headers.Authorization = `Bearer ${newTokens.accessToken}`
          // Use custom retryAxiosInstance if given
          if (retryAxiosInstance) {
            console.log('AWAIT IMPLEMENTED 4')
            return new Promise((resolve, reject) => {
              retryAxiosInstance.request(errorVm.response.config).then((response : any) => {
                resolve(response)
              }).catch((error: any) => {
                reject(error)
              })
            })
          } else {
            console.log('AWAIT IMPLEMENTED 5')
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
