import { NgModule } from '@angular/core';
import { Layout1Component } from './layout1.component';
import { Layout1SidenavDirective } from './layout1-sidenav.directive';
import { Layout1HeaderComponent } from './layout1-header.component';
import { Layout1ContentComponent } from './public-api';

const items = [
    Layout1Component,
    Layout1SidenavDirective,
    Layout1HeaderComponent,
    Layout1ContentComponent
];

/**
 * Layout1Module
 */
@NgModule({
    imports: items,
    exports: items
})
export class Layout1Module { }
