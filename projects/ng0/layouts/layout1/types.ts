import { TemplateRef } from "@angular/core";

/**
 * Represents a secondary sidenav configuration in the Layout1Component.
 */
export interface Layout1SidenavConfiguration {
    template: TemplateRef<any>;
    size: number;
    zIndex: number;
    closeByBackdropClick: boolean
}