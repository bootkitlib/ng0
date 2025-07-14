import { ClaimLike, ClaimObject } from './types';

/** User */
export class User {
    constructor(public readonly claims: string[]) {
    }

    public hasClaims(claims: string[]): boolean {
        return claims.every(x => this.claims.some(y => x === y));
    }

    public hasAnyClaim(claims: string[]): boolean {
        return claims.length == 0 || claims.some(x => this.claims.some(y => x === y));
    }

    public hasClaim(claim: ClaimLike): boolean {
        var type = typeof claim;
        if (type === 'string') {
            return this.claims.some(x => x === claim);
        }

        if (type === 'object') {
            const co = claim as ClaimObject;
            if (co?.any && co?.all) {
                throw Error('Setting "any" and "all" at the same time is not valid.');
            }

            if (Array.isArray(co?.any)) {
                return this.hasAnyClaim(co.any);
            }
            if (Array.isArray(co?.all)) {
                return this.hasClaims(co.all);
            }
        }

        throw Error('Invalid claim');
    }
}
