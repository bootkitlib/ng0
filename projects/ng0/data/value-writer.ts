/**
 * Value writer function type.
 * @param a The input value
 * @returns The written value
 */
export type ValueWriter = (a: any) => any;

/**
 * Value writer can be a function or a string representing the property name to extract the value from.
 */
export type ValueWriterLike = ValueWriter | string;


/**
 * Default value writer function.
 * @param a The input value
 * @returns the input value (it does not transform it)
 */
export function defaultValueWriter(a: any): any {
    return a;
}

/**
 * Converts a ValueWriterLike to a ValueWriterFunction.
 * @param v The value writer to convert.
 * @returns A ValueWriter function.
 */
export function ValueWriterAttribute(v: ValueWriterLike): ValueWriter {
    if (typeof v === 'function')
        return v;
    if (typeof v === 'string') {
        return (item: any) => item ? item[v] : undefined;
    }

    throw Error('invalid value writer');
}
