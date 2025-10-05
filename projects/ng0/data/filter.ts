/**
 * Filter predicate function type.
 * @param item The item to test against the filter.
 * @param params Additional parameters to pass to the filter function.
 * @returns True if the item matches the filter, false otherwise.
 */
export type FilterPredicate = (item: any, ...params: any[]) => boolean;

/**
 * Filter predicate can be a function or a string representing the property name to filter.
 */
export type FilterPredicateLike = FilterPredicate | string;

/**
 * A filter predicate that checks if a string contains the filter criteria (case insensitive).
 * @param item The item to test against the filter.
 * @param criteria The filter criteria.
 * @returns True if the item matches the filter, false otherwise.
 */
export const stringFilter: FilterPredicate = (item: string, criteria?: string) => {
    if (criteria == null || criteria == '' || item == null || item === '') {
        return true;
    }

    return item.toString().toLowerCase().includes(criteria.toString().toLowerCase());
}

/**
 * Converts a FilterPredicateLike to a FilterPredicate function.
 * If the input is a string, it creates a predicate that checks the property with that name.
 * @param v The FilterPredicateLike to convert.
 * @returns The corresponding FilterPredicate function.
 */
export function filterPredicateAttribute(v: FilterPredicateLike): FilterPredicate {
    if (typeof v === 'function')
        return v;
    if (typeof v === 'string') {
        let predicate: FilterPredicate = (item: any, criteria?: string) => stringFilter(item?.[v], criteria);
        return predicate;
    }

    throw Error('invalid filter predicate');
}
