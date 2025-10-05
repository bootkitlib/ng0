/**
 * A comparison function type that defines an ordering relation between two values.
 * @param a The first value to compare.
 * @param b The second value to compare.
 * @returns
 * - A negative number if `a` should come before `b`
 * - A positive number if `a` should come after `b`
 * - Zero if `a` and `b` are considered equal
 */
export type ValueComparer = (a: any, b: any) => number;

/**
 * Value comparer can be a function or a string representing the property name to compare.
 */
export type ValueComparerLike = ValueComparer | string;

/**
 * Default value comparer function.
 * @param a 
 * @param b 
 * @returns -1 if a < b, 1 if a > b, 0 if a === b
 */
export function defaultValueComparer(a: any, b: any): number {
    return a === b ? 0 : a < b ? -1 : 1;
}

/**
 * Converts a ValueComparerLike to a ValueComparerFunction.
 * @param v The value comparer to convert.
 * @returns A function that compares two values.
 */
export function valueComparerAttribute(v: ValueComparerLike): ValueComparer {
    if (typeof v === 'function')
        return v;
    if (typeof v === 'string') {
        return (a: any, b: any) => a?.[v] === b?.[v] ? 0 : a?.[v] < b?.[v] ? -1 : 1;
    }

    throw Error('invalid value comparer');
}
