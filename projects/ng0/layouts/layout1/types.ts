import { TemplateRef } from "@angular/core";
import { SidenavPosition } from "@bootkit/ng0/components/sidenav";

/**
 * Represents a secondary sidenav configuration in the Layout1Component.
 */
export interface Layout1SidenavConfiguration {
    template: TemplateRef<any>;
    size: number | string | undefined;
    position: SidenavPosition;
    zIndex: number;
    closeByBackdropClick: boolean
}