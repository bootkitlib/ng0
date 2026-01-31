import { Injectable, signal } from '@angular/core';
import { User } from './user';
import { UserCondition } from '@bootkit/ng0/common';

/**
 * Service to manage the current user state.
 */
@Injectable({ providedIn: 'root' })
export class UserStore<U extends User = User> {
    public readonly user = signal<U | null | undefined>(undefined);

    /**
     * Check if the given condition is met by the current user.
     * If there is no user, only 'false' condition is met.
     * If there is a user, 'true' conditions and claims will be checked.
     * @param condition The user condition to check
     * @returns Whether the condition is met
     */
    checkCondition(condition: UserCondition): boolean {
        let user = this.user();

        if (user) {
            if (condition === true) {
                return true;
            } else if (condition === false) {
                return false;
            } else {
                return user.hasClaim(condition);
            }
        } else {
            return condition === false;
        }
    }
}