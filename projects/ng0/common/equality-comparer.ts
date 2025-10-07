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
            let a2 = typeof a === 'object' && a != null ? a[e] : a;
            let b2 = typeof b === 'object' && b != null ? b[e] : b;
            return a2 === b2;
        }
    }

    throw Error('invalid equality comparer');
}

/**
 * @private 
 * @param items 
 * @param value 
 * @param comparer 
 */
export function findValueByComparer(items: any[], value: any, comparer: EqualityComparer): any {
    if (!items || items.length === 0 || value === undefined || value === null) {
        return undefined;
    }
    
    return items.find(i => comparer(i, value));
}

/**
 * @private 
 * @param items 
 * @param values
 * @param comparer 
 */
export function findValuesByComparer(items: any[], values: any[], comparer: EqualityComparer): any[] {
    if (!items || items.length === 0 || !values || values.length === 0) {
        return [];
    }

    const result: any[] = [];
    for (let v of values) {
        const item = items.find(i => comparer(i, v));
        if (item) {
            result.push(item);
        }
    }

    return result;
}
