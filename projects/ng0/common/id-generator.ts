let _idCounter = 0;

/**
 * Type definition for an ID generator function.
 * @param item The item for which the ID is to be generated.
 * @param index Optional index of the item in the list, if applicable.
 * @returns A string representing the generated ID.
 */
export type IdGenerator = (index: number, item: any) => string;

/**
 * Type definition for an ID generator which can be a function or a string representing the property name to extract the ID from.
 */
export type IdGeneratorLike = IdGenerator | string;

/**
 * Creates a sequential ID generator function with an optional prefix.
 * This function generates unique IDs by incrementing a counter each time it is called.
 * @param prefix Optional prefix for the generated IDs.
 * @returns A function that generates sequential IDs with the given prefix.
 */
export function sequentialIdGenerator(prefix?: string): IdGenerator {
    return (index: number, item: any) => `${prefix || ''}${_idCounter++}`;
}

/**
 * Converts an IdGeneratorLike to an IdGenerator function.
 * @param v The ID generator to convert.
 * @returns An IdGenerator function.
 */
export function IdGeneratorAttribute(v: IdGeneratorLike): IdGenerator {
    if (typeof v === 'function')
        return v;
    else if (typeof v === 'string') {
        return (index: number, item: any) => item ? item[v] : undefined;
    }

    throw Error('invalid id generator');
}
