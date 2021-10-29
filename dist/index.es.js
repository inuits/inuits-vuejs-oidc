import { Mutation, Action, Module, VuexModule, getModule } from 'vuex-module-decorators';
import axios from 'axios';
import Vue from 'vue';
import Component from 'vue-class-component';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var OpenIdUrlHelpers = /** @class */ (function () {
    function OpenIdUrlHelpers() {
    }
    OpenIdUrlHelpers.buildInternalRedirectUrl = function (endpoint, encoded) {
        if (encoded === void 0) { encoded = true; }
        var port = '';
        if (location.port) {
            port = ':' + location.port;
        }
        var redirectBaseUrl = location.protocol + '//' + location.hostname + port;
        if (encoded) {
            return encodeURIComponent(redirectBaseUrl + '/' + endpoint);
        }
        else {
            return redirectBaseUrl + '/' + endpoint;
        }
    };
    OpenIdUrlHelpers.buildOpenIdParameterString = function (parameters) {
        var parameterArray = [];
        for (var _i = 0, _a = Object.entries(parameters); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], param = _b[1];
            if (param) {
                parameterArray.push(key + '=' + param);
            }
        }
        return parameterArray.join('&');
    };
    OpenIdUrlHelpers.buildFormUrlEncoded = function (object) {
        var bodyArray = [];
        for (var _i = 0, _a = Object.entries(object); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (key !== 'redirect_uri') {
                value = encodeURIComponent(value);
            }
            if (value) {
                bodyArray.push(key + '=' + value);
            }
        }
        return bodyArray.join('&');
    };
    return OpenIdUrlHelpers;
}());

var accessTokenKey = 'oidc-access-token';
var refreshTokenKey = 'oidc-refresh-token';
var TokenStorageHelpers = /** @class */ (function () {
    function TokenStorageHelpers() {
    }
    TokenStorageHelpers.getSessionAccessToken = function () {
        return sessionStorage.getItem(accessTokenKey) ? sessionStorage.getItem(accessTokenKey) : '';
    };
    TokenStorageHelpers.getSessionRefreshToken = function () {
        return sessionStorage.getItem(refreshTokenKey) ? sessionStorage.getItem(refreshTokenKey) : '';
    };
    TokenStorageHelpers.setSessionTokens = function (tokens) {
        sessionStorage.setItem(accessTokenKey, tokens.accessToken);
        sessionStorage.setItem(refreshTokenKey, tokens.refreshToken);
    };
    TokenStorageHelpers.clearSessionTokens = function () {
        sessionStorage.removeItem(accessTokenKey);
        sessionStorage.removeItem(refreshTokenKey);
    };
    return TokenStorageHelpers;
}());

var loginRedirectRouteKey = 'oidc-login-redirect-route';
var RedirectRouteStorageHelpers = /** @class */ (function () {
    function RedirectRouteStorageHelpers() {
    }
    RedirectRouteStorageHelpers.setRedirectRoute = function (route) {
        sessionStorage.setItem(loginRedirectRouteKey, route);
    };
    RedirectRouteStorageHelpers.getRedirectRoute = function () {
        var redirectRoute = sessionStorage.getItem(loginRedirectRouteKey) ? sessionStorage.getItem(loginRedirectRouteKey) : '';
        sessionStorage.removeItem(loginRedirectRouteKey);
        return redirectRoute;
    };
    return RedirectRouteStorageHelpers;
}());

