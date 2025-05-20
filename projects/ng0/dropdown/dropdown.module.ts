import { NgModule } from '@angular/core';
import { DropdownItemDirective } from './dropdown-item.directive';
import { DropdownMenuDirective } from './dropdown-menu.directive';
// import { DropdownToggleDirective } from './dropdown-toggle.directive';
// import { DropdownComponent } from './dropdown-button.component';
// import { OverlayModule } from '../overlay';
import { OverlayModule } from '@bootkit/ng0/overlay';


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
