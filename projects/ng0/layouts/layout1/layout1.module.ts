import { NgModule } from '@angular/core';
import { Layout1Component } from './layout1.component';
import { Layout1SidenavDirective } from './layout1-sidenav.directive';

/**
 * Layout1Module
 */
@NgModule({
    imports: [
        Layout1Component,
        Layout1SidenavDirective
    ],
    exports: [
        Layout1Component,
        Layout1SidenavDirective
    ]
})
export class Layout1Module { }
