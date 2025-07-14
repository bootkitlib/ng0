import { User } from './user';
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserStore<U extends User = User> {
    public readonly user = signal<U | null | undefined>(undefined);

    constructor() {
    }
}