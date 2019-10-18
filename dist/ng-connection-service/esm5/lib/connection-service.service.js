/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { fromEvent, timer } from 'rxjs';
import { debounceTime, delay, retryWhen, startWith, switchMap, tap } from 'rxjs/operators';
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
        this.serviceOptions = tslib_1.__assign({}, ConnectionService.DEFAULT_OPTIONS, options);
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
            return tslib_1.__assign({}, this.serviceOptions);
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
            this.httpSubscription = timer(0, this.serviceOptions.heartbeatInterval)
                .pipe(switchMap((/**
             * @return {?}
             */
            function () {
                return _this.http[_this.serviceOptions.requestMethod](_this.serviceOptions.heartbeatUrl, {
                    responseType: 'text'
                });
            })), retryWhen((/**
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
            ? this.stateChangeEventEmitter.pipe(debounceTime(300), startWith(this.currentState))
            : this.stateChangeEventEmitter.pipe(debounceTime(300));
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
        this.serviceOptions = tslib_1.__assign({}, this.serviceOptions, options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi1zZXJ2aWNlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1jb25uZWN0aW9uLXNlcnZpY2UvIiwic291cmNlcyI6WyJsaWIvY29ubmVjdGlvbi1zZXJ2aWNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUNMLFlBQVksRUFDWixNQUFNLEVBQ04sVUFBVSxFQUNWLGNBQWMsRUFFZCxRQUFRLEVBQ1QsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsRUFBNEIsS0FBSyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2xFLE9BQU8sRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7Ozs7O0FBSzNGLHFDQVNDOzs7Ozs7SUFMQywrQ0FBOEI7Ozs7O0lBSTlCLDRDQUEyQjs7Ozs7O0FBTTdCLDhDQXNCQzs7Ozs7O0lBbEJDLG1EQUEwQjs7Ozs7O0lBSzFCLGdEQUFzQjs7Ozs7SUFJdEIscURBQTJCOzs7OztJQUkzQiwwREFBZ0M7Ozs7O0lBSWhDLGlEQUFvRDs7Ozs7O0FBTXRELE1BQU0sS0FBTyw2QkFBNkIsR0FFdEMsSUFBSSxjQUFjLENBQUMsK0JBQStCLENBQUM7QUFFdkQ7SUFpQ0UsMkJBQ1UsSUFBZ0IsRUFDMkIsT0FBaUM7UUFENUUsU0FBSSxHQUFKLElBQUksQ0FBWTtRQXRCbEIsNEJBQXVCLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFFOUQsaUJBQVksR0FBb0I7WUFDdEMsaUJBQWlCLEVBQUUsS0FBSztZQUN4QixvQkFBb0IsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU07U0FDOUMsQ0FBQztRQW9CQSxJQUFJLENBQUMsY0FBYyx3QkFDZCxpQkFBaUIsQ0FBQyxlQUFlLEVB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RSx5Q0FHRTs7Ozs7SUFDRixnREFBMEM7Ozs7O0lBQzFDLCtDQUF5Qzs7Ozs7SUFDekMsNkNBQXVDOzs7OztJQUN2QywyQ0FBaUQ7Ozs7O0lBYS9DLGlDQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XHJcbmltcG9ydCB7XHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIEluamVjdCxcclxuICBJbmplY3RhYmxlLFxyXG4gIEluamVjdGlvblRva2VuLFxyXG4gIE9uRGVzdHJveSxcclxuICBPcHRpb25hbFxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBmcm9tRXZlbnQsIE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiwgdGltZXIgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgZGVib3VuY2VUaW1lLCBkZWxheSwgcmV0cnlXaGVuLCBzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuLyoqXHJcbiAqIEluc3RhbmNlIG9mIHRoaXMgaW50ZXJmYWNlIGlzIHVzZWQgdG8gcmVwb3J0IGN1cnJlbnQgY29ubmVjdGlvbiBzdGF0dXMuXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIENvbm5lY3Rpb25TdGF0ZSB7XHJcbiAgLyoqXHJcbiAgICogXCJUcnVlXCIgaWYgYnJvd3NlciBoYXMgbmV0d29yayBjb25uZWN0aW9uLiBEZXRlcm1pbmVkIGJ5IFdpbmRvdyBvYmplY3RzIFwib25saW5lXCIgLyBcIm9mZmxpbmVcIiBldmVudHMuXHJcbiAgICovXHJcbiAgaGFzTmV0d29ya0Nvbm5lY3Rpb246IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogXCJUcnVlXCIgaWYgYnJvd3NlciBoYXMgSW50ZXJuZXQgYWNjZXNzLiBEZXRlcm1pbmVkIGJ5IGhlYXJ0YmVhdCBzeXN0ZW0gd2hpY2ggcGVyaW9kaWNhbGx5IG1ha2VzIHJlcXVlc3QgdG8gaGVhcnRiZWF0IFVybC5cclxuICAgKi9cclxuICBoYXNJbnRlcm5ldEFjY2VzczogYm9vbGVhbjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEluc3RhbmNlIG9mIHRoaXMgaW50ZXJmYWNlIGNvdWxkIGJlIHVzZWQgdG8gY29uZmlndXJlIFwiQ29ubmVjdGlvblNlcnZpY2VcIi5cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zIHtcclxuICAvKipcclxuICAgKiBDb250cm9scyB0aGUgSW50ZXJuZXQgY29ubmVjdGl2aXR5IGhlYXJ0YmVhdCBzeXN0ZW0uIERlZmF1bHQgdmFsdWUgaXMgJ3RydWUnLlxyXG4gICAqL1xyXG4gIGVuYWJsZUhlYXJ0YmVhdD86IGJvb2xlYW47XHJcbiAgLyoqXHJcbiAgICogVXJsIHVzZWQgZm9yIGNoZWNraW5nIEludGVybmV0IGNvbm5lY3Rpdml0eSwgaGVhcnRiZWF0IHN5c3RlbSBwZXJpb2RpY2FsbHkgbWFrZXMgXCJIRUFEXCIgcmVxdWVzdHMgdG8gdGhpcyBVUkwgdG8gZGV0ZXJtaW5lIEludGVybmV0XHJcbiAgICogY29ubmVjdGlvbiBzdGF0dXMuIERlZmF1bHQgdmFsdWUgaXMgXCIvL2ludGVybmV0aGVhbHRodGVzdC5vcmdcIi5cclxuICAgKi9cclxuICBoZWFydGJlYXRVcmw/OiBzdHJpbmc7XHJcbiAgLyoqXHJcbiAgICogSW50ZXJ2YWwgdXNlZCB0byBjaGVjayBJbnRlcm5ldCBjb25uZWN0aXZpdHkgc3BlY2lmaWVkIGluIG1pbGxpc2Vjb25kcy4gRGVmYXVsdCB2YWx1ZSBpcyBcIjMwMDAwXCIuXHJcbiAgICovXHJcbiAgaGVhcnRiZWF0SW50ZXJ2YWw/OiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogSW50ZXJ2YWwgdXNlZCB0byByZXRyeSBJbnRlcm5ldCBjb25uZWN0aXZpdHkgY2hlY2tzIHdoZW4gYW4gZXJyb3IgaXMgZGV0ZWN0ZWQgKHdoZW4gbm8gSW50ZXJuZXQgY29ubmVjdGlvbikuIERlZmF1bHQgdmFsdWUgaXMgXCIxMDAwXCIuXHJcbiAgICovXHJcbiAgaGVhcnRiZWF0UmV0cnlJbnRlcnZhbD86IG51bWJlcjtcclxuICAvKipcclxuICAgKiBIVFRQIG1ldGhvZCB1c2VkIGZvciByZXF1ZXN0aW5nIGhlYXJ0YmVhdCBVcmwuIERlZmF1bHQgaXMgJ2hlYWQnLlxyXG4gICAqL1xyXG4gIHJlcXVlc3RNZXRob2Q/OiAnZ2V0JyB8ICdwb3N0JyB8ICdoZWFkJyB8ICdvcHRpb25zJztcclxufVxyXG5cclxuLyoqXHJcbiAqIEluamVjdGlvblRva2VuIGZvciBzcGVjaWZpbmcgQ29ubmVjdGlvblNlcnZpY2Ugb3B0aW9ucy5cclxuICovXHJcbmV4cG9ydCBjb25zdCBDb25uZWN0aW9uU2VydmljZU9wdGlvbnNUb2tlbjogSW5qZWN0aW9uVG9rZW48XHJcbiAgQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zXHJcbj4gPSBuZXcgSW5qZWN0aW9uVG9rZW4oJ0Nvbm5lY3Rpb25TZXJ2aWNlT3B0aW9uc1Rva2VuJyk7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBDb25uZWN0aW9uU2VydmljZSBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XHJcbiAgcHJpdmF0ZSBzdGF0aWMgREVGQVVMVF9PUFRJT05TOiBDb25uZWN0aW9uU2VydmljZU9wdGlvbnMgPSB7XHJcbiAgICBlbmFibGVIZWFydGJlYXQ6IHRydWUsXHJcbiAgICBoZWFydGJlYXRVcmw6ICcvL2ludGVybmV0aGVhbHRodGVzdC5vcmcnLFxyXG4gICAgaGVhcnRiZWF0SW50ZXJ2YWw6IDMwMDAwLFxyXG4gICAgaGVhcnRiZWF0UmV0cnlJbnRlcnZhbDogMTAwMCxcclxuICAgIHJlcXVlc3RNZXRob2Q6ICdoZWFkJ1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgc3RhdGVDaGFuZ2VFdmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPENvbm5lY3Rpb25TdGF0ZT4oKTtcclxuXHJcbiAgcHJpdmF0ZSBjdXJyZW50U3RhdGU6IENvbm5lY3Rpb25TdGF0ZSA9IHtcclxuICAgIGhhc0ludGVybmV0QWNjZXNzOiBmYWxzZSxcclxuICAgIGhhc05ldHdvcmtDb25uZWN0aW9uOiB3aW5kb3cubmF2aWdhdG9yLm9uTGluZVxyXG4gIH07XHJcbiAgcHJpdmF0ZSBvZmZsaW5lU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcbiAgcHJpdmF0ZSBvbmxpbmVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuICBwcml2YXRlIGh0dHBTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuICBwcml2YXRlIHNlcnZpY2VPcHRpb25zOiBDb25uZWN0aW9uU2VydmljZU9wdGlvbnM7XHJcblxyXG4gIC8qKlxyXG4gICAqIEN1cnJlbnQgQ29ubmVjdGlvblNlcnZpY2Ugb3B0aW9ucy4gTm90aWNlIHRoYXQgY2hhbmdpbmcgdmFsdWVzIG9mIHRoZSByZXR1cm5lZCBvYmplY3QgaGFzIG5vdCBlZmZlY3Qgb24gc2VydmljZSBleGVjdXRpb24uXHJcbiAgICogWW91IHNob3VsZCB1c2UgXCJ1cGRhdGVPcHRpb25zXCIgZnVuY3Rpb24uXHJcbiAgICovXHJcbiAgZ2V0IG9wdGlvbnMoKTogQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIC4uLnRoaXMuc2VydmljZU9wdGlvbnNcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcclxuICAgIEBJbmplY3QoQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zVG9rZW4pIEBPcHRpb25hbCgpIG9wdGlvbnM6IENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9uc1xyXG4gICkge1xyXG4gICAgdGhpcy5zZXJ2aWNlT3B0aW9ucyA9IHtcclxuICAgICAgLi4uQ29ubmVjdGlvblNlcnZpY2UuREVGQVVMVF9PUFRJT05TLFxyXG4gICAgICAuLi5vcHRpb25zXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuY2hlY2tOZXR3b3JrU3RhdGUoKTtcclxuICAgIHRoaXMuY2hlY2tJbnRlcm5ldFN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNoZWNrSW50ZXJuZXRTdGF0ZSgpIHtcclxuICAgIGlmICh0aGlzLmh0dHBTdWJzY3JpcHRpb24gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLmh0dHBTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zZXJ2aWNlT3B0aW9ucy5lbmFibGVIZWFydGJlYXQpIHtcclxuICAgICAgdGhpcy5odHRwU3Vic2NyaXB0aW9uID0gdGltZXIoMCwgdGhpcy5zZXJ2aWNlT3B0aW9ucy5oZWFydGJlYXRJbnRlcnZhbClcclxuICAgICAgICAucGlwZShcclxuICAgICAgICAgIHN3aXRjaE1hcCgoKSA9PlxyXG4gICAgICAgICAgICB0aGlzLmh0dHBbdGhpcy5zZXJ2aWNlT3B0aW9ucy5yZXF1ZXN0TWV0aG9kXSh0aGlzLnNlcnZpY2VPcHRpb25zLmhlYXJ0YmVhdFVybCwge1xyXG4gICAgICAgICAgICAgIHJlc3BvbnNlVHlwZTogJ3RleHQnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICApLFxyXG4gICAgICAgICAgcmV0cnlXaGVuKGVycm9ycyA9PlxyXG4gICAgICAgICAgICBlcnJvcnMucGlwZShcclxuICAgICAgICAgICAgICAvLyBsb2cgZXJyb3IgbWVzc2FnZVxyXG4gICAgICAgICAgICAgIHRhcCh2YWwgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignSHR0cCBlcnJvcjonLCB2YWwpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUuaGFzSW50ZXJuZXRBY2Nlc3MgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdEV2ZW50KCk7XHJcbiAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgLy8gcmVzdGFydCBhZnRlciA1IHNlY29uZHNcclxuICAgICAgICAgICAgICBkZWxheSh0aGlzLnNlcnZpY2VPcHRpb25zLmhlYXJ0YmVhdFJldHJ5SW50ZXJ2YWwpXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgIClcclxuICAgICAgICApXHJcbiAgICAgICAgLnN1YnNjcmliZShyZXN1bHQgPT4ge1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUuaGFzSW50ZXJuZXRBY2Nlc3MgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5lbWl0RXZlbnQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY3VycmVudFN0YXRlLmhhc0ludGVybmV0QWNjZXNzID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuZW1pdEV2ZW50KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNoZWNrTmV0d29ya1N0YXRlKCkge1xyXG4gICAgdGhpcy5vbmxpbmVTdWJzY3JpcHRpb24gPSBmcm9tRXZlbnQod2luZG93LCAnb25saW5lJykuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy5jdXJyZW50U3RhdGUuaGFzTmV0d29ya0Nvbm5lY3Rpb24gPSB0cnVlO1xyXG4gICAgICB0aGlzLmNoZWNrSW50ZXJuZXRTdGF0ZSgpO1xyXG4gICAgICB0aGlzLmVtaXRFdmVudCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5vZmZsaW5lU3Vic2NyaXB0aW9uID0gZnJvbUV2ZW50KHdpbmRvdywgJ29mZmxpbmUnKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLmN1cnJlbnRTdGF0ZS5oYXNOZXR3b3JrQ29ubmVjdGlvbiA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmNoZWNrSW50ZXJuZXRTdGF0ZSgpO1xyXG4gICAgICB0aGlzLmVtaXRFdmVudCgpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGVtaXRFdmVudCgpIHtcclxuICAgIHRoaXMuc3RhdGVDaGFuZ2VFdmVudEVtaXR0ZXIuZW1pdCh0aGlzLmN1cnJlbnRTdGF0ZSk7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIHRoaXMub2ZmbGluZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICB0aGlzLm9ubGluZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICB0aGlzLmh0dHBTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgIH0gY2F0Y2ggKGUpIHt9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNb25pdG9yIE5ldHdvcmsgJiBJbnRlcm5ldCBjb25uZWN0aW9uIHN0YXR1cyBieSBzdWJzY3JpYmluZyB0byB0aGlzIG9ic2VydmVyLiBJZiB5b3Ugc2V0IFwicmVwb3J0Q3VycmVudFN0YXRlXCIgdG8gXCJmYWxzZVwiIHRoZW5cclxuICAgKiBmdW5jdGlvbiB3aWxsIG5vdCByZXBvcnQgY3VycmVudCBzdGF0dXMgb2YgdGhlIGNvbm5lY3Rpb25zIHdoZW4gaW5pdGlhbGx5IHN1YnNjcmliZWQuXHJcbiAgICogQHBhcmFtIHJlcG9ydEN1cnJlbnRTdGF0ZSBSZXBvcnQgY3VycmVudCBzdGF0ZSB3aGVuIGluaXRpYWwgc3Vic2NyaXB0aW9uLiBEZWZhdWx0IGlzIFwidHJ1ZVwiXHJcbiAgICovXHJcbiAgbW9uaXRvcihyZXBvcnRDdXJyZW50U3RhdGUgPSB0cnVlKTogT2JzZXJ2YWJsZTxDb25uZWN0aW9uU3RhdGU+IHtcclxuICAgIHJldHVybiByZXBvcnRDdXJyZW50U3RhdGVcclxuICAgICAgPyB0aGlzLnN0YXRlQ2hhbmdlRXZlbnRFbWl0dGVyLnBpcGUoXHJcbiAgICAgICAgICBkZWJvdW5jZVRpbWUoMzAwKSxcclxuICAgICAgICAgIHN0YXJ0V2l0aCh0aGlzLmN1cnJlbnRTdGF0ZSlcclxuICAgICAgICApXHJcbiAgICAgIDogdGhpcy5zdGF0ZUNoYW5nZUV2ZW50RW1pdHRlci5waXBlKGRlYm91bmNlVGltZSgzMDApKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZSBvcHRpb25zIG9mIHRoZSBzZXJ2aWNlLiBZb3UgY291bGQgc3BlY2lmeSBwYXJ0aWFsIG9wdGlvbnMgb2JqZWN0LiBWYWx1ZXMgdGhhdCBhcmUgbm90IHNwZWNpZmllZCB3aWxsIHVzZSBkZWZhdWx0IC8gcHJldmlvdXNcclxuICAgKiBvcHRpb24gdmFsdWVzLlxyXG4gICAqIEBwYXJhbSBvcHRpb25zIFBhcnRpYWwgb3B0aW9uIHZhbHVlcy5cclxuICAgKi9cclxuICB1cGRhdGVPcHRpb25zKG9wdGlvbnM6IFBhcnRpYWw8Q29ubmVjdGlvblNlcnZpY2VPcHRpb25zPikge1xyXG4gICAgdGhpcy5zZXJ2aWNlT3B0aW9ucyA9IHtcclxuICAgICAgLi4udGhpcy5zZXJ2aWNlT3B0aW9ucyxcclxuICAgICAgLi4ub3B0aW9uc1xyXG4gICAgfTtcclxuICAgIHRoaXMuY2hlY2tJbnRlcm5ldFN0YXRlKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==