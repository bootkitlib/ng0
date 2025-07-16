export type CodeFormatterFunc = (code: string) => string;

export class CodeFormatter {
    constructor(public readonly name: string, public readonly format: CodeFormatterFunc) {
    }
}
