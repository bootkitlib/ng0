import { Directive, Optional, TemplateRef } from '@angular/core';

/**
 * Directive to be used as a dropdown item.
 * 
 * @export
 * @class DropdownItemDirective
 */
@Directive({
    selector: '[ng0DropdownItem]',
    exportAs: 'ng0DropdownItem',
    standalone: true,
})
export class DropdownItemDirective {
    /**
     * Creates an instance of DropdownItemDirective.
     * 
     * @param {TemplateRef<any>} [templateRef] - Optional template reference.
     * @memberof DropdownItemDirective
     */
    constructor(@Optional() public readonly templateRef?: TemplateRef<any>) {}
}
