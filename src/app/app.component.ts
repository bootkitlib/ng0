import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule, RouterOutlet } from '@angular/router';
import { RouterService } from '@bootkit/ng0/routing';
import { Layout1Manager, Layout1Module, Layout1SidenavDirective } from '@bootkit/ng0/layouts/layout1';
import { AppHeaderComponent } from './common/layout/header/header.component';
import { SidenavModule } from '@bootkit/ng0/components/sidenav';
import { AppSidenavComponent } from './common/layout/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    Layout1Module,
    SidenavModule,
    AppHeaderComponent,
    AppSidenavComponent,
    Layout1SidenavDirective
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public readonly manager = inject(Layout1Manager);
  
  constructor() {
  }
}
