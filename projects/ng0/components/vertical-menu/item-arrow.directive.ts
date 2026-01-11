import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
    selector: '[ng0VerticalMenuArrow], [ng0VmenuArrow]',
    exportAs: 'ng0VerticalMenuArrow',
    standalone: true,
})
export class VerticalMenuArrowDirective {
    public readonly templateRef = inject(TemplateRef);
}
