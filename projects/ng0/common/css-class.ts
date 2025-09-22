/**
 * CSS class type which can be a string, array of strings, set of strings, or an object with class names as keys.
 */
export type CssClass = string | string[] | Set<string> | { [klass: string]: any } | null | undefined;


/**
 * A function that takes an item and returns a CssClass.
 * @param item The item to get the CSS class for.
 * @returns The CSS class for the item.
 */
export type CssClassGetter = (item: any) => CssClass;

/**
 * A type that represents a CSS class or a function that returns a CSS class.
 */
export type CssClassLike = CssClass | CssClassGetter | null | undefined;


/**
 * Converts a CssClassLike to a CssClassGetter function.
 * @param v The CssClassLike to convert.
 * @returns A function that returns the desired CSS class.
 */
export function CssClassAttribute(v: CssClassLike): CssClassGetter {
    if (typeof v === 'function')
        return v as CssClassGetter;
    if (typeof v === 'string') {
        return (item: any) => v;
    } else if (v === undefined || v === null) {
        return (item: any) => undefined;
    }

    throw Error('invalid css class getter');
}
