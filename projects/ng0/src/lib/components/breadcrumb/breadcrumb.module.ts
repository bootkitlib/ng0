import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb.component';
import { BreadcrumbItemTemplateDirective } from './breadcrumb-item-template.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    BreadcrumbComponent,
    BreadcrumbItemTemplateDirective
  ],
  exports: [
    BreadcrumbComponent,
    BreadcrumbItemTemplateDirective
  ]
})
/**
 * @module
 */
export class BreadcrumbModule {
}
