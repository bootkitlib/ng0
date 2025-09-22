/**
 * Boolean value comparer function type.
 * @param a First value to compare.
 * @param b Second value to compare.
 * @returns true if a is considered equal to b else returns false
 */
export type BooleanValueComparer = (a: any, b: any) => boolean;

/**
 * Boolean value comparer can be a function or a string representing the property name to compare.
 */
export type BooleanValueComparerLike = BooleanValueComparer | string;

/**
 * Default value comparer function.
 * @param a 
 * @param b 
 * @returns true if a === b else returns false
 */
export function defaultBooleanValueComparer(a: any, b: any): boolean {
    return a === b;
}

export function BooleanValueComparerAttribute(v: BooleanValueComparerLike): BooleanValueComparer {
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
