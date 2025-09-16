/**
 * Value extractor function type.
 */
export type ValueExtractorFunction = (a: any) => any;


/**
 * Default value extractor function.
 * @param a The input value
 * @returns the input value
 */
export function defaultValueExtractor(a: any): any {
    return a;
}

