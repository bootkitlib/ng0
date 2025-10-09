import { Locale } from "./locale";

/**
 * Object formatter function type.
 * @param obj The object to format.
 * @param options Additional options for formatting.
 * @returns The formatted value.
 */
export type ObjectFormatter = (obj: any, ...options: any[]) => string;

/**
 * ObjectFormatterLike  
 */
export type ObjectFormatterLike = ObjectFormatter | string;

/**
 * Default format function.
 * @param value The item to format.
 * @returns The formatted string.
 */
export function defaultObjectFormatter(obj: any): string {
    return obj?.toString() || '';
}

/**
 * Creates an object formatter attribute function.
 * The returned function takes a ObjectFormatterLike and returns a ObjectFormatterFunction.
 * If the input is a function, it is returned as is.
 * If the input is a string starting with '@', it returns a function that retrieves the corresponding property from the item.
 * If the input is a string representing a locale format, it uses the provided locale to get the appropriate formatter.
 * If no locale is provided and a locale format string is used, an error is thrown.
 * @param locale Optional locale object for locale-based formatting.
 * @returns A function that takes a ValueFormatterLike and returns a ValueFormatterFunction.
 */
export function objectFormatterAttribute(locale?: Locale): ((v: ObjectFormatterLike) => ObjectFormatter) {
    return (v) => {
        if (typeof v === 'function')
            return v;
        else if (typeof v === 'string') {
            if (v.startsWith('@')) {
                // Locale-based formatting
                if (locale == null) {
                    throw Error('For using locale value formatters, provide a locale object.')
                }
                let formatterName = v.substring(1);
                return locale.getFormatter(formatterName);
            } else {
                // Field-based formatting
                return (item: any) => (item?.[v]?.toString() as string) ?? '';
            }
        }

        throw Error('invalid value');
    }
}

