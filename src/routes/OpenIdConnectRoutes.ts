import RedirectPage from '../views/RedirectPage.vue'
import { RouteConfig } from 'vue-router'

export const openIdConnectRoutes: RouteConfig[] = [
  {
    path: '/openid/redirect',
    name: 'openIdConnect',
    component: RedirectPage
  }
]
