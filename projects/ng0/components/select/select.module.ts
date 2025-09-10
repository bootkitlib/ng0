import { NgModule } from '@angular/core';
import { SelectComponent } from './select.component';

const Items = [
    SelectComponent,
]

@NgModule({
    imports: Items,
    exports: Items
})
export class SelectModule { }
