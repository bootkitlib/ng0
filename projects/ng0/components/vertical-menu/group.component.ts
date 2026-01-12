import { Component, input } from '@angular/core';

@Component({
  selector: 'ng0-vmenu-group',
  template: `
    <span class="ng0-vmenu-group-text">{{ text() }}</span>
    <div class="ng0-vmenu-group-content">
      <ng-content></ng-content>
    </div>
  `,
  standalone: true,
  styles: `:host {display: block; }`
})
export class VerticalMenuGroupComponent {
  public text = input<string>();
}
