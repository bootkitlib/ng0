import { ContentChild, Directive, input, Input, model, OnInit, signal, TemplateRef } from '@angular/core';
import { TableCellType } from './types';

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
  filterable = input(false);
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
      this.filterOperator.set(this.type() == 'text' ? 'contains' : 'eq');
    }
  }

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
}
