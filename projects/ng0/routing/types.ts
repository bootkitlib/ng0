import { ActivatedRouteSnapshot, Route as NgRoute, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ClaimLike } from '@bootkit/ng0/common';

/**
 * A function that resolves a title from the route and router state
 */
export type RouteTitleResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => string;

/**
 * A router link value.
 */
export type RouterLinkValue = any[] | string | UrlTree | null | undefined;

/**
 * A function that resolves a router link.
 * @param route The activated route snapshot
 * @param state The router state snapshot
 * @returns The resolved link (RouteDataLink)
 */
export type RouterLinkValueResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => RouterLinkValue;

/**
 * A function that resolves a meta description.
 * @param route The activated route snapshot
 * @param state The router state snapshot
 * @returns The resolved meta description string
 */
export type RouteMetaDescriptionResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => string;

/**
 * A function that resolves meta tags from the route and router state
 */
export type RouteMetaTagResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {[metaTagName: string]: string};

/**
 * Route data
 */
export interface RouteData {
    /**
     * The title of the route, or a function that resolves the title.
     */
    title?: string | RouteTitleResolver;

    /**
     * A Router link defined for the route.
     */
    routerLink?: RouterLinkValue | RouterLinkValueResolver;

    /**
     * linkTarget
     */
    linkTarget?: '_self' | '_blank' | '_parent' | '_top';

    /**
     * meta 
     */
    meta?: string | RouteMetaTagResolver | RouteMetaDescriptionResolver;

    /**
     * Route security claim.
     */
    claim?: ClaimLike;

    /**
     * Route childreen.
     */
    children?: RouteData[];

    [key: string]: any;
}

/**
 * Router Activated Route Snapshot.
 * Represents the state of an activated route in the router.
 */
export interface RouterActivatedRouteSnapshot {
    /**
     * The original ActivatedRouteSnapshot
     */
    route: ActivatedRouteSnapshot;

    /**
     * Resolved title, if any
     */
    title?: string;

    /**
     * Resolved link, if any
     */
    routerLink: RouterLinkValue;

    /**
     * Children routes
     */
    children: RouterActivatedRouteSnapshot[];
}

/**
 * Extended Angular Route interface with additional data property.
 */
export interface Route extends NgRoute {
    children?: Routes;
    data?: RouteData;
}

export type Routes = Route[];