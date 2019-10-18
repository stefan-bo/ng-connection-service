(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./dist/ng-connection-service/fesm2015/ng-connection-service.js":
/*!**********************************************************************!*\
  !*** ./dist/ng-connection-service/fesm2015/ng-connection-service.js ***!
  \**********************************************************************/
/*! exports provided: ConnectionService, ConnectionServiceModule, ConnectionServiceOptionsToken */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectionService", function() { return ConnectionService; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectionServiceModule", function() { return ConnectionServiceModule; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectionServiceOptionsToken", function() { return ConnectionServiceOptionsToken; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lodash */ "./node_modules/lodash/lodash.js");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_4__);






/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * InjectionToken for specifing ConnectionService options.
 * @type {?}
 */
const ConnectionServiceOptionsToken = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["InjectionToken"]('ConnectionServiceOptionsToken');
class ConnectionService {
    /**
     * @param {?} http
     * @param {?} options
     */
    constructor(http, options) {
        this.http = http;
        this.stateChangeEventEmitter = new _angular_core__WEBPACK_IMPORTED_MODULE_0__["EventEmitter"]();
        this.currentState = {
            hasInternetAccess: false,
            hasNetworkConnection: window.navigator.onLine
        };
        this.serviceOptions = Object(lodash__WEBPACK_IMPORTED_MODULE_4__["defaults"])({}, options, ConnectionService.DEFAULT_OPTIONS);
        this.checkNetworkState();
        this.checkInternetState();
    }
    /**
     * Current ConnectionService options. Notice that changing values of the returned object has not effect on service execution.
     * You should use "updateOptions" function.
     * @return {?}
     */
    get options() {
        return Object(lodash__WEBPACK_IMPORTED_MODULE_4__["clone"])(this.serviceOptions);
    }
    /**
     * @private
     * @return {?}
     */
    checkInternetState() {
        if (!Object(lodash__WEBPACK_IMPORTED_MODULE_4__["isNil"])(this.httpSubscription)) {
            this.httpSubscription.unsubscribe();
        }
        if (this.serviceOptions.enableHeartbeat) {
            this.httpSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["timer"])(0, this.serviceOptions.heartbeatInterval)
                .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["switchMap"])((/**
             * @return {?}
             */
            () => this.http[this.serviceOptions.requestMethod](this.serviceOptions.heartbeatUrl, { responseType: 'text' }))), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["retryWhen"])((/**
             * @param {?} errors
             * @return {?}
             */
            errors => errors.pipe(
            // log error message
            Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["tap"])((/**
             * @param {?} val
             * @return {?}
             */
            val => {
                console.error('Http error:', val);
                this.currentState.hasInternetAccess = false;
                this.emitEvent();
            })), 
            // restart after 5 seconds
            Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["delay"])(this.serviceOptions.heartbeatRetryInterval)))))
                .subscribe((/**
             * @param {?} result
             * @return {?}
             */
            result => {
                this.currentState.hasInternetAccess = true;
                this.emitEvent();
            }));
        }
        else {
            this.currentState.hasInternetAccess = false;
            this.emitEvent();
        }
    }
    /**
     * @private
     * @return {?}
     */
    checkNetworkState() {
        this.onlineSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])(window, 'online').subscribe((/**
         * @return {?}
         */
        () => {
            this.currentState.hasNetworkConnection = true;
            this.checkInternetState();
            this.emitEvent();
        }));
        this.offlineSubscription = Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["fromEvent"])(window, 'offline').subscribe((/**
         * @return {?}
         */
        () => {
            this.currentState.hasNetworkConnection = false;
            this.checkInternetState();
            this.emitEvent();
        }));
    }
    /**
     * @private
     * @return {?}
     */
    emitEvent() {
        this.stateChangeEventEmitter.emit(this.currentState);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        try {
            this.offlineSubscription.unsubscribe();
            this.onlineSubscription.unsubscribe();
            this.httpSubscription.unsubscribe();
        }
        catch (e) {
        }
    }
    /**
     * Monitor Network & Internet connection status by subscribing to this observer. If you set "reportCurrentState" to "false" then
     * function will not report current status of the connections when initially subscribed.
     * @param {?=} reportCurrentState Report current state when initial subscription. Default is "true"
     * @return {?}
     */
    monitor(reportCurrentState = true) {
        return reportCurrentState ?
            this.stateChangeEventEmitter.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["debounceTime"])(300), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["startWith"])(this.currentState))
            :
                this.stateChangeEventEmitter.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_2__["debounceTime"])(300));
    }
    /**
     * Update options of the service. You could specify partial options object. Values that are not specified will use default / previous
     * option values.
     * @param {?} options Partial option values.
     * @return {?}
     */
    updateOptions(options) {
        this.serviceOptions = Object(lodash__WEBPACK_IMPORTED_MODULE_4__["defaults"])({}, options, this.serviceOptions);
        this.checkInternetState();
    }
}
ConnectionService.DEFAULT_OPTIONS = {
    enableHeartbeat: true,
    heartbeatUrl: '//internethealthtest.org',
    heartbeatInterval: 30000,
    heartbeatRetryInterval: 1000,
    requestMethod: 'head'
};
ConnectionService.decorators = [
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"], args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
ConnectionService.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"] },
    { type: undefined, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"], args: [ConnectionServiceOptionsToken,] }, { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Optional"] }] }
];
/** @nocollapse */ ConnectionService.ngInjectableDef = Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"])({ factory: function ConnectionService_Factory() { return new ConnectionService(Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"])(_angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClient"]), Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵinject"])(ConnectionServiceOptionsToken, 8)); }, token: ConnectionService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ConnectionServiceModule {
}
ConnectionServiceModule.decorators = [
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"], args: [{
                imports: [_angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"]],
                providers: [ConnectionService]
            },] }
];


