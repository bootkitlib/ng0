import { Locale } from "./locale";

/**
 * Object formatter function type.
 * @param obj The object to format.
 * @param params Additional parameters for formatting.
 * @returns The formatted value.
 */
export type ObjectFormatter = (obj: any, ...params: any[]) => any;

/**
 * Object formatter-like types.  
 */
export type ObjectFormatterLike = ObjectFormatter | string | number | Array<ObjectFormatter | string | number | boolean | undefined>;

/**
 * Default object formatter function.
 * @param value The item to format.
 * @returns The formatted string.
 */
export function defaultFormatter(obj: any): string {
    return obj?.toString() || '';
}

function createFieldFormatter(field: string): ObjectFormatter {
    return (obj: any) => obj?.[field];
}

function createIndexFormatter(index: number | boolean, ...params: any[]): ObjectFormatter {
    return (obj: any) => {
        if (Array.isArray(obj)) {
            return obj[+index]; // use + to cast boolean values to numbers
        }

        throw Error('Object is not an array');
    }
}

function createArrayFormatter(array: any[]): ObjectFormatter {
    if (!Array.isArray(array)) {
        throw Error('Object is not an array');
    }

    return (index: number | boolean) => array[+index];
}

function createNumberFormatter(
    locale: string,
    minimumIntegerDigits?: number,
    minimumFractionDigits?: number,
    maximumFractionDigits?: number,
    useGrouping = true): ObjectFormatter {
    const formatter = new Intl.NumberFormat(locale, {
        minimumIntegerDigits,
        minimumFractionDigits,
        maximumFractionDigits,
        useGrouping,
    })

    return (n: number) => Number.isFinite(n) ? formatter.format(n) : '';
}

function createCurrencyFormatter(minFractions = 1, maxFractions = 2): ObjectFormatter {
    return (n: number, minFractions, maxFractions) => Number.isFinite(n) ? n.toString() : '';
}

function createDateFormatter(minFractions = 1, maxFractions = 2): ObjectFormatter {
    return (n: number, minFractions, maxFractions) => Number.isFinite(n) ? n.toString() : '';
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
        return defaultFormatter;
    }

    if (formatterType === 'function') {
        return formatter as ObjectFormatter;
    } else if (Array.isArray(formatter)) {
        return createArrayFormatter(formatter);
    } else if (formatterType == 'object' && formatter != null) {
        return (value: string) => (formatter as any)[value] || '';
    } else {
        throw Error(`Invalid locale formatter: ${formatterName}`);
    }
}

/**
 * Creates an ObjectFormatter from various ObjectFormatterLike types.
 * @param formatter The ObjectFormatterLike value to convert. 
 * @param locale Optional locale object for locale-based formatting.
 * @param params Additional parameters for the formatter.
 * @returns An ObjectFormatter function.
 */
export function createObjectFormatter(formatter: ObjectFormatterLike, locale?: Locale, ...params: any[]): ObjectFormatter {
    const localeName = locale?.definition.name || 'en-US';

    switch (typeof formatter) {
        case 'function':
            return formatter;
        case 'number':
            return createIndexFormatter(formatter, ...params);
        case 'string':
            switch (formatter.at(0)) {
                case '*':
                    if (locale == null) {
                        throw Error('For using locale formatters, provide a Locale object.')
                    }
                    return createLocaleFormatter(locale, formatter.substring(1));
                case '#':
                    return createNumberFormatter(localeName, ...params);
                case '@':
                    return createDateFormatter();
                case '$':
                    return createCurrencyFormatter();
                default:
                    return createFieldFormatter(formatter);
            }

        case 'object':
            if (Array.isArray(formatter) && formatter.length > 0) {
                if (formatter[0] == '|') {
                    // Create a composite formatter.
                    const formatters = formatter.slice(1).map(item => createObjectFormatter(item as any, locale));
                    return (obj: any) => formatters.reduce(
                        (previous, current, index) => index == 0 ? current(obj, ...params) : current(previous)
                    );
                } else {
                    // Create a formatter with parameters.
                    return createObjectFormatter(formatter[0] as string, locale, ...formatter.slice(1));
                }
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
