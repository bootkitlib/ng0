/**
 * Binary compare function type.
 * @param a First value to compare.
 * @param b Second value to compare.
 * @returns -1 if a < b, 1 if a > b, 0 if a === b
 */
export type BooleanValueComparerFunction = (a: any, b: any) => boolean;

export type BooleanValueComparerLike = BooleanValueComparerFunction | string;

/**
 * Default value comparer function.
 * @param a 
 * @param b 
 * @returns true if a === b else returns false
 */
export function defaultBooleanValueComparer(a: any, b: any): boolean {
    return a === b;
}

export function BooleanValueComparerAttribute(v: BooleanValueComparerLike): BooleanValueComparerFunction {
    if (typeof v === 'function')
        return v;
    if (typeof v === 'string') {
        return (a: any, b: any) => {
            
            let a2 = typeof a === 'object' && a != null ? a[v] : a;
            let b2 = typeof b === 'object' && b != null ? b[v] : b;
            return a2 === b2;
        }
    }

    throw Error('invalid boolean value comparer');
}
