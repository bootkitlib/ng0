import { Locale } from "./locale";

/**
 * Value formatter function type.
 * @param item The item to format.
 * @param options Additional options for formatting.
 * @returns The formatted value.
 */
export type ValueFormatterFunction = (value: any, ...options: any[]) => string;

/**
 * ValueFormatterLike
 */
export type ValueFormatterLike = ValueFormatterFunction | string;

/**
 * Default format function.
 * @param value The item to format.
 * @returns The formatted string.
 */
export function defaultValueFormatter(value: any): string {
    return value?.toString() || '';
}

/**
 * Creates a value formatter attribute function.
 * The returned function takes a ValueFormatterLike and returns a ValueFormatterFunction.
 * If the input is a function, it is returned as is.
 * If the input is a string starting with '@', it returns a function that retrieves the corresponding property from the item.
 * If the input is a string representing a locale format, it uses the provided locale to get the appropriate formatter.
 * If no locale is provided and a locale format string is used, an error is thrown.
 * @param locale Optional locale object for locale-based formatting.
 * @returns A function that takes a ValueFormatterLike and returns a ValueFormatterFunction.
 */
export function valueFormatterAttribute(locale?: Locale): ((v: ValueFormatterLike) => ValueFormatterFunction) {
    return (v) => {
        if (typeof v === 'function')
            return v;
        else if (typeof v === 'string') {
            if (v.startsWith('@')) {
                let fieldName = v.substring(6);
                return (item: any) => (item?.[fieldName]?.toString() as string) ?? '';
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

