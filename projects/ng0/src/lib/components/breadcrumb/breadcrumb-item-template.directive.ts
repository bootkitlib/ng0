import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[jssBreadcrumbItemTemplate]',
    exportAs: 'jssBreadcrumbItemTemplate',
})
export class BreadcrumbItemTemplateDirective {
    constructor(public templateRef: TemplateRef<BreadcrumbItemTemplateDirective>) {
    }
}
