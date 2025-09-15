/**
 * Filter function type.
 * @param filter The filter value.
 * @param item The item to filter.
 * @returns True if the item matches the filter, false otherwise.
 */
export type FilterFunction = (filter: any, item: any) => boolean;


/**
 * Default filter function.
 * @param filter 
 * @param item 
 * @returns True if the item matches the filter, false otherwise.
 */
export function defaultFilterFunction(filter: any, item: any): boolean {
    if (filter == null || filter == '' || item == null || item === '') {
        return true;
    }

    return item.toString().toLowerCase().includes(filter.toString().toLowerCase());
}
