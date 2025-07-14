import { Directive, input, TemplateRef } from '@angular/core';

@Directive({
      selector: '[ng0TabPane]',
      exportAs: 'ng0TabPane',
      standalone: true,
})
export class TabPaneDirective {
      id = input.required<any>({alias: 'ng0TabPane'});
      
      constructor(public templateRef: TemplateRef<any>) {
      }
}
