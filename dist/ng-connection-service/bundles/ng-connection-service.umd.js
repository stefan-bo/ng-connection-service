(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common/http'), require('@angular/core'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('ng-connection-service', ['exports', '@angular/common/http', '@angular/core', 'rxjs', 'rxjs/operators'], factory) :
    (global = global || self, factory(global['ng-connection-service'] = {}, global.ng.common.http, global.ng.core, global.rxjs, global.rxjs.operators));
}(this, function (exports, http, core, rxjs, operators) { 'use strict';

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

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * InjectionToken for specifing ConnectionService options.
     * @type {?}
     */
    var ConnectionServiceOptionsToken = new core.InjectionToken('ConnectionServiceOptionsToken');
    var ConnectionService = /** @class */ (function () {
        function ConnectionService(http, options) {
            this.http = http;
            this.stateChangeEventEmitter = new core.EventEmitter();
            this.currentState = {
                hasInternetAccess: false,
                hasNetworkConnection: window.navigator.onLine
            };
            this.serviceOptions = __assign({}, ConnectionService.DEFAULT_OPTIONS, options);
            this.checkNetworkState();
            this.checkInternetState();
        }
        Object.defineProperty(ConnectionService.prototype, "options", {
            /**
             * Current ConnectionService options. Notice that changing values of the returned object has not effect on service execution.
             * You should use "updateOptions" function.
             */
            get: /**
             * Current ConnectionService options. Notice that changing values of the returned object has not effect on service execution.
             * You should use "updateOptions" function.
             * @return {?}
             */
            function () {
                return __assign({}, this.serviceOptions);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         * @return {?}
         */
        ConnectionService.prototype.checkInternetState = /**
         * @private
         * @return {?}
         */
        function () {
            var _this = this;
            if (this.httpSubscription !== undefined) {
                this.httpSubscription.unsubscribe();
            }
            if (this.serviceOptions.enableHeartbeat) {
                this.httpSubscription = rxjs.timer(0, this.serviceOptions.heartbeatInterval)
                    .pipe(operators.switchMap((/**
                 * @return {?}
                 */
                function () {
                    return _this.http[_this.serviceOptions.requestMethod](_this.serviceOptions.heartbeatUrl, {
                        responseType: 'text'
                    });
                })), operators.retryWhen((/**
                 * @param {?} errors
                 * @return {?}
                 */
                function (errors) {
                    return errors.pipe(
                    // log error message
                    operators.tap((/**
                     * @param {?} val
                     * @return {?}
                     */
                    function (val) {
                        console.error('Http error:', val);
                        _this.currentState.hasInternetAccess = false;
                        _this.emitEvent();
                    })), 
                    // restart after 5 seconds
                    operators.delay(_this.serviceOptions.heartbeatRetryInterval));
                })))
                    .subscribe((/**
                 * @param {?} result
                 * @return {?}
                 */
                function (result) {
                    _this.currentState.hasInternetAccess = true;
                    _this.emitEvent();
                }));
            }
            else {
                this.currentState.hasInternetAccess = false;
                this.emitEvent();
            }
        };
        /**
         * @private
         * @return {?}
         */
        ConnectionService.prototype.checkNetworkState = /**
         * @private
         * @return {?}
         */
        function () {
            var _this = this;
            this.onlineSubscription = rxjs.fromEvent(window, 'online').subscribe((/**
             * @return {?}
             */
            function () {
                _this.currentState.hasNetworkConnection = true;
                _this.checkInternetState();
                _this.emitEvent();
            }));
            this.offlineSubscription = rxjs.fromEvent(window, 'offline').subscribe((/**
             * @return {?}
             */
            function () {
                _this.currentState.hasNetworkConnection = false;
                _this.checkInternetState();
                _this.emitEvent();
            }));
        };
        /**
         * @private
         * @return {?}
         */
        ConnectionService.prototype.emitEvent = /**
         * @private
         * @return {?}
         */
        function () {
            this.stateChangeEventEmitter.emit(this.currentState);
        };
        /**
         * @return {?}
         */
        ConnectionService.prototype.ngOnDestroy = /**
         * @return {?}
         */
        function () {
            try {
                this.offlineSubscription.unsubscribe();
                this.onlineSubscription.unsubscribe();
                this.httpSubscription.unsubscribe();
            }
            catch (e) { }
        };
        /**
         * Monitor Network & Internet connection status by subscribing to this observer. If you set "reportCurrentState" to "false" then
         * function will not report current status of the connections when initially subscribed.
         * @param reportCurrentState Report current state when initial subscription. Default is "true"
         */
        /**
         * Monitor Network & Internet connection status by subscribing to this observer. If you set "reportCurrentState" to "false" then
         * function will not report current status of the connections when initially subscribed.
         * @param {?=} reportCurrentState Report current state when initial subscription. Default is "true"
         * @return {?}
         */
        ConnectionService.prototype.monitor = /**
         * Monitor Network & Internet connection status by subscribing to this observer. If you set "reportCurrentState" to "false" then
         * function will not report current status of the connections when initially subscribed.
         * @param {?=} reportCurrentState Report current state when initial subscription. Default is "true"
         * @return {?}
         */
        function (reportCurrentState) {
            if (reportCurrentState === void 0) { reportCurrentState = true; }
            return reportCurrentState
                ? this.stateChangeEventEmitter.pipe(operators.debounceTime(300), operators.startWith(this.currentState))
                : this.stateChangeEventEmitter.pipe(operators.debounceTime(300));
        };
        /**
         * Update options of the service. You could specify partial options object. Values that are not specified will use default / previous
         * option values.
         * @param options Partial option values.
         */
        /**
         * Update options of the service. You could specify partial options object. Values that are not specified will use default / previous
         * option values.
         * @param {?} options Partial option values.
         * @return {?}
         */
        ConnectionService.prototype.updateOptions = /**
         * Update options of the service. You could specify partial options object. Values that are not specified will use default / previous
         * option values.
         * @param {?} options Partial option values.
         * @return {?}
         */
        function (options) {
            this.serviceOptions = __assign({}, this.serviceOptions, options);
            this.checkInternetState();
        };
        ConnectionService.DEFAULT_OPTIONS = {
            enableHeartbeat: true,
            heartbeatUrl: '//internethealthtest.org',
            heartbeatInterval: 30000,
            heartbeatRetryInterval: 1000,
            requestMethod: 'head'
        };
        ConnectionService.decorators = [
            { type: core.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        ConnectionService.ctorParameters = function () { return [
            { type: http.HttpClient },
            { type: undefined, decorators: [{ type: core.Inject, args: [ConnectionServiceOptionsToken,] }, { type: core.Optional }] }
        ]; };
        /** @nocollapse */ ConnectionService.ngInjectableDef = core.ɵɵdefineInjectable({ factory: function ConnectionService_Factory() { return new ConnectionService(core.ɵɵinject(http.HttpClient), core.ɵɵinject(ConnectionServiceOptionsToken, 8)); }, token: ConnectionService, providedIn: "root" });
        return ConnectionService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var ConnectionServiceModule = /** @class */ (function () {
        function ConnectionServiceModule() {
        }
        ConnectionServiceModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [http.HttpClientModule],
                        providers: [ConnectionService]
                    },] }
        ];
        return ConnectionServiceModule;
    }());

    exports.ConnectionService = ConnectionService;
    exports.ConnectionServiceModule = ConnectionServiceModule;
    exports.ConnectionServiceOptionsToken = ConnectionServiceOptionsToken;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ng-connection-service.umd.js.map
