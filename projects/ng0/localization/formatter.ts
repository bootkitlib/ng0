import { EnvironmentInjector, inject, runInInjectionContext } from "@angular/core";
import { Locale } from "./locale";
import { LocalizationService } from "./localization.service";

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
export type ObjectFormatterLike = ObjectFormatter | string | number | Array<any>;

/**
 * Default object formatter function.
 * @param value The item to format.
 * @returns The formatted string.
 */
export function defaultFormatter(obj: any): string {
    return obj?.toString() || '';
}

/**
 * Creates a field formatter that retrieves the value of a specified field from an object.
 * @param field The field name to retrieve.
 * @returns An ObjectFormatter function.
 */
export function createFieldFormatter(field: string): ObjectFormatter {
    return (obj: any) => obj?.[field];
}

/**
 * Creates an index formatter that retrieves the value at a specified index from an array.
 * @param index The index to retrieve (number or boolean).
 * @returns An ObjectFormatter function.
 */
export function createIndexFormatter(index: number | boolean): ObjectFormatter {
    return (obj: any) => {
        if (Array.isArray(obj)) {
            return obj[+index]; // use + to cast boolean values to numbers
        }

        throw Error('Object is not an array');
    }
}

/**
 * Creates a number formatter.
 * @param minimumIntegerDigits  
 * @param minimumFractionDigits 
 * @param maximumFractionDigits 
 * @param useGrouping 
 * @returns An ObjectFormatter function.
 */
export function createNumberFormatter(
    minimumIntegerDigits?: number,
    minimumFractionDigits?: number,
    maximumFractionDigits?: number,
    useGrouping = true): ObjectFormatter {
    let locale = inject(LocalizationService, { optional: true })?.get();
    const localeName = locale?.definition.name || 'en-US';

    const f = new Intl.NumberFormat(localeName, {
        minimumIntegerDigits,
        minimumFractionDigits,
        maximumFractionDigits,
        useGrouping,
    })

    return (n: number) => Number.isFinite(n) ? f.format(n) : '';
}

/**
 * Creates a currency formatter.
 * @param minFractions 
 * @param maxFractions 
 * @returns 
 */
export function createCurrencyFormatter(minFractions = 1, maxFractions = 2): ObjectFormatter {
    return (n: number, minFractions, maxFractions) => Number.isFinite(n) ? n.toString() : '';
}

/**
 * Creates a date formatter.
 */
export function createDateFormatter(
    dateStyle?: 'short' | 'medium' | 'long' | 'full',
    timeStyle?: 'short' | 'medium' | 'long' | 'full',
    zone?: string[], // zone[0]: name, zone[1]: display ('long' | 'short' | 'shortOffset' | 'longOffset' | 'narrowOffset' | 'longGeneric' | 'shortGeneric')
    calendar?: string
): ObjectFormatter;
export function createDateFormatter(options?: Intl.DateTimeFormatOptions): ObjectFormatter;
export function createDateFormatter(options?: any): ObjectFormatter {
    let intlOptions: Intl.DateTimeFormatOptions;

    if (options && (typeof options === 'object')) {
        intlOptions = options;
    } else {
        intlOptions = {
            dateStyle: arguments[0],
            timeStyle: arguments[1],
            timeZone: arguments[2]?.[0],
            timeZoneName: arguments[2]?.[1],
            calendar: arguments[3]
        }
    }

    const locale = inject(LocalizationService, { optional: true })?.get();
    let intlFormatter: Intl.DateTimeFormat;

    try {
        intlFormatter = new Intl.DateTimeFormat(locale?.name, intlOptions as Intl.DateTimeFormatOptions);
        return (d: string | number | Date) => intlFormatter.format(new Date(d));
    } catch (err) {
        console.warn('Invalid date format options:', intlOptions, err);
        // Return a fallback formatter
        return (d: string | number | Date) => new Date(d).toLocaleString()
    }
}

/**
 * Creates a locale-based formatter.
 * @param locale The Locale object.
 * @param formatterName The format string in the form of "formatterName:param1:param2:..."
 * @returns A ValueFormatterFunction
 * @private
 */
export function createLocaleFormatter(formatterName: string): ObjectFormatter {
    let locale = inject(LocalizationService, { optional: true })?.get();

    if (locale == null) {
        throw Error('For using locale formatters, provide a Locale object.')
    }

    let formatter = locale.definition.formatters?.[formatterName];
    let formatterType = typeof formatter;

    if (!formatter) {
        console.warn(`The formatter "${formatterName}" is not defined in locale ${locale.definition.name}`);
        return defaultFormatter;
    }

    if (formatterType === 'function') {
        return formatter as ObjectFormatter;
    } else if (Array.isArray(formatter)) {
        return (index: number | boolean) => formatter[+index];
    } else if (formatterType == 'object' && formatter != null) {
        return (value: string) => (formatter as any)[value] || '';
    } else {
        throw Error(`Invalid locale formatter: ${formatterName}`);
    }
}

/**
 * Creates a composite formatter that applies multiple formatters in sequence. 
 * @param formatters The list of ObjectFormatterLike values to compose.
 * @returns An ObjectFormatter function.
 */
export function createCompositeFormatter(...formatters: ObjectFormatterLike[]): ObjectFormatter {
    const formattersFuncs = formatters.map(item => createObjectFormatter(item as any));
    return (obj: any) => formattersFuncs.reduce(
        (previous, current, index) => index == 0 ? current(obj) : current(previous)
    );
}

/**
 * Creates an ObjectFormatter from various ObjectFormatterLike types.
 * @param formatter The ObjectFormatterLike value to convert. 
 * @param locale Optional locale object for locale-based formatting.
 * @param params Additional parameters for the formatter.
 * @returns An ObjectFormatter function.
 */
export function createObjectFormatter(formatter: ObjectFormatterLike, ...params: any[]): ObjectFormatter {
    switch (typeof formatter) {
        case 'function':
            return formatter.bind(null, ...params);
        case 'number':
            return createIndexFormatter(formatter);
        case 'string':
            switch (formatter[0]) {
                case '#':
                    return createNumberFormatter(...params);
                case '$':
                    return createCurrencyFormatter(...params);
                case '@':
                    return createDateFormatter(...params);
                case '*':
                    return createLocaleFormatter(formatter.substring(1));
                default:
                    return createFieldFormatter(formatter);
            }
        case 'object':
            if (Array.isArray(formatter) && formatter.length > 0) {
                if (formatter[0] == 'C') {
                    return createCompositeFormatter(formatter.slice(1))
                } else {
                    return createObjectFormatter(formatter[0] as string, ...formatter.slice(1));
                }
            }
            break;
    }

    throw Error('invalid formatter', { cause: formatter });
}

/**
 * Creates a transform function that converts a ObjectFormatterLike value into a ObjectFormatter.
 * @param injector The EnvironmentInjector to use for dependency injection.
 * @returns A function that takes a ObjectFormatterLike and returns a ObjectFormatter.
 */
export function objectFormatterAttribute(injector: EnvironmentInjector): ((v: ObjectFormatterLike) => ObjectFormatter) {
    return (x: ObjectFormatterLike) => runInInjectionContext(injector, createObjectFormatter.bind(null, x));
};
