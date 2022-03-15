import axios from 'axios';
import { defineComponent, ref, openBlock, createElementBlock, createCommentVNode } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

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
    OpenIdUrlHelpers.buildOpenIdParameterString = function (parameters, encodeRedirectUrl) {
        var parameterArray = [];
        for (var _i = 0, _a = Object.entries(parameters); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], param = _b[1];
            if (param) {
                parameterArray.push(key + '=' + param);
            }
        }
        var openIdParameterString = '?' + parameterArray.join('&');
        if (encodeRedirectUrl) {
            openIdParameterString = encodeURIComponent(openIdParameterString);
        }
        return openIdParameterString;
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
    OpenIdUrlHelpers.buildAuthEnpointWithReturnUrlEncoded = function (authEnpoint, encodeRedirectUrl) {
        var authEnpointWithReturnUrlEncoded = authEnpoint;
        if (encodeRedirectUrl) {
            var returnUrl = authEnpoint.split('ReturnUrl=');
            authEnpointWithReturnUrlEncoded = returnUrl[0] + 'ReturnUrl=' + encodeURIComponent(returnUrl[1]);
        }
        return authEnpointWithReturnUrlEncoded;
    };
    return OpenIdUrlHelpers;
}());

var OpenIdConnectRepository = /** @class */ (function () {
    function OpenIdConnectRepository(configuration) {
        this.configuration = configuration;
    }
    OpenIdConnectRepository.prototype.getTokens = function (authCode) {
        if (this.configuration.serverBaseUrl) {
            return this.getTokensFromServer(authCode);
        }
        else {
            return this.getTokensFromProvider(authCode);
        }
    };
    OpenIdConnectRepository.prototype.getTokensFromProvider = function (authCode) {
        var redirectUrl = OpenIdUrlHelpers.buildInternalRedirectUrl('openid/redirect');
        var openIdConnectTokenUrl = "".concat(this.configuration.baseUrl, "/").concat(this.configuration.tokenEndpoint);
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
        var serverTokenUrl = "".concat(this.configuration.serverBaseUrl, "/").concat(this.configuration.serverTokenEndpoint);
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
        var openIdConnectTokenUrl = "".concat(this.configuration.baseUrl, "/").concat(this.configuration.tokenEndpoint);
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
        var serverRefreshUrl = "".concat(this.configuration.serverBaseUrl, "/").concat(this.configuration.serverRefreshEndpoint);
        var body = {
            realm: this.configuration.baseUrl,
            clientId: this.configuration.clientId,
            refreshToken: refreshToken
        };
        return axios.post(serverRefreshUrl, body);
    };
    return OpenIdConnectRepository;
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

var configuration = {
    baseUrl: '',
    tokenEndpoint: '',
    authEndpoint: '',
    logoutEndpoint: '',
    clientId: '',
    authorizedRedirectRoute: '',
    InternalRedirectUrl: 'openid/redirect',
    encodeRedirectUrl: false
};
var Tokens;
(function (Tokens) {
    Tokens["AccessToken"] = "access_token";
    Tokens["RefreshToken"] = "refresh_token";
})(Tokens || (Tokens = {}));
var OpenIdConnectModule = {
    state: function () { return ({
        openid: {
            accessToken: TokenStorageHelpers.getSessionAccessToken(),
            refreshToken: TokenStorageHelpers.getSessionRefreshToken(),
            configuration: configuration,
            refreshTokenPromise: false,
            repository: new OpenIdConnectRepository(configuration)
        }
    }); },
    mutations: {
        CLEAR_TOKENS: function (state) {
            state.openid.accessToken = '';
            state.openid.refreshToken = '';
            TokenStorageHelpers.clearSessionTokens();
        },
        SET_TOKENS: function (state, tokens) {
            state.openid.accessToken = tokens.accessToken;
            state.openid.refreshToken = tokens.refreshToken;
            TokenStorageHelpers.setSessionTokens(tokens);
        },
        LOAD_SESSION_TOKENS: function (state) {
            state.openid.accessToken = TokenStorageHelpers.getSessionAccessToken();
            state.openid.refreshToken = TokenStorageHelpers.getSessionRefreshToken();
        },
        INITIALIZE_CONFIG: function (state, configuration) {
            // Make sure that if serverBaseUrl is defined, we also have it's related endpoints
            if (configuration.serverBaseUrl) {
                if (!configuration.serverTokenEndpoint ||
                    !configuration.serverRefreshEndpoint) {
                    throw new Error('Configuration contains a serverBaseUrl but not all of the required server endpoints');
                }
            }
            if (!configuration.InternalRedirectUrl) {
                configuration.InternalRedirectUrl = 'openid/redirect';
            }
            state.openid.configuration = configuration;
            state.openid.repository = new OpenIdConnectRepository(configuration);
        },
        SET_REFRESH_TOKEN_PROMISE: function (state, promise) {
            state.openid.refreshTokenPromise = promise;
        }
    },
    actions: {
        clearTokens: function (_a, data) {
            var commit = _a.commit;
            commit('CLEAR_TOKENS', data);
        },
        setTokens: function (_a, data) {
            var commit = _a.commit;
            console.log('SETTING TOKENS!!!');
            commit('SET_TOKENS', data);
        },
        loadSessionTokens: function (_a, data) {
            var commit = _a.commit;
            commit('LOAD_SESSION_TOKENS', data);
        },
        initializeConfig: function (_a, data) {
            var commit = _a.commit;
            commit('INITIALIZE_CONFIG', data);
        },
        setRefreshTokenPromise: function (_a, data) {
            var commit = _a.commit;
            commit('SET_REFRESH_TOKEN_PROMISE', data);
        },
        login: function (_a, finalRedirectRoute) {
            var commit = _a.commit, state = _a.state;
            // First check if there are still tokens in sessionStorage
            commit('LOAD_SESSION_TOKENS');
            if (state.openid.accessToken) {
                return true;
            }
            var redirectUrl = OpenIdUrlHelpers.buildInternalRedirectUrl(state.openid.configuration.InternalRedirectUrl, !state.openid.configuration.encodeRedirectUrl);
            // Build openIdConnect url
            var authEndpoint = OpenIdUrlHelpers.buildAuthEnpointWithReturnUrlEncoded(state.openid.configuration.authEndpoint, state.openid.configuration.encodeRedirectUrl);
            var baseOpenIdConnectUrl = "".concat(state.openid.configuration.baseUrl, "/").concat(authEndpoint);
            var openIdParameters = {
                scope: state.openid.configuration.scope
                    ? state.openid.configuration.scope
                    : 'openid',
                client_id: state.openid.configuration.clientId,
                response_type: 'code',
                redirect_uri: redirectUrl
            };
            var openIdConnectUrl = baseOpenIdConnectUrl +
                OpenIdUrlHelpers.buildOpenIdParameterString(openIdParameters, state.openid.configuration.encodeRedirectUrl);
            // Save final redirect route in session storage so it can be used at the end of the openid flow
            if (finalRedirectRoute) {
                RedirectRouteStorageHelpers.setRedirectRoute(finalRedirectRoute);
            }
            window.location.href = openIdConnectUrl;
        },
        fetchTokens: function (_a, authCode) {
            var dispatch = _a.dispatch, state = _a.state;
            return state.openid.repository.getTokens(authCode).then(function (result) {
                var tokens = {
                    accessToken: result.data[Tokens.AccessToken],
                    refreshToken: result.data[Tokens.RefreshToken]
                };
                dispatch('setTokens', tokens);
                var redirectRoute = state.openid.configuration.authorizedRedirectRoute;
                // Overwrite redirect route if available in session storage
                var storedRedirectRoute = RedirectRouteStorageHelpers.getRedirectRoute();
                if (storedRedirectRoute) {
                    redirectRoute = storedRedirectRoute;
                }
                return redirectRoute;
            });
        },
        refreshTokens: function (_a) {
            var dispatch = _a.dispatch, state = _a.state;
            if (!state.openid.refreshTokenPromise) {
                console.log('Refreshing tokens');
                var promise = state.openid.repository.refreshTokens(state.openid.refreshToken);
                dispatch('setRefreshTokenPromise', promise);
                return promise.then(function (result) {
                    console.log('AWAIT IMPLEMENTED 8', result);
                    dispatch('setRefreshTokenPromise', null);
                    var tokens = {
                        accessToken: result.data[Tokens.AccessToken],
                        refreshToken: result.data[Tokens.RefreshToken]
                    };
                    dispatch('setTokens', tokens);
                    return tokens;
                }, function (error) {
                    dispatch('setRefreshTokenPromise', null);
                    dispatch('clearTokens');
                    dispatch('login');
                });
            }
            console.log('AWAIT IMPLEMENTED 6');
            console.log('Using existing refresh token promise');
            return state.openid.refreshTokenPromise;
        },
        logout: function (_a, data) {
            var commit = _a.commit, state = _a.state;
            // Overwrite unauthorized redirect route if given
            var redirectRoute = 'openid/logout';
            if (state.openid.configuration.unauthorizedRedirectRoute) {
                redirectRoute = state.openid.configuration.unauthorizedRedirectRoute;
            }
            var redirectUrl = OpenIdUrlHelpers.buildInternalRedirectUrl(redirectRoute);
            // Build openIdConnect url
            var baseOpenIdConnectUrl = "".concat(state.openid.configuration.baseUrl, "/").concat(state.openid.configuration.logoutEndpoint);
            var openIdParameters = {
                scope: state.openid.configuration.scope
                    ? state.openid.configuration.scope
                    : 'openid',
                client_id: state.openid.configuration.clientId,
                redirect_uri: redirectUrl
            };
            commit('clearTokens');
            var openIdConnectUrl = baseOpenIdConnectUrl +
                '?' +
                OpenIdUrlHelpers.buildOpenIdParameterString(openIdParameters, state.openid.configuration.encodeRedirectUrl);
            window.location.href = openIdConnectUrl;
        }
    },
    getters: {
        isLoggedIn: function (state) {
            return !!state.openid.accessToken;
        },
        accessToken: function (state) {
            return state.openid.accessToken;
        }
    }
};

var script$1 = defineComponent({
    name: 'UnauthorizedRedirectPage',
    props: {
        hasErrored: {
            type: Boolean,
            default: false
        }
    },
    setup: function () {
        var store = useStore();
        var route = useRoute();
        var router = useRouter();
        var hasError = ref(false);
        var accessCode = route.query.code;
        store.dispatch('fetchTokens', accessCode).then(function (redirectPath) {
            router.push({ path: redirectPath });
        }, function (error) {
            hasError.value = true;
        });
        return {
            hasError: hasError
        };
    }
});

const _hoisted_1$1 = { key: 0 };

function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return (_ctx.hasError)
    ? (openBlock(), createElementBlock("div", _hoisted_1$1, " Something went wrong during openIdConnect login. "))
    : createCommentVNode("v-if", true)
}

script$1.render = render$1;
script$1.__file = "src/views/TokenRedirectPage.vue";

var script = defineComponent({
    name: 'UnauthorizedRedirectPage',
    props: {
        hasErrored: {
            type: Boolean,
            default: false
        }
    },
    setup: function (props, context) {
        var store = useStore();
        store.dispatch('openid/login');
    }
});

const _hoisted_1 = { key: 0 };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_ctx.hasErrored)
    ? (openBlock(), createElementBlock("div", _hoisted_1, "Something went wrong during openIdConnect redirect."))
    : createCommentVNode("v-if", true)
}

