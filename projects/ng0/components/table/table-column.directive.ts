import { ContentChild, Directive, input, Input, model, OnInit, signal, TemplateRef } from '@angular/core';
import { TableCellType } from './types';
import { FilterOperators } from '@bootkit/ng0/data';

@Directive({
  selector: 'ng0-table-col',
  standalone: true,
})
export class TableColumnDirective implements OnInit {
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
  filterOperator = model<string>();
  filterOperators = input<string[]>();
  showFilterOperators = signal<boolean>(false);

  @ContentChild(TemplateRef) template?: TemplateRef<any>;

  constructor() {
  }

  ngOnInit(): void {
    if (this.filterOperator() == undefined) {
      this.filterOperator.set(this.type() == 'text' ? FilterOperators.Contains : FilterOperators.Equals);
    }
  }

  public getFilterOperators() {
    if (this.filterOperators())
      return this.filterOperators();

    let type = this.type();
    if (type == 'number' || type == 'currency' || type == 'date' || type == 'time') {
      return [
        FilterOperators.Equals,
        FilterOperators.GreaterThan,
        FilterOperators.GreaterThanOrEqual,
        FilterOperators.LessThan,
        FilterOperators.LessThanOrEqual,
        FilterOperators.NotEquals,
      ]
    } else if (type == 'text') {
      return [
        FilterOperators.Contains,
        FilterOperators.EndsWith,
        FilterOperators.Equals,
        FilterOperators.NotEquals,
        FilterOperators.StartsWith,
      ]
    } else {
      return []
    }
  }
}
