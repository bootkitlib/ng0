let _idCounter = 0;

export abstract class _IdGenerator {
    private static _idCounter = 0;

    public static next(): number {
        return _IdGenerator._idCounter++;
    }
}

/**
 * Type definition for an ID generator function.
 */
export type IdGenerator = (param?: any) => string;

/**
 * Creates a sequential ID generator function with an optional prefix.
 * @param prefix Optional prefix for the generated IDs.
 * @returns A function that generates sequential IDs with the given prefix.
 */
export function sequentialIdGenerator(prefix?: string): IdGenerator {
    return (item?: any) => `${prefix || ''}${_idCounter++}`;
}
