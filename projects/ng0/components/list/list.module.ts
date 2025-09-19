import { NgModule } from '@angular/core';
import { ListComponent } from './list.component';

const Items = [ListComponent]

/**
 * List module.
 */
@NgModule({
    imports: Items,
    exports: Items
})
export class ListModule { }
