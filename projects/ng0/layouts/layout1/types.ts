import { signal, TemplateRef, WritableSignal } from "@angular/core";
import { CssClass } from "@bootkit/ng0/common";
import { SidenavMode, SidenavPosition, SidenavSize } from "@bootkit/ng0/components/sidenav";

/**
 * Represents a secondary sidenav options in the Layout1Component.
 */
export interface Layout1SecondarySidenavOptions {
    size?: SidenavSize;
    zIndex?: number;
    position?: SidenavPosition;
    mode?: SidenavMode;
    fixedInViewport?: boolean;
    hasBackdrop?: boolean;
    css?: CssClass;
    closeOnBackdropClick?: boolean
}

export class Layout1SecondarySidenav {
    template: TemplateRef<any>;
    zIndex: WritableSignal<number | undefined>;
    css: WritableSignal<CssClass>;
    size: WritableSignal<SidenavSize>;
    position: WritableSignal<SidenavPosition>;
    mode: WritableSignal<SidenavMode>;
    hasBackdrop: WritableSignal<boolean>;
    closeOnBackdropClick: WritableSignal<boolean>;

    constructor(template: TemplateRef<any>, options?: Layout1SecondarySidenavOptions) {
        this.template = template;
        this.zIndex = signal(options?.zIndex);
        this.css = signal(options?.css);
        this.size = signal(options?.size);
        this.position = signal(options?.position ?? 'start');
        this.mode = signal(options?.mode ?? 'over');
        this.hasBackdrop = signal(options?.hasBackdrop ?? true);
        this.closeOnBackdropClick = signal(options?.closeOnBackdropClick ?? false);
    }
}
