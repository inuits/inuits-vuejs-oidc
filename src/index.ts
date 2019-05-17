import yourComponent from './yourComponent.vue'
import OpenIdConnectModule from '@/modules/OpenIdConnectModule'

function install (options: any = {}) {
  if (!options.store) console.log('Please provide a store')

  options.store.registerModule('OpenIdConnectModule', OpenIdConnectModule)
}

export default {
  install
}
