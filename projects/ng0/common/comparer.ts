/**
 * A comparison function type that defines an ordering relation between two values.
 * @param a The first value to compare.
 * @param b The second value to compare.
 * @returns
 * - A negative number if `a` should come before `b`
 * - A positive number if `a` should come after `b`
 * - Zero if `a` and `b` are considered equal
 */
export type Comparer = (a: any, b: any) => number;

/**
 * Value comparer can be a function or a string representing the property name to compare.
 */
export type ComparerLike = Comparer | string;

/**
 * A simple comparer function.
 * @param a The first value to compare.
 * @param b The second value to compare.
 * @returns -1 if a < b, 1 if a > b, 0 if a === b
 */
export function defaultComparer(a: any, b: any): number {
    return a === b ? 0 : a < b ? -1 : 1;
}

/**
 * Converts a ComparerLike to a Comparer.
 * @param v The comparer to convert.
 * @returns A function that compares two values.
 */
export function comparerAttribute(v: ComparerLike): Comparer {
    if (typeof v === 'function')
        return v;
    if (typeof v === 'string') {
        return (a: any, b: any) => a?.[v] === b?.[v] ? 0 : a?.[v] < b?.[v] ? -1 : 1;
    }

    throw Error('invalid value comparer');
}

