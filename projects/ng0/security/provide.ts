// import { inject } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
// import { UserStore } from './user-store';
// import { RouteData } from '@bootkit/angular-pro/router';
// import { User } from './user';

// export function provideSecurity(): EnvironmentProviders {
//   return makeEnvironmentProviders([
//     {
//       provide: 'ROUTE_SNIFFER_INIT',
//       useFactory: () => {
//         const router = inject(Router);

//         // Listen to all navigation events
//         router.events.subscribe(event => {
//           if (event instanceof NavigationEnd) {
//             console.log('🚀 Route changed:', event.url);
//             // Perform any global action here
//           }
//         });

//         return true; // Just to satisfy DI
//       }
//     }
//   ]);
// }