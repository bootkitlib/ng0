import { Directive, input, model } from '@angular/core';

@Directive({
      selector: '[ng0Nav]',
      exportAs: 'ng0Nav',
      standalone: true,
})
export class NavDirective {
      /**
       * The active item.
       */
      public readonly activeItem = model<any>(0);

      /**
       * Whether the navigation is disabled.
       */
      public readonly disabled = input(false);
}
