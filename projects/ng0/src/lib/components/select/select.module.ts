import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../button/button.module';
import { SelectComponent } from './select.component';

@NgModule({
    declarations: [
        SelectComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        OverlayModule
    ],
    exports: [
        SelectComponent,
    ]
})
export class SelectModule { }
