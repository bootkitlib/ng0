import { booleanAttribute, ContentChild, Directive, input, model, OnInit, signal, TemplateRef } from '@angular/core';
import { TableCellType } from './types';

@Directive({
  selector: 'ng0-table-col',
  standalone: true,
})
export class TableColumnDirective implements OnInit {
  /**
   * The field in the data source to bind to. If not set, the column will not display any data.
   */
  field = input<string>();

  /**
   * The title of the column. This will be displayed in the header row.
   */
  title = input<string>();

  /**
   * Text to display in the cell if the value is null or undefined.
   */
  emptyCellText = input<string>();

  /**
   * Type of the table cell.
   */
  type = input<TableCellType>('text');

  /**
   * CSS class(es) to apply to the table cell.
   */
  cellClass = input<string | string[] | { [klass: string]: any; } | null>();

  /** 
   * @deprecated Use `cellClass` instead.
   */
  bold = input(false, { transform: booleanAttribute });

  /** 
   * @deprecated Use `cellClass` instead.
   */
  shrink = input(false, { transform: booleanAttribute });

  /**
   * If true, the column will support filtering.
   */
  filterable = input(false, { transform: booleanAttribute });

  /**
   * The current filter value of the column.
   */
  filterValue = model<any>();

  /**
   * The field to use for filtering. If not set, the `field` property will be used.
   * @deprecated Use `fieldName` instead.
   */
  filterField = input<string>();

  /**
   * The current filter operator of the column.
   */
  filterOperator = model<string>();

  /**
   * The list of filter operators to show in the filter dropdown. If not set, a default list will be used based on the column type.
   */
  filterOperators = input<string[]>();

  /**
   * If true, the filter operators dropdown will be shown.
   */
  showFilterOperators = signal(false);

  /**
   * The name of the field in the data source. If not set, the `field` property will be used.
   */
  fieldName = input<string>();

  /**
   * If true, the column will support sorting.
   */
  public sortable = input(false, { transform: booleanAttribute });

  /**
   * The current sort direction of the column.
   */
  public sortDirection = model<'none' | 'asc' | 'desc'>('none');

  @ContentChild(TemplateRef) template?: TemplateRef<any>;

  constructor() {
  }

  ngOnInit(): void {
    if (this.filterOperator() == undefined) {
      this.filterOperator.set(this.type() == 'text' ? 'contains' : 'eq');
    }
  }

  /**
   * Get the list of filter operators to show in the filter dropdown.
   */
  public getFilterOperators(): string[] {
    let op = this.filterOperators();
    if (op && op.length > 0)
      return op;

    let type = this.type();
    if (type == 'number' || type == 'currency' || type == 'date' || type == 'time') {
      return ['eq', 'ne', 'gt', 'gte', 'lt', 'lte',]
    } else if (type == 'text') {
      return ['contains', 'startsWith', 'endsWith', 'eq', 'ne']
    } else {
      return []
    }
  }

  /**
   * Toggle the sort direction of the column.
   * @returns void
   */
  public toggleSortDirection(): void {
    if (!this.sortable()) {
      return;
    }

    let dir = this.sortDirection();
    if (dir === 'none') {
      this.sortDirection.set('asc');
    } else if (dir === 'asc') {
      this.sortDirection.set('desc');
    } else {
      this.sortDirection.set('none');
    }
  }
}
