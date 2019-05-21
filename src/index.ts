import { OpenIdConnectModule } from './modules/OpenIdConnectModule'
import { openIdConnectRoutes } from './routes/OpenIdConnectRoutes'
import { OpenIdConnectPluginOptions } from './interfaces/OpenIdConnectPluginOptions'
import { getModule } from 'vuex-module-decorators'
import _Vue from 'vue'

export function OpenIdConnectPlugin<OpenIdConnectPluginOptions> (Vue: typeof _Vue, options: any): void {
  if (!options.store) throw new Error('Inuits-vuejs-oidc needs a store')

  if (!options.router) throw new Error('Inuits-vuejs-oidc needs a router')

  if (!options.configuration) throw new Error('Inuits-vuejs-oidc needs configuration')

  const oidModule = getModule(OpenIdConnectModule, options.store)
  options.store.registerModule('openid', OpenIdConnectModule)
  options.store.commit('openid/initializeConfig', options.configuration)
  options.router.addRoutes(openIdConnectRoutes)
}

export { OpenIdConnectPluginOptions } from './interfaces/OpenIdConnectPluginOptions'
export { OpenIdConnectConfiguration } from './interfaces/OpenIdConnectConfiguration'
