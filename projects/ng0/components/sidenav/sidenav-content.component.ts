import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/**
 * Sidenav content component
 */
@Component({
  selector: 'ng0-sidenav-content',
  template: `<ng-content></ng-content>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SidenavContentComponent {
}
