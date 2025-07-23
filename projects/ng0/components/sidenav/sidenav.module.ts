import { NgModule } from '@angular/core';
import { SidenavContainerComponent } from './sidenav-container.component';
import { SidenavComponent } from './sidenav.component';

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
