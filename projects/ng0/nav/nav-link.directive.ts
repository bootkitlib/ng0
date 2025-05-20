import { Directive, ElementRef, HostBinding, HostListener, Renderer2, input } from '@angular/core';
import { NavDirective } from './nav.directive';
import { NavItemDirective } from './nav-item.directive';

@Directive({
      selector: '[ng0NavLink]',
      exportAs: 'ng0NavLink',
      standalone: true,
})
export class NavLinkDirective {
      constructor(public elementRef: ElementRef, private _renderer: Renderer2, private _nav: NavDirective, private _navItem: NavItemDirective) {
      }

      @HostListener('click')
      private _onClick() {
            this._nav.activeItem.set(this._navItem.id);
      }

      @HostBinding('class.active') 
      private get _active() {
            return this._nav.activeItem() === this._navItem.id();
      }

      @HostBinding('class.disabled') 
      private get _disabled() {
            return this._nav.disabled() || this._navItem.disabled();
      }
}
