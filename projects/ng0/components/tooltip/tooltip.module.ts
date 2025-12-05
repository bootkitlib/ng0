import { NgModule } from '@angular/core';
import { TooltipDirective } from './tooltip.directive';

const Items = [
    TooltipDirective
];

/**
 * Tooltip module.
 */
@NgModule({
    imports: Items,
    exports: Items
})
export class TooltipModule { }
