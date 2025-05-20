import { NgModule } from '@angular/core';
import { OverlayModule as CdkOverlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { OverlayDirective } from './overlay.directive';
import { CdkOverlayService } from './cdk-overlay.service';

@NgModule({
    declarations: [
        OverlayDirective,
    ],
    imports: [
        CommonModule,
        CdkOverlay
    ],
    exports: [
        OverlayDirective,
    ]
})
export class OverlayModule {
    constructor(cdkOverlayService: CdkOverlayService) {
        cdkOverlayService.injectCss();
    }
}
