import { Directive, Input, TemplateRef } from '@angular/core';


@Directive({
  selector: '[ng0-data-table-detail-row]',
  standalone: true,
})
export class DataTableDetailRowDirective {
  @Input() showCallback?: (row: any) => boolean;

  constructor(public readonly templateRef: TemplateRef<any>) {
  }
}
