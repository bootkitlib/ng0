import { Directive, input, TemplateRef } from '@angular/core';

@Directive({
      selector: '[ng0Step]',
      exportAs: 'ng0Step',
      standalone: true
})
export class StepDirective {
      public readonly id = input.required<any>({alias: 'ng0Step'});

      constructor(public readonly templateRef: TemplateRef<any>) {
      }
}
