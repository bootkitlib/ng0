import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MenuItem } from '@bootkit/ng0/common';
import { VerticalMenuModule } from '@bootkit/ng0/components/vertical-menu';
import { menuItems1, menuItems2 } from './menu-items';
import { User, UserStore } from '@bootkit/ng0/security';
import { ButtonDirective } from '@bootkit/ng0/components/button';

@Component({
    selector: 'app-examples-vertical-menu',
    templateUrl: './vertical-menu-example.component.html',
    standalone: true,
    imports: [
    CommonModule,
    VerticalMenuModule,
    ButtonDirective
]
})
export class VerticalMenuExampleComponent {
    _userStore = inject<UserStore<User>>(UserStore);

    _menuItems1 = menuItems1;
    _menuItems2 = menuItems2;
    _user?: User;

    protected _onActiveChange(item: MenuItem, isActive: boolean) {
        // item.active = isActive;
        // if (item.parent)
        //     item.parent.active = isActive;
    }

    _onItemClick() {
        alert('Thank you!');
    }

    addBartenderClaim() {
        this._userStore.user()?.addClaim('bartender');
    }

    addSalespersonClaim() {
        this._userStore.user()?.addClaim('salesperson');
    }

    _clearUser() {
        this._user = undefined;
        this._userStore.user.set(undefined);
    }

    _setUser() {
        this._user = new User([]);
        this._userStore.user.set(this._user);
    }
}
