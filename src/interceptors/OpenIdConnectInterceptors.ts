import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Store } from 'vuex'

export class OpenIdConnectInterceptors {
  public static buildRequestTokenInterceptorCallback (store: Store<any>) {
    console.log('buildRequestTokenInterceptorCallback')
    return function (config: AxiosRequestConfig) {
      config.headers.common['Authorization'] = `Bearer ${store.state.openid.accessToken}`
      return config
    }
  }

  public static async buildResponseErrorInterceptorCallback (errorVm: any, store: Store<any>, retryAxiosInstance?: any) {
    console.log('LOG 1: ', errorVm)
    console.log('LOG 1.1 (Error Message): ', errorVm.response, errorVm.message)
    console.log('LOG 1.2: ', errorVm.response.status)
    // Only intercept 401 unauthorized calls
    if (errorVm.response && errorVm.response.status && errorVm.response.status === 401) {
      console.log('LOG 2: ', errorVm)
      try {
        console.log('LOG 3: ', errorVm)
        // Refresh tokens and retry call
        return store.dispatch('openid/refreshTokens').then((newTokens: any) => {
          console.log('LOG 4: ', errorVm)
          errorVm.response.config.headers.Authorization = `Bearer ${newTokens.accessToken}`
          // Use custom retryAxiosInstance if given
          if (retryAxiosInstance) {
            console.log('LOG 5: ', retryAxiosInstance)
            return new Promise((resolve, reject) => {
              retryAxiosInstance.request(errorVm.response.config).then((response : any) => {
                resolve(response)
              }).catch((error: any) => {
                reject(error)
              })
            })
          } else {
            console.log('LOG 6:')
            return new Promise((resolve, reject) => {
              axios.request(errorVm.response.config).then(response => {
                console.log('LOG 7: ', response)
                resolve(response)
              }).catch((error) => {
                console.log('LOG 8: ', error)
                reject(error)
              })
            })
          }
        })
      } catch (e) {
        console.log('LOG 9: ', e)
        throw errorVm
      }
    }
    throw errorVm
    // }
  }
}
