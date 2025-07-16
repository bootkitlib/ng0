import { NgModule } from '@angular/core';
import { ConfirmationComponent } from './confirmation.component';
import { ConfirmationDirective } from './confirmation.directive';

@NgModule({
    imports: [
        ConfirmationComponent,
        ConfirmationDirective
    ],
    exports: [
        ConfirmationComponent,
        ConfirmationDirective
    ]
})
export class ConfirmationModule {
}
