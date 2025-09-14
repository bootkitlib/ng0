import { Directive, TemplateRef } from '@angular/core';

/**
 * Directive representing an item within a select component.
 * 
 * @export
 * @class SelectOptionDirective
 */
@Directive({
    selector: '[ng0SelectOption]',
    exportAs: 'ng0SelectOption',
    standalone: true,
})
export class SelectOptionDirective {
    constructor(public readonly templateRef: TemplateRef<any>) { }
}
