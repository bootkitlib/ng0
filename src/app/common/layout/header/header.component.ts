import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { RouterService } from 'dist/ng0/routing';

@Component({
  selector: 'app-layout-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule
  ]
})
export class HeaderComponent {
  private routerService = inject(RouterService);
  protected _routes = toSignal(this.routerService.getActivatedRoutes());

}
