import { NgModule } from '@angular/core';
import { SidenavContainerComponent } from './sidenav-container.component';
import { SidenavComponent } from './sidenav.component';

/**
 * This module is used to contain the sidenav components and provide their functionality.
 */
@NgModule({
  imports: [
    SidenavContainerComponent,
    SidenavComponent
  ],
  exports: [
    SidenavContainerComponent,
    SidenavComponent
  ]
})
export class SidenavModule { }
