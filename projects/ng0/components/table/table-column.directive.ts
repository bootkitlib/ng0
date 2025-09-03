import { ContentChild, Directive, input, Input, model, TemplateRef } from '@angular/core';
import { TableCellType } from './types';

@Directive({
  selector: 'ng0-table-col',
  standalone: true,
})
export class TableColumnDirective {
  field = input<string>();
  title = input<string>();
  emptyCellText = input<string>();

  /**
   * Type of the table cell.
   */
  type = input<TableCellType>('text');
  cellClass = input<string | string[] | { [klass: string]: any; } | null>();

  /** Deprecated */
  bold = input(false);
  shrink = input(false);
  filterable = input(true);
  filterValue = model<any>();
  filterField = input<string>();
  @ContentChild(TemplateRef) template?: TemplateRef<any>;

  constructor() {
  }
}
