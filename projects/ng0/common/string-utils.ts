/**
 * Formats a string by replacing placeholders with the provided arguments.
 * @param str The string to format, containing placeholders in the form of {0}, {1}, etc.
 * @param args The values to replace the placeholders with.
 * @returns The formatted string.
 */
export function formatString(str: string, ...args: any[]) {
    return str.replace(/\{(\d+)\}/g, function (match, index) {
        return args[index];
    });
}
