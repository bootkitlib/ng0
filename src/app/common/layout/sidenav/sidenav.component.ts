import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VerticalMenuModule } from '@bootkit/ng0/components/vertical-menu';
import { menuItems } from './menu-items';

@Component({
  selector: 'app-layout-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    VerticalMenuModule
  ]
})
export class AppSidenavComponent {
  menuItems = menuItems;
}
