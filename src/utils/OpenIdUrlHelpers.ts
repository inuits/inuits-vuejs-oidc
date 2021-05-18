export class OpenIdUrlHelpers {
  public static buildInternalRedirectUrl (endpoint: string, encoded = true): string {
    let port = ''
    if (location.port) {
      port = ':' + location.port
    }
    const redirectBaseUrl = location.protocol + '//' + location.hostname + port

    if (encoded) {
      return encodeURIComponent(redirectBaseUrl + '/' + endpoint)
    } else {
      return redirectBaseUrl + '/' + endpoint
    }
  }

  public static buildOpenIdParameterString (parameters: object, encodeRedirectUrl: boolean): string {
    const parameterArray = []
    for (const [key, param] of Object.entries(parameters)) {
      if (param) {
        parameterArray.push(key + '=' + param)
      }
    }
    let openIdParameterString = '?' + parameterArray.join('&')
    if (encodeRedirectUrl) {
      openIdParameterString = encodeURIComponent(openIdParameterString)
    }
    return openIdParameterString
  }

  public static buildFormUrlEncoded (object: object): string {
    const bodyArray = []

    for (let [key, value] of Object.entries(object)) {
      if (key !== 'redirect_uri') {
        value = encodeURIComponent(value)
      }
      if (value) {
        bodyArray.push(key + '=' + value)
      }
    }
    return bodyArray.join('&')
  }

  public static buildAuthEnpointWithReturnUrlEncoded (authEnpoint: string, encodeRedirectUrl: boolean): string {
    let authEnpointWithReturnUrlEncoded = authEnpoint
    if (encodeRedirectUrl) {
      const returnUrl = authEnpoint.split('ReturnUrl=')
      authEnpointWithReturnUrlEncoded = returnUrl[0] + 'ReturnUrl=' + encodeURIComponent(returnUrl[1])
    }
    return authEnpointWithReturnUrlEncoded
  }
}
