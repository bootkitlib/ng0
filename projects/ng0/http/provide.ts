import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders, Provider } from "@angular/core";
import { HttpDataRequestResolver } from "./types";
import { HttpService } from "./http.service";

export const HTTP_SERVICE_CONFIG = new InjectionToken<HttpServiceConfig>('HttpServiceConfig');
export const DEFAULT_DATA_REQUEST_RESOLVER = new InjectionToken<HttpDataRequestResolver>('DefaultDataRequestResolver');

/**
 * Configuration for the HttpService.
 */
export interface HttpServiceConfig {
    /**
     * Base URL for the HTTP requests.
     * This is prepended to all request URLs.
     */
    baseUrl?: string;

    /**
     * A Resolver function to convert DataRequest to DataResult.
     */
    dataRequestResolver?: HttpDataRequestResolver;
}

export interface HttpServiceFeature { 
     ɵproviders: Array<Provider | EnvironmentProviders>;
}

/**
 * Provides the configuration for the HttpService.
 * @param config 
 * @returns 
 */
export function provideHttpService(config?: HttpServiceConfig, ...features: Partial<HttpServiceFeature>[]) {
    // const mergedfeatures = Object.assign({}, ...features);
    return makeEnvironmentProviders([
        HttpService,
        { provide: HTTP_SERVICE_CONFIG, useValue: config || {} },
        features.map((feature) => feature.ɵproviders),
    ]);
}
