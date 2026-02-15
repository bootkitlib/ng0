import { Directive, ElementRef, forwardRef, inject, Provider, Renderer2, } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const FILE_VALUE_ACCESSOR: Provider = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FileValueAccessor),
    multi: true,
};

@Directive({
    selector: 'input[type=file][ngModel][ng0File]',
    host: {
        '(blur)': '_touchedFn()',
        '(change)': '_onChange($event)',
    },
    providers: [FILE_VALUE_ACCESSOR],
})
export class FileValueAccessor implements ControlValueAccessor {
    private readonly _renderer = inject(Renderer2);
    private readonly _elementRef = inject(ElementRef);
    protected _changeFn!: (value: any) => {};
    protected _touchedFn!: () => {};

    writeValue(value?: any): void {
    }

    registerOnChange(fn: any): void {
        this._changeFn = fn;
    }

    registerOnTouched(fn: any): void {
        this._touchedFn = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }

    _onChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const isMultiple = input.multiple;

        let value;
        if (input.files?.length) {
            value = isMultiple ? input.files : input.files[0]
        } else {
            value = undefined;
        }

        this._changeFn(value);
    }
}