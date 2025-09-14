import { Directive, TemplateRef } from '@angular/core';

/**
 * Directive representing an item within a select component.
 * 
 * @export
 * @class SelectOptionDirective
 */
@Directive({
    selector: '[ng0SelectLabel]',
    exportAs: 'ng0SelectLabel',
    standalone: true,
})
export class SelectLabelDirective {
    constructor(public readonly templateRef: TemplateRef<any>) { }
}
