const loginRedirectRouteKey = 'oidc-login-redirect-route'

export class RedirectRouteStorageHelpers {
  public static setRedirectRoute (route: string) {
    sessionStorage.setItem(loginRedirectRouteKey, route)
  }

  public static getRedirectRoute (): string {
    const redirectRoute = sessionStorage.getItem(loginRedirectRouteKey) ? sessionStorage.getItem(loginRedirectRouteKey)! : ''
    sessionStorage.removeItem(loginRedirectRouteKey)
    return redirectRoute
  }
}
