import { NgModule } from '@angular/core';
import { DataTableColumnDirective } from './data-table-column.directive';
import { DataTableComponent } from './data-table.component';
import { DataTableDetailRowDirective } from './data-table-detail-row.directive';

@NgModule({
    imports: [
        DataTableComponent,
        DataTableColumnDirective,
        DataTableDetailRowDirective,
    ],
    exports: [
        DataTableComponent,
        DataTableColumnDirective,
        DataTableDetailRowDirective
    ],
})
export class DataTableModule { }
