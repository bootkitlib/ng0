import { Directive, ElementRef, Renderer2, input, model } from '@angular/core';

@Directive({
      selector: '[ng0Nav]',
      exportAs: 'ng0Nav',
      standalone: true,
})
export class NavDirective {
      activeItem = model<any>(0);
      disabled = input(false);

      constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {
      }
}
