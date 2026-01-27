import { Component } from '@angular/core';

@Component({
  selector: 'ng0-vmenu-header',
  standalone: true,
  template: `<ng-content></ng-content>`,
  styles: `:host {display: block; }`
})
export class VerticalMenuHeaderComponent {
}
