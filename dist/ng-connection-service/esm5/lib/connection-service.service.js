/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { EventEmitter, Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { fromEvent, timer } from 'rxjs';
import { debounceTime, delay, retryWhen, startWith, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
/**
 * Instance of this interface is used to report current connection status.
 * @record
 */
export function ConnectionState() { }
if (false) {
    /**
     * "True" if browser has network connection. Determined by Window objects "online" / "offline" events.
     * @type {?}
     */
    ConnectionState.prototype.hasNetworkConnection;
    /**
     * "True" if browser has Internet access. Determined by heartbeat system which periodically makes request to heartbeat Url.
     * @type {?}
     */
    ConnectionState.prototype.hasInternetAccess;
}
/**
 * Instance of this interface could be used to configure "ConnectionService".
 * @record
 */
export function ConnectionServiceOptions() { }
if (false) {
    /**
     * Controls the Internet connectivity heartbeat system. Default value is 'true'.
     * @type {?|undefined}
     */
    ConnectionServiceOptions.prototype.enableHeartbeat;
    /**
     * Url used for checking Internet connectivity, heartbeat system periodically makes "HEAD" requests to this URL to determine Internet
     * connection status. Default value is "//internethealthtest.org".
     * @type {?|undefined}
     */
    ConnectionServiceOptions.prototype.heartbeatUrl;
    /**
     * Interval used to check Internet connectivity specified in milliseconds. Default value is "30000".
     * @type {?|undefined}
     */
    ConnectionServiceOptions.prototype.heartbeatInterval;
    /**
     * Interval used to retry Internet connectivity checks when an error is detected (when no Internet connection). Default value is "1000".
     * @type {?|undefined}
     */
    ConnectionServiceOptions.prototype.heartbeatRetryInterval;
    /**
     * HTTP method used for requesting heartbeat Url. Default is 'head'.
     * @type {?|undefined}
     */
    ConnectionServiceOptions.prototype.requestMethod;
}
/**
 * InjectionToken for specifing ConnectionService options.
 * @type {?}
 */
export var ConnectionServiceOptionsToken = new InjectionToken('ConnectionServiceOptionsToken');
var ConnectionService = /** @class */ (function () {
    function ConnectionService(http, options) {
        this.http = http;
        this.stateChangeEventEmitter = new EventEmitter();
        this.currentState = {
            hasInternetAccess: false,
            hasNetworkConnection: window.navigator.onLine
        };
        this.serviceOptions = _.defaults({}, options, ConnectionService.DEFAULT_OPTIONS);
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
            return _.clone(this.serviceOptions);
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
        if (!_.isNil(this.httpSubscription)) {
            this.httpSubscription.unsubscribe();
        }
        if (this.serviceOptions.enableHeartbeat) {
            this.httpSubscription = timer(0, this.serviceOptions.heartbeatInterval)
                .pipe(switchMap((/**
             * @return {?}
             */
            function () { return _this.http[_this.serviceOptions.requestMethod](_this.serviceOptions.heartbeatUrl, { responseType: 'text' }); })), retryWhen((/**
             * @param {?} errors
             * @return {?}
             */
            function (errors) {
                return errors.pipe(
                // log error message
                tap((/**
                 * @param {?} val
                 * @return {?}
                 */
                function (val) {
                    console.error('Http error:', val);
                    _this.currentState.hasInternetAccess = false;
                    _this.emitEvent();
                })), 
                // restart after 5 seconds
                delay(_this.serviceOptions.heartbeatRetryInterval));
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
        this.onlineSubscription = fromEvent(window, 'online').subscribe((/**
         * @return {?}
         */
        function () {
            _this.currentState.hasNetworkConnection = true;
            _this.checkInternetState();
            _this.emitEvent();
        }));
        this.offlineSubscription = fromEvent(window, 'offline').subscribe((/**
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
        catch (e) {
        }
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
        return reportCurrentState ?
            this.stateChangeEventEmitter.pipe(debounceTime(300), startWith(this.currentState))
            :
                this.stateChangeEventEmitter.pipe(debounceTime(300));
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
        this.serviceOptions = _.defaults({}, options, this.serviceOptions);
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
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    ConnectionService.ctorParameters = function () { return [
        { type: HttpClient },
        { type: undefined, decorators: [{ type: Inject, args: [ConnectionServiceOptionsToken,] }, { type: Optional }] }
    ]; };
    /** @nocollapse */ ConnectionService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function ConnectionService_Factory() { return new ConnectionService(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(ConnectionServiceOptionsToken, 8)); }, token: ConnectionService, providedIn: "root" });
    return ConnectionService;
}());
export { ConnectionService };
if (false) {
    /**
     * @type {?}
     * @private
     */
    ConnectionService.DEFAULT_OPTIONS;
    /**
     * @type {?}
     * @private
     */
    ConnectionService.prototype.stateChangeEventEmitter;
    /**
     * @type {?}
     * @private
     */
    ConnectionService.prototype.currentState;
    /**
     * @type {?}
     * @private
     */
    ConnectionService.prototype.offlineSubscription;
    /**
     * @type {?}
     * @private
     */
    ConnectionService.prototype.onlineSubscription;
    /**
     * @type {?}
     * @private
     */
    ConnectionService.prototype.httpSubscription;
    /**
     * @type {?}
     * @private
     */
    ConnectionService.prototype.serviceOptions;
    /**
     * @type {?}
     * @private
     */
    ConnectionService.prototype.http;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi1zZXJ2aWNlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1jb25uZWN0aW9uLXNlcnZpY2UvIiwic291cmNlcyI6WyJsaWIvY29ubmVjdGlvbi1zZXJ2aWNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQWEsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BHLE9BQU8sRUFBQyxTQUFTLEVBQTRCLEtBQUssRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNoRSxPQUFPLEVBQUMsWUFBWSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDaEQsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7Ozs7Ozs7QUFLNUIscUNBU0M7Ozs7OztJQUxDLCtDQUE4Qjs7Ozs7SUFJOUIsNENBQTJCOzs7Ozs7QUFNN0IsOENBdUJDOzs7Ozs7SUFuQkMsbURBQTBCOzs7Ozs7SUFLMUIsZ0RBQXNCOzs7OztJQUl0QixxREFBMkI7Ozs7O0lBSTNCLDBEQUFnQzs7Ozs7SUFJaEMsaURBQW9EOzs7Ozs7QUFPdEQsTUFBTSxLQUFPLDZCQUE2QixHQUE2QyxJQUFJLGNBQWMsQ0FBQywrQkFBK0IsQ0FBQztBQUUxSTtJQStCRSwyQkFBb0IsSUFBZ0IsRUFBcUQsT0FBaUM7UUFBdEcsU0FBSSxHQUFKLElBQUksQ0FBWTtRQW5CNUIsNEJBQXVCLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFFOUQsaUJBQVksR0FBb0I7WUFDdEMsaUJBQWlCLEVBQUUsS0FBSztZQUN4QixvQkFBb0IsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU07U0FDOUMsQ0FBQztRQWVBLElBQUks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Q25COzs7O2dCQXBETyxVQUFVO2dEQWlGdUIsTUFBTSxTQUFDLDZCQUE2QixjQUFHLFFBQVE7Ozs0QkFwRnhGO0NBa0xDLEFBN0hELElBNkhDO1NBMUhZLGlCQUFpQjs7Ozs7O0lBQzVCLGtDQU1FOzs7OztJQUVGLG9EQUFzRTs7Ozs7SUFFdEUseUNBR0U7Ozs7O0lBQ0YsZ0RBQTBDOzs7OztJQUMxQywrQ0FBeUM7Ozs7O0lBQ3pDLDZDQUF1Qzs7Ozs7SUFDdkMsMkNBQWlEOzs7OztJQVVyQyxpQ0FBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0V2ZW50RW1pdHRlciwgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgT25EZXN0cm95LCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2Zyb21FdmVudCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uLCB0aW1lcn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2RlYm91bmNlVGltZSwgZGVsYXksIHJldHJ5V2hlbiwgc3RhcnRXaXRoLCBzd2l0Y2hNYXAsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ2xvZGFzaCc7XG5cbi8qKlxuICogSW5zdGFuY2Ugb2YgdGhpcyBpbnRlcmZhY2UgaXMgdXNlZCB0byByZXBvcnQgY3VycmVudCBjb25uZWN0aW9uIHN0YXR1cy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb25uZWN0aW9uU3RhdGUge1xuICAvKipcbiAgICogXCJUcnVlXCIgaWYgYnJvd3NlciBoYXMgbmV0d29yayBjb25uZWN0aW9uLiBEZXRlcm1pbmVkIGJ5IFdpbmRvdyBvYmplY3RzIFwib25saW5lXCIgLyBcIm9mZmxpbmVcIiBldmVudHMuXG4gICAqL1xuICBoYXNOZXR3b3JrQ29ubmVjdGlvbjogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFwiVHJ1ZVwiIGlmIGJyb3dzZXIgaGFzIEludGVybmV0IGFjY2Vzcy4gRGV0ZXJtaW5lZCBieSBoZWFydGJlYXQgc3lzdGVtIHdoaWNoIHBlcmlvZGljYWxseSBtYWtlcyByZXF1ZXN0IHRvIGhlYXJ0YmVhdCBVcmwuXG4gICAqL1xuICBoYXNJbnRlcm5ldEFjY2VzczogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBJbnN0YW5jZSBvZiB0aGlzIGludGVyZmFjZSBjb3VsZCBiZSB1c2VkIHRvIGNvbmZpZ3VyZSBcIkNvbm5lY3Rpb25TZXJ2aWNlXCIuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zIHtcbiAgLyoqXG4gICAqIENvbnRyb2xzIHRoZSBJbnRlcm5ldCBjb25uZWN0aXZpdHkgaGVhcnRiZWF0IHN5c3RlbS4gRGVmYXVsdCB2YWx1ZSBpcyAndHJ1ZScuXG4gICAqL1xuICBlbmFibGVIZWFydGJlYXQ/OiBib29sZWFuO1xuICAvKipcbiAgICogVXJsIHVzZWQgZm9yIGNoZWNraW5nIEludGVybmV0IGNvbm5lY3Rpdml0eSwgaGVhcnRiZWF0IHN5c3RlbSBwZXJpb2RpY2FsbHkgbWFrZXMgXCJIRUFEXCIgcmVxdWVzdHMgdG8gdGhpcyBVUkwgdG8gZGV0ZXJtaW5lIEludGVybmV0XG4gICAqIGNvbm5lY3Rpb24gc3RhdHVzLiBEZWZhdWx0IHZhbHVlIGlzIFwiLy9pbnRlcm5ldGhlYWx0aHRlc3Qub3JnXCIuXG4gICAqL1xuICBoZWFydGJlYXRVcmw/OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBJbnRlcnZhbCB1c2VkIHRvIGNoZWNrIEludGVybmV0IGNvbm5lY3Rpdml0eSBzcGVjaWZpZWQgaW4gbWlsbGlzZWNvbmRzLiBEZWZhdWx0IHZhbHVlIGlzIFwiMzAwMDBcIi5cbiAgICovXG4gIGhlYXJ0YmVhdEludGVydmFsPzogbnVtYmVyO1xuICAvKipcbiAgICogSW50ZXJ2YWwgdXNlZCB0byByZXRyeSBJbnRlcm5ldCBjb25uZWN0aXZpdHkgY2hlY2tzIHdoZW4gYW4gZXJyb3IgaXMgZGV0ZWN0ZWQgKHdoZW4gbm8gSW50ZXJuZXQgY29ubmVjdGlvbikuIERlZmF1bHQgdmFsdWUgaXMgXCIxMDAwXCIuXG4gICAqL1xuICBoZWFydGJlYXRSZXRyeUludGVydmFsPzogbnVtYmVyO1xuICAvKipcbiAgICogSFRUUCBtZXRob2QgdXNlZCBmb3IgcmVxdWVzdGluZyBoZWFydGJlYXQgVXJsLiBEZWZhdWx0IGlzICdoZWFkJy5cbiAgICovXG4gIHJlcXVlc3RNZXRob2Q/OiAnZ2V0JyB8ICdwb3N0JyB8ICdoZWFkJyB8ICdvcHRpb25zJztcblxufVxuXG4vKipcbiAqIEluamVjdGlvblRva2VuIGZvciBzcGVjaWZpbmcgQ29ubmVjdGlvblNlcnZpY2Ugb3B0aW9ucy5cbiAqL1xuZXhwb3J0IGNvbnN0IENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9uc1Rva2VuOiBJbmplY3Rpb25Ub2tlbjxDb25uZWN0aW9uU2VydmljZU9wdGlvbnM+ID0gbmV3IEluamVjdGlvblRva2VuKCdDb25uZWN0aW9uU2VydmljZU9wdGlvbnNUb2tlbicpO1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290J1xufSlcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uU2VydmljZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgc3RhdGljIERFRkFVTFRfT1BUSU9OUzogQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zID0ge1xuICAgIGVuYWJsZUhlYXJ0YmVhdDogdHJ1ZSxcbiAgICBoZWFydGJlYXRVcmw6ICcvL2ludGVybmV0aGVhbHRodGVzdC5vcmcnLFxuICAgIGhlYXJ0YmVhdEludGVydmFsOiAzMDAwMCxcbiAgICBoZWFydGJlYXRSZXRyeUludGVydmFsOiAxMDAwLFxuICAgIHJlcXVlc3RNZXRob2Q6ICdoZWFkJ1xuICB9O1xuXG4gIHByaXZhdGUgc3RhdGVDaGFuZ2VFdmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPENvbm5lY3Rpb25TdGF0ZT4oKTtcblxuICBwcml2YXRlIGN1cnJlbnRTdGF0ZTogQ29ubmVjdGlvblN0YXRlID0ge1xuICAgIGhhc0ludGVybmV0QWNjZXNzOiBmYWxzZSxcbiAgICBoYXNOZXR3b3JrQ29ubmVjdGlvbjogd2luZG93Lm5hdmlnYXRvci5vbkxpbmVcbiAgfTtcbiAgcHJpdmF0ZSBvZmZsaW5lU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgb25saW5lU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgaHR0cFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIHNlcnZpY2VPcHRpb25zOiBDb25uZWN0aW9uU2VydmljZU9wdGlvbnM7XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgQ29ubmVjdGlvblNlcnZpY2Ugb3B0aW9ucy4gTm90aWNlIHRoYXQgY2hhbmdpbmcgdmFsdWVzIG9mIHRoZSByZXR1cm5lZCBvYmplY3QgaGFzIG5vdCBlZmZlY3Qgb24gc2VydmljZSBleGVjdXRpb24uXG4gICAqIFlvdSBzaG91bGQgdXNlIFwidXBkYXRlT3B0aW9uc1wiIGZ1bmN0aW9uLlxuICAgKi9cbiAgZ2V0IG9wdGlvbnMoKTogQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zIHtcbiAgICByZXR1cm4gXy5jbG9uZSh0aGlzLnNlcnZpY2VPcHRpb25zKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgQEluamVjdChDb25uZWN0aW9uU2VydmljZU9wdGlvbnNUb2tlbikgQE9wdGlvbmFsKCkgb3B0aW9uczogQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zKSB7XG4gICAgdGhpcy5zZXJ2aWNlT3B0aW9ucyA9IF8uZGVmYXVsdHMoe30sIG9wdGlvbnMsIENvbm5lY3Rpb25TZXJ2aWNlLkRFRkFVTFRfT1BUSU9OUyk7XG5cbiAgICB0aGlzLmNoZWNrTmV0d29ya1N0YXRlKCk7XG4gICAgdGhpcy5jaGVja0ludGVybmV0U3RhdGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tJbnRlcm5ldFN0YXRlKCkge1xuXG4gICAgaWYgKCFfLmlzTmlsKHRoaXMuaHR0cFN1YnNjcmlwdGlvbikpIHtcbiAgICAgIHRoaXMuaHR0cFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNlcnZpY2VPcHRpb25zLmVuYWJsZUhlYXJ0YmVhdCkge1xuICAgICAgdGhpcy5odHRwU3Vic2NyaXB0aW9uID0gdGltZXIoMCwgdGhpcy5zZXJ2aWNlT3B0aW9ucy5oZWFydGJlYXRJbnRlcnZhbClcbiAgICAgICAgLnBpcGUoXG4gICAgICAgICAgc3dpdGNoTWFwKCgpID0+IHRoaXMuaHR0cFt0aGlzLnNlcnZpY2VPcHRpb25zLnJlcXVlc3RNZXRob2RdKHRoaXMuc2VydmljZU9wdGlvbnMuaGVhcnRiZWF0VXJsLCB7cmVzcG9uc2VUeXBlOiAndGV4dCd9KSksXG4gICAgICAgICAgcmV0cnlXaGVuKGVycm9ycyA9PlxuICAgICAgICAgICAgZXJyb3JzLnBpcGUoXG4gICAgICAgICAgICAgIC8vIGxvZyBlcnJvciBtZXNzYWdlXG4gICAgICAgICAgICAgIHRhcCh2YWwgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0h0dHAgZXJyb3I6JywgdmFsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZS5oYXNJbnRlcm5ldEFjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdEV2ZW50KCk7XG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAvLyByZXN0YXJ0IGFmdGVyIDUgc2Vjb25kc1xuICAgICAgICAgICAgICBkZWxheSh0aGlzLnNlcnZpY2VPcHRpb25zLmhlYXJ0YmVhdFJldHJ5SW50ZXJ2YWwpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICApXG4gICAgICAgIC5zdWJzY3JpYmUocmVzdWx0ID0+IHtcbiAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZS5oYXNJbnRlcm5ldEFjY2VzcyA9IHRydWU7XG4gICAgICAgICAgdGhpcy5lbWl0RXZlbnQoKTtcbiAgICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VycmVudFN0YXRlLmhhc0ludGVybmV0QWNjZXNzID0gZmFsc2U7XG4gICAgICB0aGlzLmVtaXRFdmVudCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tOZXR3b3JrU3RhdGUoKSB7XG4gICAgdGhpcy5vbmxpbmVTdWJzY3JpcHRpb24gPSBmcm9tRXZlbnQod2luZG93LCAnb25saW5lJykuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuY3VycmVudFN0YXRlLmhhc05ldHdvcmtDb25uZWN0aW9uID0gdHJ1ZTtcbiAgICAgIHRoaXMuY2hlY2tJbnRlcm5ldFN0YXRlKCk7XG4gICAgICB0aGlzLmVtaXRFdmVudCgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5vZmZsaW5lU3Vic2NyaXB0aW9uID0gZnJvbUV2ZW50KHdpbmRvdywgJ29mZmxpbmUnKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5jdXJyZW50U3RhdGUuaGFzTmV0d29ya0Nvbm5lY3Rpb24gPSBmYWxzZTtcbiAgICAgIHRoaXMuY2hlY2tJbnRlcm5ldFN0YXRlKCk7XG4gICAgICB0aGlzLmVtaXRFdmVudCgpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0RXZlbnQoKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZUV2ZW50RW1pdHRlci5lbWl0KHRoaXMuY3VycmVudFN0YXRlKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLm9mZmxpbmVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMub25saW5lU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLmh0dHBTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1vbml0b3IgTmV0d29yayAmIEludGVybmV0IGNvbm5lY3Rpb24gc3RhdHVzIGJ5IHN1YnNjcmliaW5nIHRvIHRoaXMgb2JzZXJ2ZXIuIElmIHlvdSBzZXQgXCJyZXBvcnRDdXJyZW50U3RhdGVcIiB0byBcImZhbHNlXCIgdGhlblxuICAgKiBmdW5jdGlvbiB3aWxsIG5vdCByZXBvcnQgY3VycmVudCBzdGF0dXMgb2YgdGhlIGNvbm5lY3Rpb25zIHdoZW4gaW5pdGlhbGx5IHN1YnNjcmliZWQuXG4gICAqIEBwYXJhbSByZXBvcnRDdXJyZW50U3RhdGUgUmVwb3J0IGN1cnJlbnQgc3RhdGUgd2hlbiBpbml0aWFsIHN1YnNjcmlwdGlvbi4gRGVmYXVsdCBpcyBcInRydWVcIlxuICAgKi9cbiAgbW9uaXRvcihyZXBvcnRDdXJyZW50U3RhdGUgPSB0cnVlKTogT2JzZXJ2YWJsZTxDb25uZWN0aW9uU3RhdGU+IHtcbiAgICByZXR1cm4gcmVwb3J0Q3VycmVudFN0YXRlID9cbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VFdmVudEVtaXR0ZXIucGlwZShcbiAgICAgICAgZGVib3VuY2VUaW1lKDMwMCksXG4gICAgICAgIHN0YXJ0V2l0aCh0aGlzLmN1cnJlbnRTdGF0ZSksXG4gICAgICApXG4gICAgICA6XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlRXZlbnRFbWl0dGVyLnBpcGUoXG4gICAgICAgIGRlYm91bmNlVGltZSgzMDApXG4gICAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBvcHRpb25zIG9mIHRoZSBzZXJ2aWNlLiBZb3UgY291bGQgc3BlY2lmeSBwYXJ0aWFsIG9wdGlvbnMgb2JqZWN0LiBWYWx1ZXMgdGhhdCBhcmUgbm90IHNwZWNpZmllZCB3aWxsIHVzZSBkZWZhdWx0IC8gcHJldmlvdXNcbiAgICogb3B0aW9uIHZhbHVlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgUGFydGlhbCBvcHRpb24gdmFsdWVzLlxuICAgKi9cbiAgdXBkYXRlT3B0aW9ucyhvcHRpb25zOiBQYXJ0aWFsPENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9ucz4pIHtcbiAgICB0aGlzLnNlcnZpY2VPcHRpb25zID0gXy5kZWZhdWx0cyh7fSwgb3B0aW9ucywgdGhpcy5zZXJ2aWNlT3B0aW9ucyk7XG4gICAgdGhpcy5jaGVja0ludGVybmV0U3RhdGUoKTtcbiAgfVxuXG59XG4iXX0=