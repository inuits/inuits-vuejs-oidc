import Vue from 'vue'
import Vuex from 'vuex'
import OpenIdConnectModule from '@/modules/OpenIdConnectModule'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    OpenIdConnectModule
  }
})
