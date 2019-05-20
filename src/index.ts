import { OpenIdConnectModule } from '@/modules/OpenIdConnectModule'
import { openIdConnectRoutes } from '@/routes/OpenIdConnectRoutes'
import { OpenIdConnectConfiguration } from '@/interfaces/OpenIdConnectConfiguration'
import Router from 'vue-router'
import { Store } from 'vuex'

function install (store: Store<any>, router: Router, configuration: OpenIdConnectConfiguration) {
  if (!store) throw new Error('Inuits-vuejs-oidc needs a store')

  if (!router) throw new Error('Inuits-vuejs-oidc needs a router')

  if (!configuration) throw new Error('Inuits-vuejs-oidc needs configuration')

  store.registerModule('OpenIdConnectModule', OpenIdConnectModule)
  router.addRoutes(openIdConnectRoutes)
}

export default {
  install
}

export {
  OpenIdConnectConfiguration
}
