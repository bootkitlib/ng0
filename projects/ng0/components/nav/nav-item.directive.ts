import { Directive, ElementRef, Renderer2, input } from '@angular/core';
import { NavDirective } from './nav.directive';

@Directive({
      selector: '[ng0NavItem]',
      exportAs: 'ng0NavItem',
      standalone: true,
})
export class NavItemDirective {
      id = input.required<any>({alias: 'ng0NavItem'});
      disabled = input(false);

      constructor(public elementRef: ElementRef, private _renderer: Renderer2, private _nav: NavDirective) {
      }
}
