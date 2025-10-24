/**
 * Filter predicate function type.
 * @param item The item to test against the filter.
 * @param params Additional parameters to pass to the filter.
 * @returns True if the item matches the filter, false otherwise.
 */
export type FilterPredicate = (item: any, ...params: any[]) => boolean;

/**
 * Filter predicate can be a function or a string representing the property name to filter.
 */
export type FilterPredicateLike = FilterPredicate | string;

/**
 * No-op filter predicate that always returns true.
 * @param item The item to test against the filter.
 * @returns true
 */
export const noopFilter: FilterPredicate = (item: any, ...params: any[]) => true;


/**
 * A simple filter predicate that checks if the item's string representation includes the match string.
 * @param item The item to test against the filter.
 * @param match The string to match.
 * @returns True if the item matches the filter, false otherwise.
 */
export const defaultFilter: FilterPredicate = (item: any, match: string) => {
    if (match == undefined || match == '') {
        return true;
    }

    if (item == undefined) {
        return false;
    }

    return (item as Object).toString().toLowerCase().includes(match.toLowerCase());
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
    else if (typeof v === 'string') {
        return (item: any, match: string) => 
            item != null && Object.hasOwn(item, v) ? defaultFilter(item[v], match) : false;
    }

    throw Error('invalid filter predicate');
}
