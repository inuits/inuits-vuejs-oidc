import { createStore } from 'vuex'
import OpenIdConnectModule from './modules/OpenIdConnectModule'

const store = createStore({
  modules: {
    OpenIdConnectModule
  }
})

export default store
