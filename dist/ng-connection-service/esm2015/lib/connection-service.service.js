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
export const ConnectionServiceOptionsToken = new InjectionToken('ConnectionServiceOptionsToken');
export class ConnectionService {
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
        this.serviceOptions = _.defaults({}, options, ConnectionService.DEFAULT_OPTIONS);
        this.checkNetworkState();
        this.checkInternetState();
    }
    /**
     * Current ConnectionService options. Notice that changing values of the returned object has not effect on service execution.
     * You should use "updateOptions" function.
     * @return {?}
     */
    get options() {
        return _.clone(this.serviceOptions);
    }
    /**
     * @private
     * @return {?}
     */
    checkInternetState() {
        if (!_.isNil(this.httpSubscription)) {
            this.httpSubscription.unsubscribe();
        }
        if (this.serviceOptions.enableHeartbeat) {
            this.httpSubscription = timer(0, this.serviceOptions.heartbeatInterval)
                .pipe(switchMap((/**
             * @return {?}
             */
            () => this.http[this.serviceOptions.requestMethod](this.serviceOptions.heartbeatUrl, { responseType: 'text' }))), retryWhen((/**
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
            this.stateChangeEventEmitter.pipe(debounceTime(300), startWith(this.currentState))
            :
                this.stateChangeEventEmitter.pipe(debounceTime(300));
    }
    /**
     * Update options of the service. You could specify partial options object. Values that are not specified will use default / previous
     * option values.
     * @param {?} options Partial option values.
     * @return {?}
     */
    updateOptions(options) {
        this.serviceOptions = _.defaults({}, options, this.serviceOptions);
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
/** @nocollapse */ ConnectionService.ngInjectableDef = i0.ɵɵdefineInjectable({ factory: function ConnectionService_Factory() { return new ConnectionService(i0.ɵɵinject(i1.HttpClient), i0.ɵɵinject(ConnectionServiceOptionsToken, 8)); }, token: ConnectionService, providedIn: "root" });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi1zZXJ2aWNlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1jb25uZWN0aW9uLXNlcnZpY2UvIiwic291cmNlcyI6WyJsaWIvY29ubmVjdGlvbi1zZXJ2aWNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxZQUFZLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQWEsUUFBUSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3BHLE9BQU8sRUFBQyxTQUFTLEVBQTRCLEtBQUssRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUNoRSxPQUFPLEVBQUMsWUFBWSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RixPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDaEQsT0FBTyxLQUFLLENBQUMsTUFBTSxRQUFRLENBQUM7Ozs7Ozs7QUFLNUIscUNBU0M7Ozs7OztJQUxDLCtDQUE4Qjs7Ozs7SUFJOUIsNENBQTJCOzs7Ozs7QUFNN0IsOENBdUJDOzs7Ozs7SUFuQkMsbURBQTBCOzs7Ozs7SUFLMUIsZ0RBQXNCOzs7OztJQUl0QixxREFBMkI7Ozs7O0lBSTNCLDBEQUFnQzs7Ozs7SUFJaEMsaURBQW9EOzs7Ozs7QUFPdEQsTUFBTSxPQUFPLDZCQUE2QixHQUE2QyxJQUFJLGNBQWMsQ0FBQywrQkFBK0IsQ0FBQztBQUsxSSxNQUFNLE9BQU8saUJBQWlCOzs7OztJQTRCNUIsWUFBb0IsSUFBZ0IsRUFBcUQsT0FBaUM7UUFBdEcsU0FBSSxHQUFKLElBQUksQ0FBWTtRQW5CNUIsNEJBQXVCLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFFOUQsaUJBQVksR0FBb0I7WUFDdEMsaUJBQWlCLEVBQUUsS0FBSztZQUN4QixvQkFBb0IsRUFBRSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU07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MEM7Ozs7O0lBQzFDLCtDQUF5Qzs7Ozs7SUFDekMsNkNBQXVDOzs7OztJQUN2QywyQ0FBaUQ7Ozs7O0lBVXJDLGlDQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RXZlbnRFbWl0dGVyLCBJbmplY3QsIEluamVjdGFibGUsIEluamVjdGlvblRva2VuLCBPbkRlc3Ryb3ksIE9wdGlvbmFsfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7ZnJvbUV2ZW50LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24sIHRpbWVyfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZGVib3VuY2VUaW1lLCBkZWxheSwgcmV0cnlXaGVuLCBzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFwfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0h0dHBDbGllbnR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcblxuLyoqXG4gKiBJbnN0YW5jZSBvZiB0aGlzIGludGVyZmFjZSBpcyB1c2VkIHRvIHJlcG9ydCBjdXJyZW50IGNvbm5lY3Rpb24gc3RhdHVzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbm5lY3Rpb25TdGF0ZSB7XG4gIC8qKlxuICAgKiBcIlRydWVcIiBpZiBicm93c2VyIGhhcyBuZXR3b3JrIGNvbm5lY3Rpb24uIERldGVybWluZWQgYnkgV2luZG93IG9iamVjdHMgXCJvbmxpbmVcIiAvIFwib2ZmbGluZVwiIGV2ZW50cy5cbiAgICovXG4gIGhhc05ldHdvcmtDb25uZWN0aW9uOiBib29sZWFuO1xuICAvKipcbiAgICogXCJUcnVlXCIgaWYgYnJvd3NlciBoYXMgSW50ZXJuZXQgYWNjZXNzLiBEZXRlcm1pbmVkIGJ5IGhlYXJ0YmVhdCBzeXN0ZW0gd2hpY2ggcGVyaW9kaWNhbGx5IG1ha2VzIHJlcXVlc3QgdG8gaGVhcnRiZWF0IFVybC5cbiAgICovXG4gIGhhc0ludGVybmV0QWNjZXNzOiBib29sZWFuO1xufVxuXG4vKipcbiAqIEluc3RhbmNlIG9mIHRoaXMgaW50ZXJmYWNlIGNvdWxkIGJlIHVzZWQgdG8gY29uZmlndXJlIFwiQ29ubmVjdGlvblNlcnZpY2VcIi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb25uZWN0aW9uU2VydmljZU9wdGlvbnMge1xuICAvKipcbiAgICogQ29udHJvbHMgdGhlIEludGVybmV0IGNvbm5lY3Rpdml0eSBoZWFydGJlYXQgc3lzdGVtLiBEZWZhdWx0IHZhbHVlIGlzICd0cnVlJy5cbiAgICovXG4gIGVuYWJsZUhlYXJ0YmVhdD86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBVcmwgdXNlZCBmb3IgY2hlY2tpbmcgSW50ZXJuZXQgY29ubmVjdGl2aXR5LCBoZWFydGJlYXQgc3lzdGVtIHBlcmlvZGljYWxseSBtYWtlcyBcIkhFQURcIiByZXF1ZXN0cyB0byB0aGlzIFVSTCB0byBkZXRlcm1pbmUgSW50ZXJuZXRcbiAgICogY29ubmVjdGlvbiBzdGF0dXMuIERlZmF1bHQgdmFsdWUgaXMgXCIvL2ludGVybmV0aGVhbHRodGVzdC5vcmdcIi5cbiAgICovXG4gIGhlYXJ0YmVhdFVybD86IHN0cmluZztcbiAgLyoqXG4gICAqIEludGVydmFsIHVzZWQgdG8gY2hlY2sgSW50ZXJuZXQgY29ubmVjdGl2aXR5IHNwZWNpZmllZCBpbiBtaWxsaXNlY29uZHMuIERlZmF1bHQgdmFsdWUgaXMgXCIzMDAwMFwiLlxuICAgKi9cbiAgaGVhcnRiZWF0SW50ZXJ2YWw/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBJbnRlcnZhbCB1c2VkIHRvIHJldHJ5IEludGVybmV0IGNvbm5lY3Rpdml0eSBjaGVja3Mgd2hlbiBhbiBlcnJvciBpcyBkZXRlY3RlZCAod2hlbiBubyBJbnRlcm5ldCBjb25uZWN0aW9uKS4gRGVmYXVsdCB2YWx1ZSBpcyBcIjEwMDBcIi5cbiAgICovXG4gIGhlYXJ0YmVhdFJldHJ5SW50ZXJ2YWw/OiBudW1iZXI7XG4gIC8qKlxuICAgKiBIVFRQIG1ldGhvZCB1c2VkIGZvciByZXF1ZXN0aW5nIGhlYXJ0YmVhdCBVcmwuIERlZmF1bHQgaXMgJ2hlYWQnLlxuICAgKi9cbiAgcmVxdWVzdE1ldGhvZD86ICdnZXQnIHwgJ3Bvc3QnIHwgJ2hlYWQnIHwgJ29wdGlvbnMnO1xuXG59XG5cbi8qKlxuICogSW5qZWN0aW9uVG9rZW4gZm9yIHNwZWNpZmluZyBDb25uZWN0aW9uU2VydmljZSBvcHRpb25zLlxuICovXG5leHBvcnQgY29uc3QgQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zVG9rZW46IEluamVjdGlvblRva2VuPENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9ucz4gPSBuZXcgSW5qZWN0aW9uVG9rZW4oJ0Nvbm5lY3Rpb25TZXJ2aWNlT3B0aW9uc1Rva2VuJyk7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIENvbm5lY3Rpb25TZXJ2aWNlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBzdGF0aWMgREVGQVVMVF9PUFRJT05TOiBDb25uZWN0aW9uU2VydmljZU9wdGlvbnMgPSB7XG4gICAgZW5hYmxlSGVhcnRiZWF0OiB0cnVlLFxuICAgIGhlYXJ0YmVhdFVybDogJy8vaW50ZXJuZXRoZWFsdGh0ZXN0Lm9yZycsXG4gICAgaGVhcnRiZWF0SW50ZXJ2YWw6IDMwMDAwLFxuICAgIGhlYXJ0YmVhdFJldHJ5SW50ZXJ2YWw6IDEwMDAsXG4gICAgcmVxdWVzdE1ldGhvZDogJ2hlYWQnXG4gIH07XG5cbiAgcHJpdmF0ZSBzdGF0ZUNoYW5nZUV2ZW50RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXI8Q29ubmVjdGlvblN0YXRlPigpO1xuXG4gIHByaXZhdGUgY3VycmVudFN0YXRlOiBDb25uZWN0aW9uU3RhdGUgPSB7XG4gICAgaGFzSW50ZXJuZXRBY2Nlc3M6IGZhbHNlLFxuICAgIGhhc05ldHdvcmtDb25uZWN0aW9uOiB3aW5kb3cubmF2aWdhdG9yLm9uTGluZVxuICB9O1xuICBwcml2YXRlIG9mZmxpbmVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBvbmxpbmVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBodHRwU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgc2VydmljZU9wdGlvbnM6IENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9ucztcblxuICAvKipcbiAgICogQ3VycmVudCBDb25uZWN0aW9uU2VydmljZSBvcHRpb25zLiBOb3RpY2UgdGhhdCBjaGFuZ2luZyB2YWx1ZXMgb2YgdGhlIHJldHVybmVkIG9iamVjdCBoYXMgbm90IGVmZmVjdCBvbiBzZXJ2aWNlIGV4ZWN1dGlvbi5cbiAgICogWW91IHNob3VsZCB1c2UgXCJ1cGRhdGVPcHRpb25zXCIgZnVuY3Rpb24uXG4gICAqL1xuICBnZXQgb3B0aW9ucygpOiBDb25uZWN0aW9uU2VydmljZU9wdGlvbnMge1xuICAgIHJldHVybiBfLmNsb25lKHRoaXMuc2VydmljZU9wdGlvbnMpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LCBASW5qZWN0KENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9uc1Rva2VuKSBAT3B0aW9uYWwoKSBvcHRpb25zOiBDb25uZWN0aW9uU2VydmljZU9wdGlvbnMpIHtcbiAgICB0aGlzLnNlcnZpY2VPcHRpb25zID0gXy5kZWZhdWx0cyh7fSwgb3B0aW9ucywgQ29ubmVjdGlvblNlcnZpY2UuREVGQVVMVF9PUFRJT05TKTtcblxuICAgIHRoaXMuY2hlY2tOZXR3b3JrU3RhdGUoKTtcbiAgICB0aGlzLmNoZWNrSW50ZXJuZXRTdGF0ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0ludGVybmV0U3RhdGUoKSB7XG5cbiAgICBpZiAoIV8uaXNOaWwodGhpcy5odHRwU3Vic2NyaXB0aW9uKSkge1xuICAgICAgdGhpcy5odHRwU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2VydmljZU9wdGlvbnMuZW5hYmxlSGVhcnRiZWF0KSB7XG4gICAgICB0aGlzLmh0dHBTdWJzY3JpcHRpb24gPSB0aW1lcigwLCB0aGlzLnNlcnZpY2VPcHRpb25zLmhlYXJ0YmVhdEludGVydmFsKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICBzd2l0Y2hNYXAoKCkgPT4gdGhpcy5odHRwW3RoaXMuc2VydmljZU9wdGlvbnMucmVxdWVzdE1ldGhvZF0odGhpcy5zZXJ2aWNlT3B0aW9ucy5oZWFydGJlYXRVcmwsIHtyZXNwb25zZVR5cGU6ICd0ZXh0J30pKSxcbiAgICAgICAgICByZXRyeVdoZW4oZXJyb3JzID0+XG4gICAgICAgICAgICBlcnJvcnMucGlwZShcbiAgICAgICAgICAgICAgLy8gbG9nIGVycm9yIG1lc3NhZ2VcbiAgICAgICAgICAgICAgdGFwKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignSHR0cCBlcnJvcjonLCB2YWwpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFN0YXRlLmhhc0ludGVybmV0QWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0RXZlbnQoKTtcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIC8vIHJlc3RhcnQgYWZ0ZXIgNSBzZWNvbmRzXG4gICAgICAgICAgICAgIGRlbGF5KHRoaXMuc2VydmljZU9wdGlvbnMuaGVhcnRiZWF0UmV0cnlJbnRlcnZhbClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICAgLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuICAgICAgICAgIHRoaXMuY3VycmVudFN0YXRlLmhhc0ludGVybmV0QWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmVtaXRFdmVudCgpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50U3RhdGUuaGFzSW50ZXJuZXRBY2Nlc3MgPSBmYWxzZTtcbiAgICAgIHRoaXMuZW1pdEV2ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGVja05ldHdvcmtTdGF0ZSgpIHtcbiAgICB0aGlzLm9ubGluZVN1YnNjcmlwdGlvbiA9IGZyb21FdmVudCh3aW5kb3csICdvbmxpbmUnKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5jdXJyZW50U3RhdGUuaGFzTmV0d29ya0Nvbm5lY3Rpb24gPSB0cnVlO1xuICAgICAgdGhpcy5jaGVja0ludGVybmV0U3RhdGUoKTtcbiAgICAgIHRoaXMuZW1pdEV2ZW50KCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9mZmxpbmVTdWJzY3JpcHRpb24gPSBmcm9tRXZlbnQod2luZG93LCAnb2ZmbGluZScpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmN1cnJlbnRTdGF0ZS5oYXNOZXR3b3JrQ29ubmVjdGlvbiA9IGZhbHNlO1xuICAgICAgdGhpcy5jaGVja0ludGVybmV0U3RhdGUoKTtcbiAgICAgIHRoaXMuZW1pdEV2ZW50KCk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGVtaXRFdmVudCgpIHtcbiAgICB0aGlzLnN0YXRlQ2hhbmdlRXZlbnRFbWl0dGVyLmVtaXQodGhpcy5jdXJyZW50U3RhdGUpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMub2ZmbGluZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5vbmxpbmVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuaHR0cFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTW9uaXRvciBOZXR3b3JrICYgSW50ZXJuZXQgY29ubmVjdGlvbiBzdGF0dXMgYnkgc3Vic2NyaWJpbmcgdG8gdGhpcyBvYnNlcnZlci4gSWYgeW91IHNldCBcInJlcG9ydEN1cnJlbnRTdGF0ZVwiIHRvIFwiZmFsc2VcIiB0aGVuXG4gICAqIGZ1bmN0aW9uIHdpbGwgbm90IHJlcG9ydCBjdXJyZW50IHN0YXR1cyBvZiB0aGUgY29ubmVjdGlvbnMgd2hlbiBpbml0aWFsbHkgc3Vic2NyaWJlZC5cbiAgICogQHBhcmFtIHJlcG9ydEN1cnJlbnRTdGF0ZSBSZXBvcnQgY3VycmVudCBzdGF0ZSB3aGVuIGluaXRpYWwgc3Vic2NyaXB0aW9uLiBEZWZhdWx0IGlzIFwidHJ1ZVwiXG4gICAqL1xuICBtb25pdG9yKHJlcG9ydEN1cnJlbnRTdGF0ZSA9IHRydWUpOiBPYnNlcnZhYmxlPENvbm5lY3Rpb25TdGF0ZT4ge1xuICAgIHJldHVybiByZXBvcnRDdXJyZW50U3RhdGUgP1xuICAgICAgdGhpcy5zdGF0ZUNoYW5nZUV2ZW50RW1pdHRlci5waXBlKFxuICAgICAgICBkZWJvdW5jZVRpbWUoMzAwKSxcbiAgICAgICAgc3RhcnRXaXRoKHRoaXMuY3VycmVudFN0YXRlKSxcbiAgICAgIClcbiAgICAgIDpcbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VFdmVudEVtaXR0ZXIucGlwZShcbiAgICAgICAgZGVib3VuY2VUaW1lKDMwMClcbiAgICAgICk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIG9wdGlvbnMgb2YgdGhlIHNlcnZpY2UuIFlvdSBjb3VsZCBzcGVjaWZ5IHBhcnRpYWwgb3B0aW9ucyBvYmplY3QuIFZhbHVlcyB0aGF0IGFyZSBub3Qgc3BlY2lmaWVkIHdpbGwgdXNlIGRlZmF1bHQgLyBwcmV2aW91c1xuICAgKiBvcHRpb24gdmFsdWVzLlxuICAgKiBAcGFyYW0gb3B0aW9ucyBQYXJ0aWFsIG9wdGlvbiB2YWx1ZXMuXG4gICAqL1xuICB1cGRhdGVPcHRpb25zKG9wdGlvbnM6IFBhcnRpYWw8Q29ubmVjdGlvblNlcnZpY2VPcHRpb25zPikge1xuICAgIHRoaXMuc2VydmljZU9wdGlvbnMgPSBfLmRlZmF1bHRzKHt9LCBvcHRpb25zLCB0aGlzLnNlcnZpY2VPcHRpb25zKTtcbiAgICB0aGlzLmNoZWNrSW50ZXJuZXRTdGF0ZSgpO1xuICB9XG5cbn1cbiJdfQ==