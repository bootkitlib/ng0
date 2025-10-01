import { NgModule } from '@angular/core';
import { DropdownItemComponent } from './dropdown-item.component';
import { DropdownComponent } from './dropdown.component';
import { DropdownHeaderComponent } from './dropdown-header.component';
import { DropdownDividerComponent } from './dropdown-divider.component';
import { DropdownMenuComponent } from './dropdown-menu.component';
import { DropdownLinkComponent } from './dropdown-link.component';


const Items = [
    DropdownComponent,
    DropdownMenuComponent,
    DropdownItemComponent,
    DropdownLinkComponent,
    DropdownHeaderComponent,
    DropdownDividerComponent
]

@NgModule({
    imports: Items,
    exports: Items
})
export class DropdownModule { }
