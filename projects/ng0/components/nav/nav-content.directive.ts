import { Directive, input, TemplateRef } from '@angular/core';

@Directive({
      selector: '[ng0NavContent]',
      exportAs: 'ng0NavContent',
      standalone: true,
})
export class NavContentDirective {
      id = input.required<any>({alias: 'ng0NavContent'});
      
      constructor(public templateRef: TemplateRef<any>) {
      }
}
