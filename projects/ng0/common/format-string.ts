export function formatString(str: string, ...args: any[]) {
    return str.replace(/\{(\d+)\}/g, function (match, index) {
        return args[index];
    });
}
