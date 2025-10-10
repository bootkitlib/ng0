/**
 * Filter predicate function type.
 * @param item The item to test against the filter.
 * @returns True if the item matches the filter, false otherwise.
 */
export type FilterPredicate = (item: any) => boolean;

/**
 * Filter predicate can be a function or a string representing the property name to filter.
 */
export type FilterPredicateLike = FilterPredicate | string;

/**
 * 
 * @param item 
 * @returns 
 */
export const noopFilter: FilterPredicate = (item: string) => true;


/**
 * Converts a FilterPredicateLike to a FilterPredicate function.
 * If the input is a string, it creates a predicate that checks the property with that name.
 * @param v The FilterPredicateLike to convert.
 * @returns The corresponding FilterPredicate function.
 */
export function filterPredicateAttribute(v: FilterPredicateLike): FilterPredicate {
    if (typeof v === 'function')
        return v;

    throw Error('invalid filter predicate');
}
