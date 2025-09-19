/**
 * Compare function type.
 * @param a First value to compare.
 * @param b Second value to compare.
 * @returns -1 if a < b, 1 if a > b, 0 if a === b
 */
export type ValueComparerFunction = (a: any, b: any) => number;

export type ValueComparerLike = ValueComparerFunction | string;

/**
 * Default value comparer function.
 * @param a 
 * @param b 
 * @returns -1 if a < b, 1 if a > b, 0 if a === b
 */
export function defaultValueComparer(a: any, b: any): number {
    return a === b ? 0 : a < b ? -1 : 1;
}

export function ValueComparerAttribute(v: ValueComparerLike): ValueComparerFunction {
    if (typeof v === 'function')
        return v;
    if (typeof v === 'string') {
        return (a: any, b: any) => a?.[v] === b?.[v] ? 0 : a?.[v] < b?.[v] ? -1 : 1;
    }

    throw Error('invalid value comparer');
}
