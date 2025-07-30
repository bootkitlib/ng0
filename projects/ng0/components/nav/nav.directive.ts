import { Directive, ElementRef, Renderer2, input, model } from '@angular/core';

@Directive({
      selector: '[ng0Nav]',
      exportAs: 'ng0Nav',
      standalone: true,
})
export class NavDirective {
      /**
       * The active item.
       */
      activeItem = model<any>(0);

      /**
       * Whether the navigation is disabled.
       */
      disabled = input(false);

      constructor() {
      }
}
