/**
 * Compare function type.
 * @param a First value to compare.
 * @param b Second value to compare.
 * @returns -1 if a < b, 1 if a > b, 0 if a === b
 */
export type ValueComparerFunction = (a: any, b: any) => number;


/**
 * Default value comparer function.
 * @param a 
 * @param b 
 * @returns -1 if a < b, 1 if a > b, 0 if a === b
 */
export function defaultValueComparer(a: any, b: any): number {
    return a === b ? 0 : a < b ? -1 : 1;
}

