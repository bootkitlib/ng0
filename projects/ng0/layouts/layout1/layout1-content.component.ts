import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/**
 * Layout1 content component.
 */
@Component({
  selector: 'ng0-layout1-content',
  template: `<ng-content></ng-content>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class Layout1ContentComponent {
}