//# sourceMappingURL=ng-connection-service.js.map


/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/app.component.html":
/*!**************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/app.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--The content below is only a placeholder and can be replaced.-->\r\n<div style=\"text-align:center\">\r\n  <h1>Internet connection status</h1>\r\n\r\n  <h3>Try to disconnect and reconnect your internet connection and observe the live status</h3>\r\n  <br>\r\n  <app-status-check></app-status-check>\r\n\r\n  <app-status-check></app-status-check>\r\n\r\n  <button *ngIf=\"!heartBeatState\" (click)=\"setHeartBeatState(true)\">Enable HeartBeat Check</button>\r\n  <button *ngIf=\"heartBeatState\" (click)=\"setHeartBeatState(false)\">Disable HeartBeat Check</button>\r\n\r\n</div>\r\n"

/***/ }),

/***/ "./node_modules/raw-loader/index.js!./src/app/components/status-check/status-check.component.html":
/*!***********************************************************************************************!*\
  !*** ./node_modules/raw-loader!./src/app/components/status-check/status-check.component.html ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1>\r\n  Network Status: <span [ngStyle]=\"{'color':currentState?.hasNetworkConnection?'green':'red'}\">\r\n      {{ currentState?.hasNetworkConnection ? 'ONLINE' : 'OFFLINE' }}!\r\n    </span><br>\r\n  Internet Status: <span [ngStyle]=\"{'color':currentState?.hasInternetAccess?'green':'red'}\">\r\n      {{ currentState?.hasInternetAccess ? 'ONLINE' : 'OFFLINE' }}!\r\n    </span>\r\n</h1>\r\n"

/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var ng_connection_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ng-connection-service */ "./dist/ng-connection-service/fesm2015/ng-connection-service.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let AppComponent = class AppComponent {
    constructor(connectionService) {
        this.connectionService = connectionService;
        this.heartBeatState = this.connectionService.options.enableHeartbeat;
    }
    setHeartBeatState(state) {
        this.heartBeatState = state;
        this.connectionService.updateOptions({ enableHeartbeat: state });
    }
};
AppComponent.ctorParameters = () => [
    { type: ng_connection_service__WEBPACK_IMPORTED_MODULE_1__["ConnectionService"] }
];
AppComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-root',
        template: __webpack_require__(/*! raw-loader!./app.component.html */ "./node_modules/raw-loader/index.js!./src/app/app.component.html"),
        styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
    }),
    __metadata("design:paramtypes", [ng_connection_service__WEBPACK_IMPORTED_MODULE_1__["ConnectionService"]])
], AppComponent);



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm2015/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var ng_connection_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ng-connection-service */ "./dist/ng-connection-service/fesm2015/ng-connection-service.js");
/* harmony import */ var _components_status_check_status_check_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/status-check/status-check.component */ "./src/app/components/status-check/status-check.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





let AppModule = class AppModule {
};
AppModule = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        declarations: [
            _app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"],
            _components_status_check_status_check_component__WEBPACK_IMPORTED_MODULE_4__["StatusCheckComponent"]
        ],
        imports: [
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            ng_connection_service__WEBPACK_IMPORTED_MODULE_3__["ConnectionServiceModule"]
        ],
        providers: [
            {
                provide: ng_connection_service__WEBPACK_IMPORTED_MODULE_3__["ConnectionServiceOptionsToken"],
                useValue: {
                // enableHeartbeat: false,
                // heartbeatUrl: '/assets/ping.json',
                // requestMethod: 'get',
                // heartbeatInterval: 3000
                }
            }
        ],
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]]
    })
], AppModule);



/***/ }),

/***/ "./src/app/components/status-check/status-check.component.css":
/*!********************************************************************!*\
  !*** ./src/app/components/status-check/status-check.component.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvc3RhdHVzLWNoZWNrL3N0YXR1cy1jaGVjay5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/components/status-check/status-check.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/components/status-check/status-check.component.ts ***!
  \*******************************************************************/
/*! exports provided: StatusCheckComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StatusCheckComponent", function() { return StatusCheckComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var ng_connection_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ng-connection-service */ "./dist/ng-connection-service/fesm2015/ng-connection-service.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let StatusCheckComponent = class StatusCheckComponent {
    constructor(connectionService) {
        this.connectionService = connectionService;
        this.connectionService.monitor().subscribe((currentState) => {
            console.log(currentState);
            this.currentState = currentState;
        });
    }
};
StatusCheckComponent.ctorParameters = () => [
    { type: ng_connection_service__WEBPACK_IMPORTED_MODULE_1__["ConnectionService"] }
];
StatusCheckComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-status-check',
        template: __webpack_require__(/*! raw-loader!./status-check.component.html */ "./node_modules/raw-loader/index.js!./src/app/components/status-check/status-check.component.html"),
        styles: [__webpack_require__(/*! ./status-check.component.css */ "./src/app/components/status-check/status-check.component.css")]
    }),
    __metadata("design:paramtypes", [ng_connection_service__WEBPACK_IMPORTED_MODULE_1__["ConnectionService"]])
], StatusCheckComponent);



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm2015/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.log(err));


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\repos\gits\ng-connection-service\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main-es2015.js.map