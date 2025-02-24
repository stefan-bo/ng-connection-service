import { InjectionToken, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
/**
 * Instance of this interface is used to report current connection status.
 */
export interface ConnectionState {
    /**
     * "True" if browser has network connection. Determined by Window objects "online" / "offline" events.
     */
    hasNetworkConnection: boolean;
    /**
     * "True" if browser has Internet access. Determined by heartbeat system which periodically makes request to heartbeat Url.
     */
    hasInternetAccess: boolean;
}
/**
 * Instance of this interface could be used to configure "ConnectionService".
 */
export interface ConnectionServiceOptions {
    /**
     * Controls the Internet connectivity heartbeat system. Default value is 'true'.
     */
    enableHeartbeat?: boolean;
    /**
     * Url used for checking Internet connectivity, heartbeat system periodically makes "HEAD" requests to this URL to determine Internet
     * connection status. Default value is "//internethealthtest.org".
     */
    heartbeatUrl?: string;
    /**
     * Interval used to check Internet connectivity specified in milliseconds. Default value is "30000".
     */
    heartbeatInterval?: number;
    /**
     * Interval used to retry Internet connectivity checks when an error is detected (when no Internet connection). Default value is "1000".
     */
    heartbeatRetryInterval?: number;
    /**
     * HTTP method used for requesting heartbeat Url. Default is 'head'.
     */
    requestMethod?: 'get' | 'post' | 'head' | 'options';
}
/**
 * InjectionToken for specifing ConnectionService options.
 */
export declare const ConnectionServiceOptionsToken: InjectionToken<ConnectionServiceOptions>;
export declare class ConnectionService implements OnDestroy {
    private http;
    private static DEFAULT_OPTIONS;
    private stateChangeEventEmitter;
    private currentState;
    private offlineSubscription;
    private onlineSubscription;
    private httpSubscription;
    private serviceOptions;
    /**
     * Current ConnectionService options. Notice that changing values of the returned object has not effect on service execution.
     * You should use "updateOptions" function.
     */
    readonly options: ConnectionServiceOptions;
    constructor(http: HttpClient, options: ConnectionServiceOptions);
    private checkInternetState;
    private checkNetworkState;
    private emitEvent;
    ngOnDestroy(): void;
    /**
     * Monitor Network & Internet connection status by subscribing to this observer. If you set "reportCurrentState" to "false" then
     * function will not report current status of the connections when initially subscribed.
     * @param reportCurrentState Report current state when initial subscription. Default is "true"
     */
    monitor(reportCurrentState?: boolean): Observable<ConnectionState>;
    /**
     * Update options of the service. You could specify partial options object. Values that are not specified will use default / previous
     * option values.
     * @param options Partial option values.
     */
    updateOptions(options: Partial<ConnectionServiceOptions>): void;
}