var OpenIdConnectRepository = /** @class */ (function () {
    function OpenIdConnectRepository(configuration) {
        this.configuration = configuration;
    }
    OpenIdConnectRepository.prototype.getTokens = function (authCode) {
        if (this.configuration.serverBaseUrl) {
            return this.getTokensFromServer(authCode); // KOMT HIERIN
        }
        else {
            return this.getTokensFromProvider(authCode);
        }
    };
    OpenIdConnectRepository.prototype.getTokensFromProvider = function (authCode) {
        var redirectUrl = OpenIdUrlHelpers.buildInternalRedirectUrl('openid/redirect');
        var openIdConnectTokenUrl = this.configuration.baseUrl + "/" + this.configuration.tokenEndpoint;
        var body = {
            code: authCode,
            grant_type: 'authorization_code',
            client_id: this.configuration.clientId,
            client_secret: this.configuration.clientSecret,
            redirect_uri: redirectUrl
        };
        return axios.post(openIdConnectTokenUrl, OpenIdUrlHelpers.buildFormUrlEncoded(body), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    };
    OpenIdConnectRepository.prototype.getTokensFromServer = function (authCode) {
        var redirectUrl = OpenIdUrlHelpers.buildInternalRedirectUrl(this.configuration.InternalRedirectUrl, false);
        var serverTokenUrl = this.configuration.serverBaseUrl + "/" + this.configuration.serverTokenEndpoint;
        var body = {
            authCode: authCode,
            realm: this.configuration.baseUrl,
            clientId: this.configuration.clientId,
            redirectUri: redirectUrl
        };
        return axios.post(serverTokenUrl, body);
    };
    OpenIdConnectRepository.prototype.refreshTokens = function (refreshToken) {
        if (this.configuration.serverBaseUrl) {
            return this.refreshTokensFromServer(refreshToken);
        }
        else {
            return this.refreshTokensFromProvider(refreshToken);
        }
    };
    OpenIdConnectRepository.prototype.refreshTokensFromProvider = function (refreshToken) {
        var openIdConnectTokenUrl = this.configuration.baseUrl + "/" + this.configuration.tokenEndpoint;
        var body = {
            grant_type: 'refresh_token',
            client_id: this.configuration.clientId,
            refresh_token: refreshToken
        };
        return axios.post(openIdConnectTokenUrl, OpenIdUrlHelpers.buildFormUrlEncoded(body), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    };
    OpenIdConnectRepository.prototype.refreshTokensFromServer = function (refreshToken) {
        var serverRefreshUrl = this.configuration.serverBaseUrl + "/" + this.configuration.serverRefreshEndpoint;
        var body = {
            realm: this.configuration.baseUrl,
            clientId: this.configuration.clientId,
            refreshToken: refreshToken
        };
        return axios.post(serverRefreshUrl, body);
    };
    return OpenIdConnectRepository;
}());

console.log('LOG TESTING TO DEBUG THE REFRESH CALL');
var OpenIdConnectModule = /** @class */ (function (_super) {
    __extends(OpenIdConnectModule, _super);
    function OpenIdConnectModule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // Data
        _this.accessToken = TokenStorageHelpers.getSessionAccessToken();
        _this.refreshToken = TokenStorageHelpers.getSessionRefreshToken();
        _this.configuration = {
            baseUrl: '',
            tokenEndpoint: '',
            authEndpoint: '',
            logoutEndpoint: '',
            clientId: '',
            authorizedRedirectRoute: '',
            InternalRedirectUrl: 'openid/redirect'
        };
        _this.repository = new OpenIdConnectRepository(_this.configuration);
        return _this;
    }
    // Mutations
    OpenIdConnectModule.prototype.clearTokens = function () {
        this.accessToken = '';
        this.refreshToken = '';
        TokenStorageHelpers.clearSessionTokens();
    };
    OpenIdConnectModule.prototype.setTokens = function (tokens) {
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken;
        TokenStorageHelpers.setSessionTokens(tokens);
    };
    OpenIdConnectModule.prototype.loadSessionTokens = function (tokens) {
        this.accessToken = TokenStorageHelpers.getSessionAccessToken();
        this.refreshToken = TokenStorageHelpers.getSessionRefreshToken();
    };
    OpenIdConnectModule.prototype.initializeConfig = function (configuration) {
        console.log('LOG TESTING TO DEBUG THE REFRESH CALL');
        console.log('initializeConfig');
        // Make sure that if serverBaseUrl is defined, we also have it's related endpoints
        if (configuration.serverBaseUrl) {
            if (!configuration.serverTokenEndpoint || !configuration.serverRefreshEndpoint) {
                throw new Error('Configuration contains a serverBaseUrl but not all of the required server endpoints');
            }
        }
        this.configuration = configuration;
        this.repository = new OpenIdConnectRepository(configuration);
    };
    OpenIdConnectModule.prototype.setRefreshTokenPromise = function (promise) {
        this.refreshTokenPromise = promise;
    };
    // Actions
    OpenIdConnectModule.prototype.login = function (finalRedirectRoute) {
        console.log('login');
        // First check if there are still tokens in sessionStorage
        this.context.commit('loadSessionTokens');
        if (this.accessToken) {
            return true;
        }
        console.log(this.configuration.InternalRedirectUrl);
        var redirectUrl = OpenIdUrlHelpers.buildInternalRedirectUrl(this.configuration.InternalRedirectUrl);
        // Build openIdConnect url
        var baseOpenIdConnectUrl = this.configuration.baseUrl + "/" + this.configuration.authEndpoint;
        var openIdParameters = {
            scope: this.configuration.scope ? this.configuration.scope : 'openid',
            client_id: this.configuration.clientId,
            response_type: 'code',
            redirect_uri: redirectUrl
        };
        var openIdConnectUrl = baseOpenIdConnectUrl + '?' + OpenIdUrlHelpers.buildOpenIdParameterString(openIdParameters);
        // Save final redirect route in session storage so it can be used at the end of the openid flow
        if (finalRedirectRoute) {
            RedirectRouteStorageHelpers.setRedirectRoute(finalRedirectRoute);
        }
        window.location.href = openIdConnectUrl;
    };
    OpenIdConnectModule.prototype.fetchTokens = function (authCode) {
        var _this = this;
        console.log('fetchtokens');
        return this.repository.getTokens(authCode).then(function (result) {
            var tokens = {
                accessToken: result.data['access_token'],
                refreshToken: result.data['refresh_token']
            };
            _this.context.commit('setTokens', tokens);
            var redirectRoute = _this.configuration.authorizedRedirectRoute;
            // Overwrite redirect route if available in session storage
            var storedRedirectRoute = RedirectRouteStorageHelpers.getRedirectRoute();
            if (storedRedirectRoute) {
                redirectRoute = storedRedirectRoute;
            }
            return redirectRoute;
        });
    };
    OpenIdConnectModule.prototype.refreshTokens = function () {
        var _this = this;
        // Make sure refreshTokens isn't executed multiple times
        console.log('refreshTokens');
        if (!this.refreshTokenPromise) {
            var promise = this.repository.refreshTokens(this.refreshToken);
            this.context.commit('setRefreshTokenPromise', promise);
            return promise.then(function (result) {
                _this.context.commit('setRefreshTokenPromise', null);
                var tokens = {
                    accessToken: result.data['access_token'],
                    refreshToken: result.data['refresh_token']
                };
                _this.context.commit('setTokens', tokens);
                return tokens;
            }, function (error) {
                _this.context.commit('setRefreshTokenPromise', null);
                _this.context.commit('clearTokens');
                _this.context.dispatch('login');
            });
        }
        return this.refreshTokenPromise;
    };
    OpenIdConnectModule.prototype.logout = function () {
        console.log('logout');
        // Overwrite unauthorized redirect route if given
        var redirectRoute = 'openid/logout';
        if (this.configuration.unauthorizedRedirectRoute) {
            redirectRoute = this.configuration.unauthorizedRedirectRoute;
        }
        var redirectUrl = OpenIdUrlHelpers.buildInternalRedirectUrl(redirectRoute);
        // Build openIdConnect url
        var baseOpenIdConnectUrl = this.configuration.baseUrl + "/" + this.configuration.logoutEndpoint;
        var openIdParameters = {
            scope: this.configuration.scope ? this.configuration.scope : 'openid',
            client_id: this.configuration.clientId,
            redirect_uri: redirectUrl
        };
        this.context.commit('clearTokens');
        var openIdConnectUrl = baseOpenIdConnectUrl + '?' + OpenIdUrlHelpers.buildOpenIdParameterString(openIdParameters);
        window.location.href = openIdConnectUrl;
    };
    Object.defineProperty(OpenIdConnectModule.prototype, "isLoggedIn", {
        // Getters
        get: function () {
            return !!this.accessToken;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        Mutation
    ], OpenIdConnectModule.prototype, "clearTokens", null);
    __decorate([
        Mutation
    ], OpenIdConnectModule.prototype, "setTokens", null);
    __decorate([
        Mutation
    ], OpenIdConnectModule.prototype, "loadSessionTokens", null);
    __decorate([
        Mutation
    ], OpenIdConnectModule.prototype, "initializeConfig", null);
    __decorate([
        Mutation
    ], OpenIdConnectModule.prototype, "setRefreshTokenPromise", null);
    __decorate([
        Action({})
    ], OpenIdConnectModule.prototype, "login", null);
    __decorate([
        Action({})
    ], OpenIdConnectModule.prototype, "fetchTokens", null);
    __decorate([
        Action({})
    ], OpenIdConnectModule.prototype, "refreshTokens", null);
    __decorate([
        Action({})
    ], OpenIdConnectModule.prototype, "logout", null);
    OpenIdConnectModule = __decorate([
        Module({ namespaced: true, name: 'openid' })
    ], OpenIdConnectModule);
    return OpenIdConnectModule;
}(VuexModule));

var TokenRedirectPage = /** @class */ (function (_super) {
    __extends(TokenRedirectPage, _super);
    function TokenRedirectPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hasErrored = false;
        return _this;
    }
    TokenRedirectPage.prototype.mounted = function () {
        var _this = this;
        var accessCode = this.$route.query.code;
        this.$store.dispatch('openid/fetchTokens', accessCode).then(function (redirectPath) {
            _this.$router.push({ path: redirectPath });
        }, function (error) {
            _this.hasErrored = true;
        });
    };
    TokenRedirectPage = __decorate([
        Component
    ], TokenRedirectPage);
    return TokenRedirectPage;
}(Vue));

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__ = TokenRedirectPage;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _vm.hasErrored
    ? _c("div", [_vm._v("Something went wrong during openIdConnect login.")])
    : _vm._e()
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var TokenRedirectPage$1 = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

var UnauthorizedRedirectPage = /** @class */ (function (_super) {
    __extends(UnauthorizedRedirectPage, _super);
    function UnauthorizedRedirectPage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hasErrored = false;
        return _this;
    }
    UnauthorizedRedirectPage.prototype.mounted = function () {
        this.$store.dispatch('openid/login');
    };
    UnauthorizedRedirectPage = __decorate([
        Component
    ], UnauthorizedRedirectPage);
    return UnauthorizedRedirectPage;
}(Vue));

