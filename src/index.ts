import { OpenIdConnectModule } from './modules/OpenIdConnectModule'
import { openIdConnectRoutes } from './routes/OpenIdConnectRoutes'
import { OpenIdConnectPluginOptions } from './interfaces/OpenIdConnectPluginOptions'
import { getModule } from 'vuex-module-decorators'
import TokenRedirectPage from './views/TokenRedirectPage.vue'
import _Vue from 'vue'

export function OpenIdConnectPlugin<OpenIdConnectPluginOptions> (Vue: typeof _Vue, options: any): void {
  if (!options.store) throw new Error('Inuits-vuejs-oidc needs a store')

  if (!options.router) throw new Error('Inuits-vuejs-oidc needs a router')

  if (!options.configuration) throw new Error('Inuits-vuejs-oidc needs configuration')

  const oidModule = getModule(OpenIdConnectModule, options.store)
  options.store.registerModule('openid', OpenIdConnectModule)
  options.store.commit('openid/initializeConfig', options.configuration)
  options.router.addRoutes(openIdConnectRoutes)

  // Add some auth guards to routes with specific meta tags
  options.router.beforeEach((to: any, from: any, next: any) => {
    if (to.matched.some((record: any) => record.meta.requiresOpenIdAuth)) {
      if (!options.store.getters('openid/isLoggedIn')) {
        if (options.configuration.unauthorizedRedirectRoute) {
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        } else {
          options.store.dispatch('openid/login', to.fullPath)
        }
      } else {
        next()
      }
    } else {
      next()
    }
  })

  // Fix to make store and router available in redirect page component
  // In future try to find a better solution
  // Vue.prototype.$oidcRouter = options.router
}

export { OpenIdConnectPluginOptions } from './interfaces/OpenIdConnectPluginOptions'
export { OpenIdConnectConfiguration } from './interfaces/OpenIdConnectConfiguration'
