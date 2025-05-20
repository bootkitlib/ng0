import { NgModule } from '@angular/core';
import { OverlayDirective } from './overlay.directive';

const Items = [
    OverlayDirective,
]

/**
 * OverlayModule.
 */
@NgModule({
    imports: Items,
    exports: Items
})
export class OverlayModule { }