script.render = render;
script.__file = "src/views/UnauthorizedRedirectPage.vue";

// import { RouteConfig } from 'vue-router'
var openIdConnectRoutes = [
    {
        path: '/openid/redirect',
        name: 'openIdConnectTokenRedirect',
        component: script$1
    },
    {
        path: '/openid/logout',
        name: 'openIdConnectUnauthorizedRedirect',
        component: script
    }
];

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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

var OpenIdConnectInterceptors = /** @class */ (function () {
    function OpenIdConnectInterceptors() {
    }
    OpenIdConnectInterceptors.buildRequestTokenInterceptorCallback = function (store) {
        return function (config) {
            var authorization = 'Authorization';
            config.headers.common[authorization] = "Bearer ".concat(store.getters.accessToken);
            return config;
        };
    };
    OpenIdConnectInterceptors.buildResponseErrorInterceptorCallback = function (errorVm, store, retryAxiosInstance) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('AWAIT IMPLEMENTED 1');
                        if (!(errorVm.response && errorVm.response.status && errorVm.response.status === 401)) return [3 /*break*/, 4];
                        console.log('AWAIT IMPLEMENTED 2');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        // Refresh tokens and retry call
                        console.log('AWAIT IMPLEMENTED 3');
                        return [4 /*yield*/, store.dispatch('refreshTokens').then(function (newTokens) {
                                console.log('AWAIT IMPLEMENTED 7', newTokens);
                                errorVm.response.config.headers.Authorization = "Bearer ".concat(newTokens.accessToken);
                                // Use custom retryAxiosInstance if given
                                if (retryAxiosInstance) {
                                    console.log('[IF] RETRY AXIOS INSTANCE');
                                    return new Promise(function (resolve, reject) {
                                        retryAxiosInstance.request(errorVm.response.config).then(function (response) {
                                            resolve(response);
                                        }).catch(function (error) {
                                            reject(error);
                                        });
                                    });
                                }
                                else {
                                    console.log('[ELSE] RETRY AXIOS INSTANCE');
                                    return new Promise(function (resolve, reject) {
                                        axios.request(errorVm.response.config).then(function (response) {
                                            resolve(response);
                                        }).catch(function (error) {
                                            reject(error);
                                        });
                                    });
                                }
                            })];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        _a.sent();
                        throw errorVm;
                    case 4: throw errorVm;
                }
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
    options.store.registerModule('openid', OpenIdConnectModule);
    options.store.dispatch('initializeConfig', options.configuration);
    openIdConnectRoutes.forEach(function (route) {
        options.router.addRoute(route);
    });
    // Add some auth guards to routes with specific meta tags
    options.router.beforeEach(function (to, from, next) {
        if (to.matched.some(function (record) { return record.meta.requiresOpenIdAuth; })) {
            if (!options.store.getters.isLoggedIn) {
                if (options.configuration.unauthorizedRedirectRoute) {
                    next({
                        path: '/login',
                        query: { redirect: to.fullPath }
                    });
                }
                else {
                    options.store.dispatch('login', to.fullPath);
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
