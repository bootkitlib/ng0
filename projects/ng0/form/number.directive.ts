import { Directive, HostListener, forwardRef, ElementRef, Renderer2, input, booleanAttribute, numberAttribute, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { formatNumber } from '@angular/common';

const addThousandsSeparator = (str: string) => str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const isValidNumber = (str: string) => str.trim() !== '' && !isNaN(Number(str));
const removeChar = (str: string, charToRemove: string) => str.split(charToRemove).join('');

const Keys = {
  backspace: 'Backspace',
  tab: 'Tab',
  arrowLeft: 'ArrowLeft',
  arrowRight: 'ArrowRight',
  delete: 'Delete',
  home: 'Home',
  end: 'End'
}

interface InputElementState {
  selectionStart: number;
  selectionEnd: number;
  isCursorInsideIntegerPart: boolean;
  decimalSeparatorPosition: number;
}

/**
 * Directive to allow only number input in text fields.
 * It supports integer and decimal numbers, negative numbers, min/max values, thousands separator.
 */
@Directive({
  selector: '[ng0Number]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberDirective),
      multi: true
    }
  ]
})
export class NumberDirective implements ControlValueAccessor {
  private _value?: number;
  private _isDisabled?: boolean;
  private _decimalSeparator!: string;
  private _thousandsSeparator: string = ',';
  private _onChangeCallback?: (v: any) => {};
  private _onTouchedCallback?: () => {};
  private _elmRef = inject(ElementRef<HTMLInputElement>);
  private _renderer = inject(Renderer2);

  /**
   * The minimum number of digits to display after the decimal point.
   * Applied only when 'numberType' is set to 'decimal'.
   * @default 1
   */
  public minFractionDigits = input(1, { transform: numberAttribute });

  /**
   * The maximum number of digits to display after the decimal point.
   * Applied only when 'numberType' is set to 'decimal'.
   * @default 2
   */
  public maxFractionDigits = input(2, { transform: numberAttribute });

  /**
   * Whether to use grouping separators, such as thousands separators
   * @default false
   */
  public useGrouping = input(false, { transform: booleanAttribute });

  /**
   * Type of numbers to allow
   * 'decimal' - allow decimal numbers
   * 'integer' - allow integer numbers only
   * @default 'integer'
   */
  public numberType = input<'integer' | 'decimal'>('integer');

  constructor() { }

  ngOnInit() {
    // Use Intl.NumberFormat to find decimal separator for locale
    const formatted = formatNumber(1.1, 'en', '1.1-1');
    this._decimalSeparator = formatted.replace(/\d/g, '') || '.';
  }

  registerOnChange(fn: any): void {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouchedCallback = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
    this._renderer.setProperty(this._elmRef.nativeElement, 'disabled', isDisabled);
  }

  writeValue(value: any): void {
    var inputValue: string;

    if (value === undefined || value === null) {
      inputValue = '';
      this._value = undefined;
    } else if (typeof value === 'number') {
      inputValue = this._formatNumber(value);
      this._value = value;
    }
    else if (typeof value === 'string') {
      const parsedValue = this._value = Number.parseFloat(value);
      inputValue = this._formatNumber(parsedValue);
    } else {
      console.error('NumberDirective: Unsupported value type', value);
      inputValue = 'Invalid';
    }

    this._setProperty('value', inputValue);
  }

