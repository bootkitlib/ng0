import { Injectable, signal } from '@angular/core';
import { User } from './user';
import { ShowCondition } from '@bootkit/ng0/common';

@Injectable({ providedIn: 'root' })
export class UserStore<U extends User = User> {
    public readonly user = signal<U | null | undefined>(undefined);

    checkShowCondition(condition: ShowCondition): boolean {
        let user = this.user();

        if (user) {
            if (condition == 'set') {
                return true;
            }

            return user.hasClaim(condition);
        } else {
            return condition == 'unset';
        }
    }
}