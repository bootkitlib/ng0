import { Component, inject, ViewEncapsulation } from '@angular/core';
import { SidenavModule } from '@bootkit/ng0/components/sidenav';
import { CommonModule } from '@angular/common';
import { Layout1Manager } from './layout1-manager';

/**
 * Layout1Component
 */
@Component({
  selector: 'ng0-layout1',
  templateUrl: './layout1.component.html',
  styleUrls: ['./layout1.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, SidenavModule]
})
export class Layout1Component {
  public readonly config = inject(Layout1Manager);
}
