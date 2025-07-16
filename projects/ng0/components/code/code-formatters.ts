import { Injectable } from '@angular/core';
import { CodeFormatter, CodeFormatterFunc } from './types';

@Injectable({
    providedIn: 'root'
})
export class CodeFormatters {
    private _formatters = new Array<CodeFormatter>();

    constructor() { }

    add(name: string, func: CodeFormatterFunc): CodeFormatter {
        var formatter = this._formatters.find(x => x.name == name);
        if (!formatter) {
            formatter = new CodeFormatter(name, func);
            this._formatters.push(formatter);
        }

        return formatter;
    }

    find(name: string) {
        return this._formatters.find(x => x.name == name);
    }
}

