import { NgModule } from '@angular/core';
import { SelectComponent } from './select.component';
import { SelectOptionDirective } from './select-option.directive';

const Items = [
    SelectComponent,
    SelectOptionDirective
]

@NgModule({
    imports: Items,
    exports: Items
})
export class SelectModule { }
