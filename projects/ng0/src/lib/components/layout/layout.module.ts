import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { PanelComponent } from './panel.component';
import { PanelBackdropComponent } from './panel-backdrop.component';
import { BidiModule } from '@angular/cdk/bidi';

@NgModule({
  declarations: [
    PanelComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    BidiModule
  ],
  exports: [
    PanelComponent,
    LayoutComponent,
  ],
  entryComponents: [
    PanelBackdropComponent
  ]
})
export class LayoutModule { }
