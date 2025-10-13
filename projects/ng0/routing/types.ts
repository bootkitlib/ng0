import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ClaimLike } from '@bootkit/ng0/common';

/**
 * A function that resolves a title from the route and router state
 */
export type TitleResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => string;
export type RouterLinkValue = any[] | string | UrlTree | null | undefined;
export type RouterLinkResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => RouterLinkValue;

/**
 * A function that resolves a meta description from the route and router state
 */
export type MetaDescriptionResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => string;

/**
 * A function that resolves meta tags from the route and router state
 */
export type MetaTagResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {[metaTagName: string]: string};

/**
 * Route data
 */
export interface RouteData {
    title?: string | TitleResolver;
    routerLink: RouterLinkValue | RouterLinkResolver;
    routerLinkTarget?: '_self' | '_blank' | '_parent' | '_top';
    meta?: string | MetaTagResolver | MetaDescriptionResolver;
    claim?: ClaimLike;
    children: RouteData[];
}

/** 
 * Router Route Snapshot
 */
export interface RouteSnapshot {
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
    link: RouterLinkValue;

    /**
     * Children routes
     */
    children: RouteSnapshot[];
}
