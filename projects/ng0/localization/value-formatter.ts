import { Locale } from "./locale";

/**
 * Format function type.
 * @param item The item to format.
 * @returns The formatted string.
 */
export type ValueFormatterFunction = (value: any, ...options: any[]) => string;

export type ValueFormatterLike = ValueFormatterFunction | string;

/**
 * Default format function.
 * @param value The item to format.
 * @returns The formatted string.
 */
export function defaultValueFormatter(value: any): string {
    if (value == null) {
        return '';
    }

    return value.toString();
}

/**
 * Creates a value formatter attribute function.
 * @param locale  
 * @returns 
 */
export function valueFormatterAttribute(locale?: Locale): ((v: ValueFormatterLike) => ValueFormatterFunction) {
    return (v) => {
        if (typeof v === 'function')
            return v;
        else if (typeof v === 'string') {
            if (v.startsWith('field:')) {
                let fieldName = v.substring(6);
                return (item: any, ...options: any[]) => (item?.[fieldName]?.toString() as string) ?? '';
            } else {
                if (locale == null) {
                    throw Error('For using locale value formatters, provide a locale object.')
                }

                return locale.getFormatter(v);
            }
        }

        throw Error('invalid value');
    }
}

