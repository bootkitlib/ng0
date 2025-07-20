import { NgModule } from '@angular/core';
import { TableColumnDirective } from './table-column.directive';
import { TableComponent } from './table.component';
import { TableDetailRowDirective } from './table-detail-row.directive';

@NgModule({
    imports: [
        TableComponent,
        TableColumnDirective,
        TableDetailRowDirective,
    ],
    exports: [
        TableComponent,
        TableColumnDirective,
        TableDetailRowDirective
    ],
})
export class TableModule { }
