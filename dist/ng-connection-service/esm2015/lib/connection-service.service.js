/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi1zZXJ2aWNlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZy1jb25uZWN0aW9uLXNlcnZpY2UvIiwic291cmNlcyI6WyJsaWIvY29ubmVjdGlvbi1zZXJ2aWNlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNsRCxPQUFPLEVBQ0wsWUFBWSxFQUNaLE1BQU0sRUFDTixVQUFVLEVBQ1YsY0FBYyxFQUVkLFFBQVEsRUFDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUE0QixLQUFLLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEUsT0FBTyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7Ozs7QUFLM0YscUNBU0M7Ozs7OztJQUxDLCtDQUE4Qjs7Ozs7SUFJOUIsNENBQTJCOzs7Ozs7QUFNN0IsOENBc0JDOzs7Ozs7SUFsQkMsbURBQTBCOzs7Ozs7SUFLMUIsZ0RBQXNCOzs7OztJQUl0QixxREFBMkI7Ozs7O0lBSTNCLDBEQUFnQzs7Ozs7SUFJaEMsaURBQW9EOzs7Ozs7QUFNdEQsTUFBTSxPQUFPLDZCQUE2QixHQUV0QyxJQUFJLGNBQWMsQ0FBQywrQkFBK0IsQ0FBQztBQUt2RCxNQUFNLE9BQU8saUJBQWlCOzs7OztJQThCNUIsWUFDVSxJQUFnQixFQUMyQixPQUFpQztRQUQ1RSxTQUFJLEdBQUosSUFBSSxDQUFZO1FBdEJsQiw0QkFBdUIsR0FBRyxJQUFJLFlBQVksRUFBbUIsQ0FBQztRQUU5RCxpQkFBWSxHQUFvQjtZQUN0QyxpQkFBaUIsRUFBRSxLQUFLO1lBQ3hCLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTTtTQUM5QyxDQUFDO1FBb0JBLElBQUksQ0FBQyxjQUFjLHFCQUNk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QUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDckM7UUFBQyxPQUFPLENBQUMsRUFBRSxHQUFFO0lBQ2hCLENBQUM7Ozs7Ozs7SUFPRCxPQUFPLENBQUMsa0JBQWtCLEdBQUcsSUFBSTtRQUMvQixPQUFPLGtCQUFrQjtZQUN2QixDQUFDLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FDL0IsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUNqQixTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUM3QjtZQUNILENBQUMsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUM7Ozs7Ozs7SUFPRCxhQUFhLENBQUMsT0FBMEM7UUFDdEQsSUFBSSxDQUFDLGNBQWMscUJBQ2QsSUFBSSxDQUFDLGNBQWMsRUFDbkIsT0FBTyxDQUNYLENBQUM7UUFDRixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztJQUM1QixDQUFDOztBQWpJYyxpQ0FBZSxHQUE2QjtJQUN6RCxlQUFlLEVBQUUsSUFBSTtJQUNyQixZQUFZLEVBQUUsMEJBQTBCO0lBQ3hDLGlCQUFpQixFQUFFLEtBQUs7SUFDeEIsc0JBQXNCLEVBQUUsSUFBSTtJQUM1QixhQUFhLEVBQUUsTUFBTTtDQUN0QixDQUFDOztZQVZILFVBQVUsU0FBQztnQkFDVixVQUFVLEVBQUUsTUFBTTthQUNuQjs7OztZQTlEUSxVQUFVOzRDQStGZCxNQUFNLFNBQUMsNkJBQTZCLGNBQUcsUUFBUTs7Ozs7Ozs7SUEvQmxELGtDQU1FOzs7OztJQUVGLG9EQUFzRTs7Ozs7SUFFdEUseUNBR0U7Ozs7O0lBQ0YsZ0RBQTBDOzs7OztJQUMxQywrQ0FBeUM7Ozs7O0lBQ3pDLDZDQUF1Qzs7Ozs7SUFDdkMsMkNBQWlEOzs7OztJQWEvQyxpQ0FBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xyXG5pbXBvcnQge1xyXG4gIEV2ZW50RW1pdHRlcixcclxuICBJbmplY3QsXHJcbiAgSW5qZWN0YWJsZSxcclxuICBJbmplY3Rpb25Ub2tlbixcclxuICBPbkRlc3Ryb3ksXHJcbiAgT3B0aW9uYWxcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgZnJvbUV2ZW50LCBPYnNlcnZhYmxlLCBTdWJzY3JpcHRpb24sIHRpbWVyIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgZGVsYXksIHJldHJ5V2hlbiwgc3RhcnRXaXRoLCBzd2l0Y2hNYXAsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbi8qKlxyXG4gKiBJbnN0YW5jZSBvZiB0aGlzIGludGVyZmFjZSBpcyB1c2VkIHRvIHJlcG9ydCBjdXJyZW50IGNvbm5lY3Rpb24gc3RhdHVzLlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBDb25uZWN0aW9uU3RhdGUge1xyXG4gIC8qKlxyXG4gICAqIFwiVHJ1ZVwiIGlmIGJyb3dzZXIgaGFzIG5ldHdvcmsgY29ubmVjdGlvbi4gRGV0ZXJtaW5lZCBieSBXaW5kb3cgb2JqZWN0cyBcIm9ubGluZVwiIC8gXCJvZmZsaW5lXCIgZXZlbnRzLlxyXG4gICAqL1xyXG4gIGhhc05ldHdvcmtDb25uZWN0aW9uOiBib29sZWFuO1xyXG4gIC8qKlxyXG4gICAqIFwiVHJ1ZVwiIGlmIGJyb3dzZXIgaGFzIEludGVybmV0IGFjY2Vzcy4gRGV0ZXJtaW5lZCBieSBoZWFydGJlYXQgc3lzdGVtIHdoaWNoIHBlcmlvZGljYWxseSBtYWtlcyByZXF1ZXN0IHRvIGhlYXJ0YmVhdCBVcmwuXHJcbiAgICovXHJcbiAgaGFzSW50ZXJuZXRBY2Nlc3M6IGJvb2xlYW47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbnN0YW5jZSBvZiB0aGlzIGludGVyZmFjZSBjb3VsZCBiZSB1c2VkIHRvIGNvbmZpZ3VyZSBcIkNvbm5lY3Rpb25TZXJ2aWNlXCIuXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9ucyB7XHJcbiAgLyoqXHJcbiAgICogQ29udHJvbHMgdGhlIEludGVybmV0IGNvbm5lY3Rpdml0eSBoZWFydGJlYXQgc3lzdGVtLiBEZWZhdWx0IHZhbHVlIGlzICd0cnVlJy5cclxuICAgKi9cclxuICBlbmFibGVIZWFydGJlYXQ/OiBib29sZWFuO1xyXG4gIC8qKlxyXG4gICAqIFVybCB1c2VkIGZvciBjaGVja2luZyBJbnRlcm5ldCBjb25uZWN0aXZpdHksIGhlYXJ0YmVhdCBzeXN0ZW0gcGVyaW9kaWNhbGx5IG1ha2VzIFwiSEVBRFwiIHJlcXVlc3RzIHRvIHRoaXMgVVJMIHRvIGRldGVybWluZSBJbnRlcm5ldFxyXG4gICAqIGNvbm5lY3Rpb24gc3RhdHVzLiBEZWZhdWx0IHZhbHVlIGlzIFwiLy9pbnRlcm5ldGhlYWx0aHRlc3Qub3JnXCIuXHJcbiAgICovXHJcbiAgaGVhcnRiZWF0VXJsPzogc3RyaW5nO1xyXG4gIC8qKlxyXG4gICAqIEludGVydmFsIHVzZWQgdG8gY2hlY2sgSW50ZXJuZXQgY29ubmVjdGl2aXR5IHNwZWNpZmllZCBpbiBtaWxsaXNlY29uZHMuIERlZmF1bHQgdmFsdWUgaXMgXCIzMDAwMFwiLlxyXG4gICAqL1xyXG4gIGhlYXJ0YmVhdEludGVydmFsPzogbnVtYmVyO1xyXG4gIC8qKlxyXG4gICAqIEludGVydmFsIHVzZWQgdG8gcmV0cnkgSW50ZXJuZXQgY29ubmVjdGl2aXR5IGNoZWNrcyB3aGVuIGFuIGVycm9yIGlzIGRldGVjdGVkICh3aGVuIG5vIEludGVybmV0IGNvbm5lY3Rpb24pLiBEZWZhdWx0IHZhbHVlIGlzIFwiMTAwMFwiLlxyXG4gICAqL1xyXG4gIGhlYXJ0YmVhdFJldHJ5SW50ZXJ2YWw/OiBudW1iZXI7XHJcbiAgLyoqXHJcbiAgICogSFRUUCBtZXRob2QgdXNlZCBmb3IgcmVxdWVzdGluZyBoZWFydGJlYXQgVXJsLiBEZWZhdWx0IGlzICdoZWFkJy5cclxuICAgKi9cclxuICByZXF1ZXN0TWV0aG9kPzogJ2dldCcgfCAncG9zdCcgfCAnaGVhZCcgfCAnb3B0aW9ucyc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBJbmplY3Rpb25Ub2tlbiBmb3Igc3BlY2lmaW5nIENvbm5lY3Rpb25TZXJ2aWNlIG9wdGlvbnMuXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zVG9rZW46IEluamVjdGlvblRva2VuPFxyXG4gIENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9uc1xyXG4+ID0gbmV3IEluamVjdGlvblRva2VuKCdDb25uZWN0aW9uU2VydmljZU9wdGlvbnNUb2tlbicpO1xyXG5cclxuQEluamVjdGFibGUoe1xyXG4gIHByb3ZpZGVkSW46ICdyb290J1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvblNlcnZpY2UgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xyXG4gIHByaXZhdGUgc3RhdGljIERFRkFVTFRfT1BUSU9OUzogQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zID0ge1xyXG4gICAgZW5hYmxlSGVhcnRiZWF0OiB0cnVlLFxyXG4gICAgaGVhcnRiZWF0VXJsOiAnLy9pbnRlcm5ldGhlYWx0aHRlc3Qub3JnJyxcclxuICAgIGhlYXJ0YmVhdEludGVydmFsOiAzMDAwMCxcclxuICAgIGhlYXJ0YmVhdFJldHJ5SW50ZXJ2YWw6IDEwMDAsXHJcbiAgICByZXF1ZXN0TWV0aG9kOiAnaGVhZCdcclxuICB9O1xyXG5cclxuICBwcml2YXRlIHN0YXRlQ2hhbmdlRXZlbnRFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcjxDb25uZWN0aW9uU3RhdGU+KCk7XHJcblxyXG4gIHByaXZhdGUgY3VycmVudFN0YXRlOiBDb25uZWN0aW9uU3RhdGUgPSB7XHJcbiAgICBoYXNJbnRlcm5ldEFjY2VzczogZmFsc2UsXHJcbiAgICBoYXNOZXR3b3JrQ29ubmVjdGlvbjogd2luZG93Lm5hdmlnYXRvci5vbkxpbmVcclxuICB9O1xyXG4gIHByaXZhdGUgb2ZmbGluZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xyXG4gIHByaXZhdGUgb25saW5lU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcbiAgcHJpdmF0ZSBodHRwU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcbiAgcHJpdmF0ZSBzZXJ2aWNlT3B0aW9uczogQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zO1xyXG5cclxuICAvKipcclxuICAgKiBDdXJyZW50IENvbm5lY3Rpb25TZXJ2aWNlIG9wdGlvbnMuIE5vdGljZSB0aGF0IGNoYW5naW5nIHZhbHVlcyBvZiB0aGUgcmV0dXJuZWQgb2JqZWN0IGhhcyBub3QgZWZmZWN0IG9uIHNlcnZpY2UgZXhlY3V0aW9uLlxyXG4gICAqIFlvdSBzaG91bGQgdXNlIFwidXBkYXRlT3B0aW9uc1wiIGZ1bmN0aW9uLlxyXG4gICAqL1xyXG4gIGdldCBvcHRpb25zKCk6IENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9ucyB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAuLi50aGlzLnNlcnZpY2VPcHRpb25zXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsXHJcbiAgICBASW5qZWN0KENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9uc1Rva2VuKSBAT3B0aW9uYWwoKSBvcHRpb25zOiBDb25uZWN0aW9uU2VydmljZU9wdGlvbnNcclxuICApIHtcclxuICAgIHRoaXMuc2VydmljZU9wdGlvbnMgPSB7XHJcbiAgICAgIC4uLkNvbm5lY3Rpb25TZXJ2aWNlLkRFRkFVTFRfT1BUSU9OUyxcclxuICAgICAgLi4ub3B0aW9uc1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmNoZWNrTmV0d29ya1N0YXRlKCk7XHJcbiAgICB0aGlzLmNoZWNrSW50ZXJuZXRTdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVja0ludGVybmV0U3RhdGUoKSB7XHJcbiAgICBpZiAodGhpcy5odHRwU3Vic2NyaXB0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5odHRwU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuc2VydmljZU9wdGlvbnMuZW5hYmxlSGVhcnRiZWF0KSB7XHJcbiAgICAgIHRoaXMuaHR0cFN1YnNjcmlwdGlvbiA9IHRpbWVyKDAsIHRoaXMuc2VydmljZU9wdGlvbnMuaGVhcnRiZWF0SW50ZXJ2YWwpXHJcbiAgICAgICAgLnBpcGUoXHJcbiAgICAgICAgICBzd2l0Y2hNYXAoKCkgPT5cclxuICAgICAgICAgICAgdGhpcy5odHRwW3RoaXMuc2VydmljZU9wdGlvbnMucmVxdWVzdE1ldGhvZF0odGhpcy5zZXJ2aWNlT3B0aW9ucy5oZWFydGJlYXRVcmwsIHtcclxuICAgICAgICAgICAgICByZXNwb25zZVR5cGU6ICd0ZXh0J1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgKSxcclxuICAgICAgICAgIHJldHJ5V2hlbihlcnJvcnMgPT5cclxuICAgICAgICAgICAgZXJyb3JzLnBpcGUoXHJcbiAgICAgICAgICAgICAgLy8gbG9nIGVycm9yIG1lc3NhZ2VcclxuICAgICAgICAgICAgICB0YXAodmFsID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0h0dHAgZXJyb3I6JywgdmFsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFN0YXRlLmhhc0ludGVybmV0QWNjZXNzID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXRFdmVudCgpO1xyXG4gICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgIC8vIHJlc3RhcnQgYWZ0ZXIgNSBzZWNvbmRzXHJcbiAgICAgICAgICAgICAgZGVsYXkodGhpcy5zZXJ2aWNlT3B0aW9ucy5oZWFydGJlYXRSZXRyeUludGVydmFsKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgKVxyXG4gICAgICAgIC5zdWJzY3JpYmUocmVzdWx0ID0+IHtcclxuICAgICAgICAgIHRoaXMuY3VycmVudFN0YXRlLmhhc0ludGVybmV0QWNjZXNzID0gdHJ1ZTtcclxuICAgICAgICAgIHRoaXMuZW1pdEV2ZW50KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmN1cnJlbnRTdGF0ZS5oYXNJbnRlcm5ldEFjY2VzcyA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmVtaXRFdmVudCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjaGVja05ldHdvcmtTdGF0ZSgpIHtcclxuICAgIHRoaXMub25saW5lU3Vic2NyaXB0aW9uID0gZnJvbUV2ZW50KHdpbmRvdywgJ29ubGluZScpLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgIHRoaXMuY3VycmVudFN0YXRlLmhhc05ldHdvcmtDb25uZWN0aW9uID0gdHJ1ZTtcclxuICAgICAgdGhpcy5jaGVja0ludGVybmV0U3RhdGUoKTtcclxuICAgICAgdGhpcy5lbWl0RXZlbnQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMub2ZmbGluZVN1YnNjcmlwdGlvbiA9IGZyb21FdmVudCh3aW5kb3csICdvZmZsaW5lJykuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy5jdXJyZW50U3RhdGUuaGFzTmV0d29ya0Nvbm5lY3Rpb24gPSBmYWxzZTtcclxuICAgICAgdGhpcy5jaGVja0ludGVybmV0U3RhdGUoKTtcclxuICAgICAgdGhpcy5lbWl0RXZlbnQoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBlbWl0RXZlbnQoKSB7XHJcbiAgICB0aGlzLnN0YXRlQ2hhbmdlRXZlbnRFbWl0dGVyLmVtaXQodGhpcy5jdXJyZW50U3RhdGUpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLm9mZmxpbmVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgdGhpcy5vbmxpbmVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgdGhpcy5odHRwU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9IGNhdGNoIChlKSB7fVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTW9uaXRvciBOZXR3b3JrICYgSW50ZXJuZXQgY29ubmVjdGlvbiBzdGF0dXMgYnkgc3Vic2NyaWJpbmcgdG8gdGhpcyBvYnNlcnZlci4gSWYgeW91IHNldCBcInJlcG9ydEN1cnJlbnRTdGF0ZVwiIHRvIFwiZmFsc2VcIiB0aGVuXHJcbiAgICogZnVuY3Rpb24gd2lsbCBub3QgcmVwb3J0IGN1cnJlbnQgc3RhdHVzIG9mIHRoZSBjb25uZWN0aW9ucyB3aGVuIGluaXRpYWxseSBzdWJzY3JpYmVkLlxyXG4gICAqIEBwYXJhbSByZXBvcnRDdXJyZW50U3RhdGUgUmVwb3J0IGN1cnJlbnQgc3RhdGUgd2hlbiBpbml0aWFsIHN1YnNjcmlwdGlvbi4gRGVmYXVsdCBpcyBcInRydWVcIlxyXG4gICAqL1xyXG4gIG1vbml0b3IocmVwb3J0Q3VycmVudFN0YXRlID0gdHJ1ZSk6IE9ic2VydmFibGU8Q29ubmVjdGlvblN0YXRlPiB7XHJcbiAgICByZXR1cm4gcmVwb3J0Q3VycmVudFN0YXRlXHJcbiAgICAgID8gdGhpcy5zdGF0ZUNoYW5nZUV2ZW50RW1pdHRlci5waXBlKFxyXG4gICAgICAgICAgZGVib3VuY2VUaW1lKDMwMCksXHJcbiAgICAgICAgICBzdGFydFdpdGgodGhpcy5jdXJyZW50U3RhdGUpXHJcbiAgICAgICAgKVxyXG4gICAgICA6IHRoaXMuc3RhdGVDaGFuZ2VFdmVudEVtaXR0ZXIucGlwZShkZWJvdW5jZVRpbWUoMzAwKSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgb3B0aW9ucyBvZiB0aGUgc2VydmljZS4gWW91IGNvdWxkIHNwZWNpZnkgcGFydGlhbCBvcHRpb25zIG9iamVjdC4gVmFsdWVzIHRoYXQgYXJlIG5vdCBzcGVjaWZpZWQgd2lsbCB1c2UgZGVmYXVsdCAvIHByZXZpb3VzXHJcbiAgICogb3B0aW9uIHZhbHVlcy5cclxuICAgKiBAcGFyYW0gb3B0aW9ucyBQYXJ0aWFsIG9wdGlvbiB2YWx1ZXMuXHJcbiAgICovXHJcbiAgdXBkYXRlT3B0aW9ucyhvcHRpb25zOiBQYXJ0aWFsPENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9ucz4pIHtcclxuICAgIHRoaXMuc2VydmljZU9wdGlvbnMgPSB7XHJcbiAgICAgIC4uLnRoaXMuc2VydmljZU9wdGlvbnMsXHJcbiAgICAgIC4uLm9wdGlvbnNcclxuICAgIH07XHJcbiAgICB0aGlzLmNoZWNrSW50ZXJuZXRTdGF0ZSgpO1xyXG4gIH1cclxufVxyXG4iXX0=