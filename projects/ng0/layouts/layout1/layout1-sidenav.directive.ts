import { Directive, EventEmitter, inject, input, Output, TemplateRef } from '@angular/core';
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
    public readonly open = input(true);
    public readonly mode = input<SidenavMode>('push');
    public readonly hasBackdrop = input(true);
    public readonly zIndex = input<number | undefined>(undefined);
    public readonly position = input<SidenavPosition>('start');
    public readonly size = input<SidenavSize>();
    public readonly css = input<CssClass>();
    @Output() public backdropClick = new EventEmitter<PointerEvent>();
}
