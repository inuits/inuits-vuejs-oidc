import { OpenIdConnectModule } from '@/modules/OpenIdConnectModule'
import { openIdConnectRoutes } from '@/routes/OpenIdConnectRoutes'
import { OpenIdConnectPluginOptions } from '@/interfaces/OpenIdConnectPluginOptions'
import _Vue from 'vue'

export function OpenIdConnectPlugin<OpenIdConnectPluginOptions> (Vue: typeof _Vue, options: any): void {
  if (!options.store) throw new Error('Inuits-vuejs-oidc needs a store')

  if (!options.router) throw new Error('Inuits-vuejs-oidc needs a router')

  if (!options.configuration) throw new Error('Inuits-vuejs-oidc needs configuration')

  options.store.registerModule('OpenIdConnectModule', OpenIdConnectModule)
  options.router.addRoutes(openIdConnectRoutes)
}

export { OpenIdConnectPluginOptions } from '@/interfaces/OpenIdConnectPluginOptions'
export { OpenIdConnectConfiguration } from '@/interfaces/OpenIdConnectConfiguration'
