import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { RouteData, RouterLinkValueResolver, RouterActivatedRouteSnapshot, RouteTitleResolver } from './types';

/**
 * Service to interact with Angular Router.
 */
@Injectable({ providedIn: 'root' })
export class RouterService {
  private readonly _router = inject(Router);

  /**
   * Get activated route tree.
   * @param outlets List of outlets to include, default is ['primary']
   * @returns Observable of the activated route tree
   */
  public getActivatedRouteTree(outlets: string[] = ['primary']): Observable<RouterActivatedRouteSnapshot> {
    return this._router.events.pipe(
      filter(x => x instanceof NavigationEnd),
      map(e => {
        let { root } = this._router.routerState.snapshot;
        return this._mapRoute(root, outlets);
      })
    );
  }

  /**
   * Get activated routes as a flat array from root to the deepest child for a specific outlet.
   * @param outlet The outlet to include, default is 'primary'
   * @returns Observable of the activated routes array
   */
  public getActivatedRoutes(outlet = 'primary'): Observable<RouterActivatedRouteSnapshot[]> {
    return this.getActivatedRouteTree([outlet]).pipe(
      map(root => {
        let result: RouterActivatedRouteSnapshot[] = [];
        
        do {
          result.push(root);
          root = root?.children[0];
        } while (root !== undefined);

        return result;
      })
    );
  }

  /**
   * Map a route to RouterRouteSnapshot
   * @param route The route to map
   * @param outlets The outlets to include
   * @returns The mapped RouterRouteSnapshot
   */
  private _mapRoute(route: ActivatedRouteSnapshot, outlets: string[]): RouterActivatedRouteSnapshot {
    let configData = route.routeConfig?.data as RouteData | undefined;
    let title: string | undefined;
    
    if(route.title && route.routeConfig?.title)
      // Route is resolved by Angular.
      title = route.title;
    else if (configData?.title) {
      title = typeof configData.title === 'function' ?
       (configData.title as RouteTitleResolver)(route, this._router.routerState.snapshot) :
       configData.title;
    }

    let link = configData?.routerLink;
    if (typeof link === 'function') {
      link = (link as RouterLinkValueResolver)(route, this._router.routerState.snapshot);
    }

    return {
      route: route,
      title,
      routerLink: link,
      children: route.children
        .filter(x => outlets.includes(x.outlet))
        .map(x => this._mapRoute(x, outlets))
    } as RouterActivatedRouteSnapshot;
  }
}
