import { NgModule } from '@angular/core';
import { ClaimDirective } from './claim.directive';
import { GuestUserDirective } from './guest-user.directive';

const items = [
    ClaimDirective,
    GuestUserDirective
]

@NgModule({
    imports: items,
    exports: items
})
export class SecurityModule { }
