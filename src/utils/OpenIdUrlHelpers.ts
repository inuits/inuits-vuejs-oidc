export class OpenIdUrlHelpers {
  public static buildInternalRedirectUrl (endpoint: string): string {
    let port = ''
    if (location.port) {
      port = ':' + location.port
    }
    const redirectBaseUrl = location.protocol + '//' + location.hostname + port
    return encodeURIComponent(redirectBaseUrl + '/' + endpoint)
  }

  public static buildOpenIdParameterString (parameters: object): string {
    let parameterArray = []
    for (let [key, param] of Object.entries(parameters)) {
      if (param) {
        parameterArray.push(key + '=' + param)
      }
    }
    return parameterArray.join('&')
  }

  public static buildFormUrlEncoded (object: object): string {
    let bodyArray = []

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
}
