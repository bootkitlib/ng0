import { Directive, ElementRef, HostBinding, HostListener, Renderer2, inject, input } from '@angular/core';
import { NavDirective } from './nav.directive';
import { NavItemDirective } from './nav-item.directive';

@Directive({
      selector: '[ng0NavLink]',
      exportAs: 'ng0NavLink',
      standalone: true,
})
export class NavLinkDirective {
      private _nav = inject(NavDirective);
      private _navItem = inject(NavItemDirective);
      public elementRef = inject(ElementRef);


      @HostListener('click')
      protected _onClick() {
            this._nav.activeItem.set(this._navItem.id());
      }

      @HostBinding('class.active') 
      protected get _active() {
            return this._nav.activeItem() === this._navItem.id();
      }

      @HostBinding('class.disabled') 
      protected get _disabled() {
            return this._nav.disabled() || this._navItem.disabled();
      }
}
