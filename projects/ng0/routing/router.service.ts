import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable } from 'rxjs';
import { RouteData, RouterLinkResolver, RouteSnapshot, TitleResolver } from './types';

@Injectable({ providedIn: 'root' })
export class RouterService {
  private readonly _router = inject(Router);

  /**
   * Get activated route tree
   * @param outlets List of outlets to include, default is ['primary']
   * @returns Observable of the activated route tree
   */
  public activetedRouteTree(outlets: string[] = ['primary']): Observable<RouteSnapshot> {
    return this._router.events.pipe(
      filter(x => x instanceof NavigationEnd),
      map(e => {
        let { root } = this._router.routerState.snapshot;
        return this._mapRoute(root, outlets);
      })
    );
  }

  /**
   * Get activated routes as a flat array from root to the deepest child
   * @param outlet The outlet to include, default is 'primary'
   * @returns Observable of the activated routes array
   */
  public activetedRoutes(outlet = 'primary', filterComponentlessRoutes = true): Observable<RouteSnapshot[]> {
    return this.activetedRouteTree([outlet]).pipe(
      map(root => {
        let result: RouteSnapshot[] = [];

        do {
          result.push(root);
          root = root?.children[0];
        } while (root !== undefined);

        // if (filterComponentlessRoutes) {
        //   result = result.filter(x => x.route.routeConfig?.component !== undefined);
        // }

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
  private _mapRoute(route: ActivatedRouteSnapshot, outlets: string[]): RouteSnapshot {
    let data = route.routeConfig?.data as RouteData;
    let title = route.routeConfig?.title || data?.title;
    if (typeof title === 'function') {
      title = (title as TitleResolver)(route, this._router.routerState.snapshot);
    }

    let link = data?.routerLink;
    if (typeof link === 'function') {
      link = (link as RouterLinkResolver)(route, this._router.routerState.snapshot);
    }

    return {
      route: route,
      title,
      link,
      children: route.children
        .filter(x => outlets.includes(x.outlet))
        .map(x => this._mapRoute(x, outlets))
    } as RouteSnapshot;
  }
}
