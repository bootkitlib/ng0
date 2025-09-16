/**
 * Format function type.
 * @param item The item to format.
 * @returns The formatted string.
 */
export type ValueFormatterFunction = (value: any, ...options: any[]) => string;

/**
 * Default format function.
 * @param item The item to format.
 * @returns The formatted string.
 */
export function defaultValueFormatter(item: any): string {
    if (item == null) {
        return '';
    }

    return item.toString();
}