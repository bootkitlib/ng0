import { NgModule } from '@angular/core';
import { OffcanvasDirective } from './offcanvas.directive';

const items = [
    OffcanvasDirective,
];

@NgModule({
    imports: items,
    exports: items
})
export class OffcanvasModule {
}
