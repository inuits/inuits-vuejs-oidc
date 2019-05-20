import RedirectPage from '@/views/RedirectPage.vue'
import { RouteConfig } from 'vue-router'

export const openIdConnectRoutes: RouteConfig[] = [
  {
    path: 'auth/redirect',
    name: 'openIdConnect',
    component: RedirectPage
  }
]
