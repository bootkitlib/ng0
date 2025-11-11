import { booleanAttribute, Directive, EventEmitter, inject, input, numberAttribute, Output, TemplateRef } from '@angular/core';
import { SidenavMode, SidenavPosition, SidenavSize } from '@bootkit/ng0/components/sidenav';
import { CssClass } from '@bootkit/ng0/common';

/** 
 * Directive to define a sidenav within Layout1Component.
 */
@Directive({
    selector: '[ng0Layout1Sidenav]',
    exportAs: 'ng0Layout1Sidenav',
    standalone: true,
})
export class Layout1SidenavDirective {
    public readonly template = inject(TemplateRef<any>);
    public readonly open = input(true, { transform: booleanAttribute });
    public readonly mode = input<SidenavMode>('push');
    public readonly hasBackdrop = input(true, { transform: booleanAttribute });
    public readonly zIndex = input<number | undefined>(undefined);
    public readonly position = input<SidenavPosition>('start');
    public readonly size = input<SidenavSize>();
    public readonly css = input<CssClass>();
    @Output() public backdropClick = new EventEmitter<PointerEvent>();
}
