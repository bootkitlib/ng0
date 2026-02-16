import { Directive, ElementRef, forwardRef, inject, Provider, Renderer2, } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * A ControlValueAccessor for file input elements. It supports both single and multiple file selection.
 * It assigns the selected file(s) to the form control's value and handles disabled state.
 * @see https://angular.dev/api/forms/ControlValueAccessor
 */
@Directive({
    selector: 'input[type=file][ngModel][ng0File]',
    host: {
        '(blur)': '_touchedFn()',
        '(change)': '_onChange($event)',
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => FileValueAccessor),
        multi: true,
    }],
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

    protected _onChange(e: Event) {
        const input = e.target as HTMLInputElement;

        let value;
        if (input.files?.length) {
            value = input.multiple ? input.files : input.files[0]
        } else {
            value = undefined;
        }

        this._changeFn(value);
    }
}