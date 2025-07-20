import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';

export type DataTableColumnBadgeValueType = string | number | boolean;

@Directive({
  selector: 'ng0-table-col',
  standalone: true,
})
export class TableColumnDirective {
  @Input() field?: string;
  @Input() title?: string;
  @Input() emptyCellText?: string;

  /** Column type */
  @Input() type: 'text' | 'number' | 'currency' | 'date' | 'time' | {
    enum?: string,
    boolean?: {falseKey?: string, trueKey?: string},
    currency?: string,
  } = 'text';
  @ContentChild(TemplateRef) template?: TemplateRef<any>;
  @Input() cellClass?: string | string[] | { [klass: string]: any; } | null | undefined;
  @Input() shrink = false;
  @Input() bold = false;
  @Input() badge?: { primary?: DataTableColumnBadgeValueType, secondary?: DataTableColumnBadgeValueType, success?: DataTableColumnBadgeValueType };
  @Input() filterable = false;
  @Input() filterValue?: string;
  @Input() filterField?: string;

  constructor() {
  }
}
