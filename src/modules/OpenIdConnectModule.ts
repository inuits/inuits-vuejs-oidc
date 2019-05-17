import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

@Module
export default class OpenIdConnectModule extends VuexModule {
  accessToken: string = ''
  refreshToken: string = ''

  @Mutation
  clearTokens () {
      this.accessToken = ''
      this.refreshToken = ''
  }
  @Mutation
  setTokens (accessToken: string, refreshToken: string) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
  }

  @Action({})
  fetchNewTokens (accessCode: string) {
      console.log('')
  }
}
