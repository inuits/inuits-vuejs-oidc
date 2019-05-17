import RedirectPage from '@/views/RedirectPage.vue'

export const openIdConnectRoutes: object[] = [
  {
    path: 'auth/redirect',
    name: 'openIdConnect',
    component: RedirectPage
  }
]
