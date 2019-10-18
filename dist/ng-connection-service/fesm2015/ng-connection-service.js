import { HttpClient, HttpClientModule } from '@angular/common/http';
import { InjectionToken, EventEmitter, Injectable, Inject, Optional, ɵɵdefineInjectable, ɵɵinject, NgModule } from '@angular/core';
import { timer, fromEvent } from 'rxjs';
import { switchMap, retryWhen, tap, delay, debounceTime, startWith } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * InjectionToken for specifing ConnectionService options.
 * @type {?}
 */
const ConnectionServiceOptionsToken = new InjectionToken('ConnectionServiceOptionsToken');
class ConnectionService {
    /**
     * @param {?} http
     * @param {?} options
     */
    constructor(http, options) {
        this.http = http;
        this.stateChangeEventEmitter = new EventEmitter();
        this.currentState = {
            hasInternetAccess: false,
            hasNetworkConnection: window.navigator.onLine
        };
        this.serviceOptions = Object.assign({}, ConnectionService.DEFAULT_OPTIONS, options);
        this.checkNetworkState();
        this.checkInternetState();
    }
    /**
     * Current ConnectionService options. Notice that changing values of the returned object has not effect on service execution.
     * You should use "updateOptions" function.
     * @return {?}
     */
    get options() {
        return Object.assign({}, this.serviceOptions);
    }
    /**
     * @private
     * @return {?}
     */
    checkInternetState() {
        if (this.httpSubscription !== undefined) {
            this.httpSubscription.unsubscribe();
        }
        if (this.serviceOptions.enableHeartbeat) {
            this.httpSubscription = timer(0, this.serviceOptions.heartbeatInterval)
                .pipe(switchMap((/**
             * @return {?}
             */
            () => this.http[this.serviceOptions.requestMethod](this.serviceOptions.heartbeatUrl, {
                responseType: 'text'
            }))), retryWhen((/**
             * @param {?} errors
             * @return {?}
             */
            errors => errors.pipe(
            // log error message
            tap((/**
             * @param {?} val
             * @return {?}
             */
            val => {
                console.error('Http error:', val);
                this.currentState.hasInternetAccess = false;
                this.emitEvent();
            })), 
            // restart after 5 seconds
            delay(this.serviceOptions.heartbeatRetryInterval)))))
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
        this.onlineSubscription = fromEvent(window, 'online').subscribe((/**
         * @return {?}
         */
        () => {
            this.currentState.hasNetworkConnection = true;
            this.checkInternetState();
            this.emitEvent();
        }));
        this.offlineSubscription = fromEvent(window, 'offline').subscribe((/**
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
        catch (e) { }
    }
    /**
     * Monitor Network & Internet connection status by subscribing to this observer. If you set "reportCurrentState" to "false" then
     * function will not report current status of the connections when initially subscribed.
     * @param {?=} reportCurrentState Report current state when initial subscription. Default is "true"
     * @return {?}
     */
    monitor(reportCurrentState = true) {
        return reportCurrentState
            ? this.stateChangeEventEmitter.pipe(debounceTime(300), startWith(this.currentState))
            : this.stateChangeEventEmitter.pipe(debounceTime(300));
    }
    /**
     * Update options of the service. You could specify partial options object. Values that are not specified will use default / previous
     * option values.
     * @param {?} options Partial option values.
     * @return {?}
     */
    updateOptions(options) {
        this.serviceOptions = Object.assign({}, this.serviceOptions, options);
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
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
ConnectionService.ctorParameters = () => [
    { type: HttpClient },
    { type: undefined, decorators: [{ type: Inject, args: [ConnectionServiceOptionsToken,] }, { type: Optional }] }
];
/** @nocollapse */ ConnectionService.ngInjectableDef = ɵɵdefineInjectable({ factory: function ConnectionService_Factory() { return new ConnectionService(ɵɵinject(HttpClient), ɵɵinject(ConnectionServiceOptionsToken, 8)); }, token: ConnectionService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ConnectionServiceModule {
}
ConnectionServiceModule.decorators = [
    { type: NgModule, args: [{
                imports: [HttpClientModule],
                providers: [ConnectionService]
            },] }
];

export { ConnectionService, ConnectionServiceModule, ConnectionServiceOptionsToken };
//# sourceMappingURL=ng-connection-service.js.map
