import { ContentChild, Directive, input, Input, TemplateRef } from '@angular/core';
import { TableCellType } from './types';

export type DataTableColumnBadgeValueType = string | number | boolean;

@Directive({
  selector: 'ng0-table-col',
  standalone: true,
})
export class TableColumnDirective {
  @Input() field?: string;
  @Input() title?: string;
  emptyCellText = input<string>();

  /**
   * Type of the table cell.
   */
  type = input<TableCellType>();
  @ContentChild(TemplateRef) template?: TemplateRef<any>;
  @Input() cellClass?: string | string[] | { [klass: string]: any; } | null | undefined;
  @Input() shrink = false;
  @Input() bold = false;
  @Input() filterable = false;
  @Input() filterValue?: string;
  @Input() filterField?: string;

  constructor() {
  }
}
