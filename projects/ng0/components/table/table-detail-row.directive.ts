import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ng0-table-detail-row]',
  standalone: true,
})
export class TableDetailRowDirective {
  @Input() showCallback?: (row: any) => boolean;

  constructor(public readonly templateRef: TemplateRef<any>) {
  }
}
