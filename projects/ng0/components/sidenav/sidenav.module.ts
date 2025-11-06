import { NgModule } from '@angular/core';
import { SidenavContainerComponent } from './sidenav-container.component';
import { SidenavComponent } from './sidenav.component';
import { SidenavContentComponent } from './sidenav-content.component';

/**
 * Sidenav module
 */
@NgModule({
  imports: [
    SidenavContainerComponent,
    SidenavComponent,
    SidenavContentComponent
  ],
  exports: [
    SidenavContainerComponent,
    SidenavComponent,
    SidenavContentComponent
  ]
})
export class SidenavModule { }
