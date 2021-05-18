import OpenIdConnectModule from './store/modules/OpenIdConnectModule'
import { openIdConnectRoutes } from './routes/OpenIdConnectRoutes'
import _Vue from 'vue'

export function OpenIdConnectPlugin<OpenIdConnectPluginOptions> (Vue: typeof _Vue, options: any): void {
  if (!options.store) throw new Error('Inuits-vuejs-oidc needs a store')

  if (!options.router) throw new Error('Inuits-vuejs-oidc needs a router')

  if (!options.configuration) throw new Error('Inuits-vuejs-oidc needs configuration')

  options.store.registerModule('openid', OpenIdConnectModule)
  options.store.dispatch('initializeConfig', options.configuration)


  openIdConnectRoutes.forEach(route => {
    options.router.addRoute(route)
  })

  // Add some auth guards to routes with specific meta tags
  options.router.beforeEach((to: any, from: any, next: any) => {
    if (to.matched.some((record: any) => record.meta.requiresOpenIdAuth)) {
      if (!options.store.getters.isLoggedIn) {
        if (options.configuration.unauthorizedRedirectRoute) {
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        } else {
          options.store.dispatch('login', to.fullPath)
          next()
        }
      } else {
        next()
      }
    } else {
      next()
    }
  })
}

export { OpenIdConnectPluginOptions } from './interfaces/OpenIdConnectPluginOptions'
export { OpenIdConnectConfiguration } from './interfaces/OpenIdConnectConfiguration'
export { OpenIdConnectInterceptors } from './interceptors/OpenIdConnectInterceptors'
