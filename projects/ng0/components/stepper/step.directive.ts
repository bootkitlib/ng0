import { Directive, input, TemplateRef } from '@angular/core';

@Directive({
      selector: '[ng0Step]',
      exportAs: 'ng0Step',
      standalone: true
})
export class StepDirective {
      public id = input.required<any>({alias: 'iscStep'});

      constructor(public readonly templateRef: TemplateRef<any>) {
      }
}
