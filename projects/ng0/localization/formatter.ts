import { Locale } from "./locale";

/**
 * Object formatter function type.
 * @param obj The object to format.
 * @param options Additional options for formatting.
 * @returns The formatted value.
 */
export type ObjectFormatter = (obj: any, ...options: any[]) => any;

/**
 * ObjectFormatterLike  
 */
export type ObjectFormatterLike = ObjectFormatter | string | number | Array<ObjectFormatter | string | number>;

/**
 * Default format function.
 * @param value The item to format.
 * @returns The formatted string.
 */
export function defaultObjectFormatter(obj: any): string {
    return obj?.toString() || '';
}

/**
 * Creates a field formatter function.
 * @param field 
 * @returns
 * @private
 */
function createFieldFormatter(field: string): ObjectFormatter {
    return (obj: any) => obj?.[field];
}

/**
 * Creates an array index formatter function.
 * @param index 
 * @returns 
 * @private
 */
function createArrayIndexFormatter(index: number): ObjectFormatter {
    return (obj: any) => {
        if (Array.isArray(obj)) {
            return obj[index];
        }

        throw Error('Object is not an array');
    }
}

/**
 * Returns a formatter function by its name and parameters.
 * @param formatterName The format string in the form of "formatterName:param1:param2:..."
 * @returns A ValueFormatterFunction
 * @private
 */
function createLocaleFormatter(locale: Locale, formatterName: string): ObjectFormatter {
    let formatter = locale.definition.formatters?.[formatterName];
    let formatterType = typeof formatter;

    if (!formatter) {
        console.warn(`The formatter "${formatterName}" is not defined in locale ${locale.definition.name}`);
        return (value) => value?.toString() || '' // return a default formatter
    }

    if (formatterType === 'function') {
        return formatter as ObjectFormatter;
    } else if (Array.isArray(formatter)) {
        return (value: number | boolean) => formatter[+value]; // use + to cast boolean values to numbers
    } else if (formatterType == 'object' && formatter != null) {
        return (value: string) => (formatter as any)[value] || ''
    } else {
        throw Error(`Invalid locale formatter: ${formatterName}`);
    }
}

/**
 * Creates an ObjectFormatter from various ObjectFormatterLike types.
 * @param formatter The ObjectFormatterLike value to convert. 
 * @param locale Optional locale object for locale-based formatting. 
 * @returns An ObjectFormatter function.
 */
export function createObjectFormatter(formatter: ObjectFormatterLike, locale?: Locale): ObjectFormatter {
    switch (typeof formatter) {
        case 'function':
            return formatter;
        case 'number':
            return createArrayIndexFormatter(formatter);
        case 'string':
            if (formatter.startsWith('@')) {
                if (locale == null) {
                    throw Error('For using locale formatters, provide a Locale object.')
                }
                return createLocaleFormatter(locale, formatter.substring(1));
            } else {
                return createFieldFormatter(formatter);
            }
        case 'object':
            if (Array.isArray(formatter)) {
                const formatters = formatter.map(item => createObjectFormatter(item, locale));
                return (obj: any) => formatters.reduce((previous, current, index) => index == 0 ? current(obj) : current(previous));
            }
            break;
    }

    throw Error('invalid formatter value', { cause: formatter });
}

/**
 * Creates a function that converts a ObjectFormatterLike value into a ObjectFormatter.
 * @param locale Optional locale object for locale-based formatting.
 * @returns A function that takes a ObjectFormatterLike and returns a ObjectFormatter.
 */
export function objectFormatterAttribute(locale?: Locale): ((v: ObjectFormatterLike) => ObjectFormatter) {
    return (v) => createObjectFormatter(v, locale);
};
