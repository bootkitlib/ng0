import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ng0VerticalMenuItemTemplate]',
  exportAs: 'ng0VerticalMenuItemTemplate',
  standalone: true
})
export class VerticalMenuItemTemplateDirective {
  public readonly templateRef = inject(TemplateRef);
}
