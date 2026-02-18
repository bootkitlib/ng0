import { booleanAttribute, ContentChild, Directive, EnvironmentInjector, inject, input, model, OnInit, signal, TemplateRef } from '@angular/core';
import { TableColumnType } from './types';
import { defaultFormatter, objectFormatterAttribute } from '@bootkit/ng0/localization';

@Directive({
  selector: 'ng0-table-col',
  standalone: true,
})
export class TableColumnDirective implements OnInit {
  private readonly _injector = inject(EnvironmentInjector);
      
  /**
   * The field in the data source to bind to. If not set, the column will not display any data.
   * @deprecated Use formatBy input.
   */
  public readonly field = input<string>();

  /**
   * A fromatter to convert each item to a string for display.
   * This can be a function, a string (field name), or an array of formatters.
   * If not set, the default formatter will be used, which simply calls toString() on the value.
   */
  public readonly formatBy = input(defaultFormatter, {
    transform: objectFormatterAttribute(this._injector)
  });

  /**
   * The title of the column. This will be displayed in the header row.
   */
  public readonly title = input<string>();

  /**
   * Text to display in the cell if the value is null or undefined.
   */
  public readonly emptyCellText = input<string>();

  /**
   * Type of the table cell.
   */
  public readonly type = input<TableColumnType>('text');

  /**
   * CSS class(es) to apply to the table cell.
   */
  public readonly cellClass = input<string | string[] | { [klass: string]: any; } | null>();

  /** 
   * @deprecated Use `cellClass` instead.
   */
  public readonly bold = input(false, { transform: booleanAttribute });

  /** 
   * @deprecated Use `cellClass` instead.
   */
  public readonly shrink = input(false, { transform: booleanAttribute });

  /**
   * If true, the column will support filtering.
   */
  public readonly filterable = input(false, { transform: booleanAttribute });
  
  /**
   * The current filter value of the column.
   */
  public readonly filterValue = model<any>();

  /**
   * The current filter operator of the column.
   */
  public readonly filterOperator = model<string>();

  /**
   * The list of filter operators to show in the filter dropdown. If not set, a default list will be used based on the column type.
   */
  public readonly filterOperators = input<string[]>();

  /**
   * If true, the filter operators dropdown will be shown.
   */
  public readonly showFilterOperators = signal(false);

  /**
   * The name of the field in the data source. If not set, the `field` property will be used.
   */
  public readonly fieldName = input<string>();

  /**
   * If true, the column will support sorting.
   */
  public readonly sortable = input(false, { transform: booleanAttribute });

  /**
   * The current sort direction of the column.
   */
  public readonly sortDirection = model<'none' | 'asc' | 'desc'>('none');

  @ContentChild(TemplateRef) public readonly template?: TemplateRef<any>;

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