/* script */
const __vue_script__$1 = UnauthorizedRedirectPage;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _vm.hasErrored
    ? _c("div", [_vm._v("Something went wrong during openIdConnect redirect.")])
    : _vm._e()
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var UnauthorizedRedirectPage$1 = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

var openIdConnectRoutes = [
    {
        path: '/openid/redirect',
        name: 'openIdConnectTokenRedirect',
        component: TokenRedirectPage$1
    },
    {
        path: '/openid/logout',
        name: 'openIdConnectUnauthorizedRedirect',
        component: UnauthorizedRedirectPage$1
    }
];

var OpenIdConnectInterceptors = /** @class */ (function () {
    function OpenIdConnectInterceptors() {
    }
    OpenIdConnectInterceptors.buildRequestTokenInterceptorCallback = function (store) {
        console.log('buildRequestTokenInterceptorCallback');
        return function (config) {
            config.headers.common['Authorization'] = "Bearer " + store.state.openid.accessToken;
            return config;
        };
    };
    OpenIdConnectInterceptors.buildResponseErrorInterceptorCallback = function (errorVm, store, retryAxiosInstance) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log('LOG 1: ', errorVm);
                console.log('LOG 1.1 (Error Message): ', errorVm.response, errorVm.message);
                console.log('LOG 1.2: ', errorVm.response.status);
                // Only intercept 401 unauthorized calls
                if (errorVm.response && errorVm.response.status && errorVm.response.status === 401) {
                    console.log('LOG 2: ', errorVm);
                    try {
                        console.log('LOG 3: ', errorVm);
                        // Refresh tokens and retry call
                        return [2 /*return*/, store.dispatch('openid/refreshTokens').then(function (newTokens) {
                                console.log('LOG 4: ', errorVm);
                                errorVm.response.config.headers.Authorization = "Bearer " + newTokens.accessToken;
                                // Use custom retryAxiosInstance if given
                                if (retryAxiosInstance) {
                                    console.log('LOG 5: ', retryAxiosInstance);
                                    return new Promise(function (resolve, reject) {
                                        retryAxiosInstance.request(errorVm.response.config).then(function (response) {
                                            resolve(response);
                                        }).catch(function (error) {
                                            reject(error);
                                        });
                                    });
                                }
                                else {
                                    console.log('LOG 6:');
                                    return new Promise(function (resolve, reject) {
                                        axios.request(errorVm.response.config).then(function (response) {
                                            console.log('LOG 7: ', response);
                                            resolve(response);
                                        }).catch(function (error) {
                                            console.log('LOG 8: ', error);
                                            reject(error);
                                        });
                                    });
                                }
                            })];
                    }
                    catch (e) {
                        console.log('LOG 9: ', e);
                        throw errorVm;
                    }
                }
                throw errorVm;
            });
        });
    };
    return OpenIdConnectInterceptors;
}());

function OpenIdConnectPlugin(Vue, options) {
    if (!options.store)
        throw new Error('Inuits-vuejs-oidc needs a store');
    if (!options.router)
        throw new Error('Inuits-vuejs-oidc needs a router');
    if (!options.configuration)
        throw new Error('Inuits-vuejs-oidc needs configuration');
    var oidModule = getModule(OpenIdConnectModule, options.store);
    options.store.registerModule('openid', OpenIdConnectModule);
    options.store.commit('openid/initializeConfig', options.configuration);
    options.router.addRoutes(openIdConnectRoutes);
    // Add some auth guards to routes with specific meta tags
    options.router.beforeEach(function (to, from, next) {
        if (to.matched.some(function (record) { return record.meta.requiresOpenIdAuth; })) {
            if (!options.store.getters['openid/isLoggedIn']) {
                if (options.configuration.unauthorizedRedirectRoute) {
                    next({
                        path: '/login',
                        query: { redirect: to.fullPath }
                    });
                }
                else {
                    options.store.dispatch('openid/login', to.fullPath);
                    next();
                }
            }
            else {
                next();
            }
        }
        else {
            next();
        }
    });
}

export { OpenIdConnectInterceptors, OpenIdConnectPlugin };
