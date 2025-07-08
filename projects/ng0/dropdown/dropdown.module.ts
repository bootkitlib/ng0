import { NgModule } from '@angular/core';
import { DropdownItemDirective } from './dropdown-item.directive';
import { DropdownMenuDirective } from './dropdown-menu.directive';
import { OverlayModule } from '@angular/cdk/overlay';
// import { DropdownToggleDirective } from './dropdown-toggle.directive';
// import { DropdownComponent } from './dropdown-button.component';
// import { OverlayModule } from '../overlay';


const Items = [
    DropdownItemDirective,
    DropdownMenuDirective,

    // DropdownComponent,
    // DropdownToggleDirective,
]

@NgModule({
    imports: Items,
    exports: [
        ...Items,
        OverlayModule
    ]
})
export class DropdownModule { }
