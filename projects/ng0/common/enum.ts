
export function getEnumValues(enumClass: Record<string, string | number>): Array<string | number> {
    return Object.keys(enumClass)
    .filter(k => isNaN(Number(k))) // remove reverse-mapping keys
    .map(k => enumClass[k]);
};