  @HostListener('keydown', ['$event'])
  private _onKeyDown(event: KeyboardEvent) {
    const key = event.key;
    const state = this._getInputState();

    if (this._isKeyAllowed(key)) {
      if (key == Keys.backspace) {
        if (state.selectionStart > 1 && (state.selectionStart === state.selectionEnd)) {
          let value = this._elmRef.nativeElement.value;
          let beforeSelection = value.charAt(state.selectionStart - 1);
          if (beforeSelection === ',') {
            // If the character before the cursor is a comma, we need to skip it
            this._setProperty('selectionStart', state.selectionStart - 2);
          }
        }
      }
    } else {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event.target.value'])
  private _onInput(value: string) {
    if (value === '') {
      this._value = undefined;
      this._onChangeCallback?.(undefined);
      return;
    }

    const state = this._getInputState();
    if (state.isCursorInsideIntegerPart && this.useGrouping()) {
      this._formatIntegerPart(value);
    }

    var number = Number(removeChar(this._elmRef.nativeElement.value, this._thousandsSeparator));
    this._value = isNaN(number) ? undefined : number;
    this._onChangeCallback?.(this._value);
  }

  private _formatIntegerPart(value: string) {
    let state = this._getInputState();

    // Format the input value
    const integerPart = value.split(this._decimalSeparator)[0];
    const decimalPart = value.split(this._decimalSeparator)[1];

    if (integerPart.length <= 3) {
      return;
    }

    let normalizedIntegerPart = removeChar(integerPart, this._thousandsSeparator); // Remove commas

    let formattedValue = addThousandsSeparator(normalizedIntegerPart);
    if (decimalPart !== undefined) {
      formattedValue += this._decimalSeparator + decimalPart;
    }

    this._setProperty('value', formattedValue);
    let newSelectionStart: number;


    // fix the cursor position after formatting
    if (value.length == 1) {
      newSelectionStart = 1;
    } else {
      const newValueLength = formattedValue.length;
      const cursorJump = newValueLength - value.length;
      newSelectionStart = Math.max(0, state.selectionStart + cursorJump);
    }

    this._setProperty('selectionStart', newSelectionStart);
    this._setProperty('selectionEnd', newSelectionStart);

    // return formattedValue;
  }

  @HostListener('blur')
  private _onBlur() {
    if (this._value !== undefined) {
      let formattedValue = this._formatNumber(this._value);
      this._setProperty('value', formattedValue);
    }

    this._onTouchedCallback?.();
  }

  @HostListener('paste', ['$event'])
  private _onPaste(event: ClipboardEvent) {
    // event.
    // value = value.trim();
  }

  private _getInputState(): InputElementState {
    let value = this._elmRef.nativeElement.value;
    let decimalSeparatorPosition = value.indexOf(this._decimalSeparator);
    let selectionStart = this._elmRef.nativeElement.selectionStart || 0;
    let selectionEnd = this._elmRef.nativeElement.selectionEnd || 0;

    return {
      selectionStart,
      selectionEnd,
      decimalSeparatorPosition,
      isCursorInsideIntegerPart: decimalSeparatorPosition > -1 ? (selectionStart <= decimalSeparatorPosition) : true
    }
  }

  private _formatNumber(n: number): string {
    var isInteger = this.numberType() == 'integer';
    return new Intl.NumberFormat('en-US', {
      useGrouping: this.useGrouping(),
      minimumFractionDigits: isInteger ? 0 : this.minFractionDigits(),
      maximumFractionDigits: isInteger ? 0 : this.maxFractionDigits(),
      style: 'decimal',
    }).format(n);
  }

  private _isKeyAllowed(key: string) {
    const allowedKeys = [Keys.backspace, Keys.tab, Keys.arrowLeft, Keys.arrowRight, Keys.delete, Keys.home, Keys.end];
    const input = this._elmRef.nativeElement;
    const value = input.value;
    const state = this._getInputState();

    if (allowedKeys.includes(key)) {
      return true; // allow control/navigation keys
    }

    // Allow one leading minus
    if (key === '-') {
      return (input.selectionStart === 0 || input.selectionEnd === 0) && value.charAt(0) !== '-';
    }

    // Allow one dot for decimal
    if (key === this._decimalSeparator) {
      return (this.numberType() == 'decimal') &&
        (!value.includes(this._decimalSeparator)) &&
        (state.selectionStart == input.value.length);
    }

    // Allow numbers only
    if (/^\d$/.test(key)) {
      if (state.isCursorInsideIntegerPart) {
        return true;
      } else {
        var decimalPart = value.split(this._decimalSeparator)[1];
        var maxFractionDigits = this.maxFractionDigits();
        if (maxFractionDigits != undefined && decimalPart.length < maxFractionDigits) {
          return true;
        } else {
          return input.selectionStart !== input.selectionEnd; // allow a new digit if a substring is selected
        }
      }
    }

    return false;
  }

  private _setProperty(prop: string, value: any) {
    this._renderer.setProperty(this._elmRef.nativeElement, prop, value);
  };
}
