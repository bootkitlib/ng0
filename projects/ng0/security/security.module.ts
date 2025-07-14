import { NgModule } from '@angular/core';
import { UserDirective } from './claim.directive';
import { GuestUserDirective } from './guest-user.directive';

const items = [
    UserDirective,
    GuestUserDirective
]

@NgModule({
    imports: items,
    exports: items
})
export class SecurityModule { }
