import { Component, input } from '@angular/core';

@Component({
  selector: 'ng0-vertical-menu-group, ng0-vmenu-group',
  template: `
    <span class="ng0-vmenu-group-label">{{ label() }}</span>
    <ng-content></ng-content>
  `,
  standalone: true,
  styles: `:host {display: block; }`
})
export class VerticalMenuGroupComponent {
  public label = input<string>();
}
