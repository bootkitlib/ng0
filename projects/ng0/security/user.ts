import { signal } from '@angular/core';
import { ClaimLike, ClaimObject } from '@bootkit/ng0/common';

/** User */
export class User {
    public readonly claims = signal<string[]>([]);

    constructor(claims: string[]) {
        this.claims.set(claims);
    }

    public hasAllClaims(claims: string[]): boolean {
        return claims.every(x => this.claims().some(y => x === y));
    }

    public hasAnyClaim(claims: string[]): boolean {
        return claims.length == 0 || claims.some(x => this.claims().some(y => x === y));
    }

    public hasClaim(claim: ClaimLike): boolean {
        var type = typeof claim;
        if (type === 'string') {
            return this.claims().some(x => x === claim);
        }

        if (type === 'object') {
            const claimObject = claim as ClaimObject;
            if (claimObject?.any && claimObject?.all) {
                throw Error('Setting "any" and "all" at the same time is not valid.');
            }

            if (Array.isArray(claimObject?.any)) {
                return this.hasAnyClaim(claimObject.any);
            }
            if (Array.isArray(claimObject?.all)) {
                return this.hasAllClaims(claimObject.all);
            }
        }

        throw Error(`Invalid claim to check: ${JSON.stringify(claim)}`);
    }
}
