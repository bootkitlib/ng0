/**
 * Value extractor function type.
 */
export type ValueExtractorFunction = (a: any) => any;
export type ValueExtractorLike = ValueExtractorFunction | string;


/**
 * Default value extractor function.
 * @param a The input value
 * @returns the input value
 */
export function defaultValueExtractor(a: any): any {
    return a;
}

export function ValueExtractorAttribute(v: ValueExtractorLike): ValueExtractorFunction {
    if (typeof v === 'function')
        return v;
    if (typeof v === 'string') {
        return (item: any) => item ? item[v] : undefined;
    }

    throw Error('invalid value extractor');
}
