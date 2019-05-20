import { OpenIdConnectConfiguration } from '@/interfaces/OpenIdConnectConfiguration'
import Router from 'vue-router'
import { Store } from 'vuex'

export interface OpenIdConnectPluginOptions {
  store: Store<any>,
  router: Router,
  configuration: OpenIdConnectConfiguration
}
