import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RouterService } from '@bootkit/ng0/routing';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private routerService = inject(RouterService);

  protected _routes = toSignal(this.routerService.activetedRoutes());

  constructor() {
  }
}
