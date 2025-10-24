/**
 * Equality comparer function type.
 * @param a First value to compare.
 * @param b Second value to compare.
 * @returns true if a is considered equal to b else returns false
 */
export type EqualityComparer = (a: any, b: any) => boolean;

/**
 * Equality comparer like type.
 * can be a function or a string representing the property name to compare.
 */
export type EqualityComparerLike = EqualityComparer | string;

/**
 * Default equality comparer function.
 * @param a First value to compare.
 * @param b Second value to compare.
 * @returns true if a === b else returns false
 */
export function defaultEqualityComparer(a: any, b: any): boolean {
    return a === b;
}

/**
 * Converts an EqualityComparerLike to an EqualityComparer function.
 * @param e The EqualityComparerLike to convert.
 * @returns The converted EqualityComparer.
 */
export function equalityComparerAttribute(e: EqualityComparerLike): EqualityComparer {
    if (typeof e === 'function')
        return e;
    if (typeof e === 'string') {
        return (a: any, b: any) => {
            let a2 = a != null && Object.hasOwn(a, e) ? a[e] : a;
            let b2 = b != null && Object.hasOwn(b, e) ? b[e] : b;
            return a2 === b2;
        }
    }

    throw Error('invalid equality comparer');
}
