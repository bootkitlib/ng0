/**
 * Value extractor function type.
 */
export type ValueExtractor = (a: any) => any;

/**
 * Value extractor can be a function or a string representing the property name to extract.
 */
export type ValueExtractorLike = ValueExtractor | string;


/**
 * Default value extractor function.
 * @param a The input value
 * @returns the input value
 */
export function defaultValueExtractor(a: any): any {
    return a;
}

/**
 * Converts a ValueExtractorLike to a ValueExtractorFunction.
 * @param v The value extractor to convert.
 * @returns A function that extracts the desired value.
 */
export function ValueExtractorAttribute(v: ValueExtractorLike): ValueExtractor {
    if (typeof v === 'function')
        return v;
    if (typeof v === 'string') {
        return (item: any) => item ? item[v] : undefined;
    }

    throw Error('invalid value extractor');
}
