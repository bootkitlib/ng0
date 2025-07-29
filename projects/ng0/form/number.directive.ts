import { Directive, HostListener, forwardRef, ElementRef, Renderer2, input } from '@angular/core';
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
  /**  */
  minFractionDigits = input<number | undefined>(3);
  maxFractionDigits = input<number| undefined>(10);
  useGrouping = input<boolean>(false);
  numberType = input<'decimal' | 'integer'>('integer');
  private onChange = (_: any) => { };
  private onTouched = () => { };
  private decimalSeparator!: string;
  private thousandsSeparator: string = ',';
  private selectionStart: number = 0;
  private selectionEnd: number = 0;
  private isCursorInsideIntegerPart: boolean = false;
  private decimalSeparatorPosition = -1;
  private value?: number;
  private setProperty = (prop: string, value: any) => this.renderer.setProperty(this.el.nativeElement, prop, value);

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private renderer: Renderer2,
    // private locale: Locale,
  ) { }

  ngOnInit() {
    // Use Intl.NumberFormat to find decimal separator for locale
    const formatted = formatNumber(1.1, 'en', '1.1-1');
    this.decimalSeparator = formatted.replace(/\d/g, '') || '.';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.setProperty('disabled', isDisabled);
  }

  writeValue(value: any): void {
    var inputValue: string;

    if (value === undefined || value === null) {
      inputValue = '';
      this.value = undefined;
    } else if (typeof value === 'number') {
      inputValue = this.formatNumber(value);
      this.value = value;
    }
    else if (typeof value === 'string') {
      const parsedValue = this.value = Number.parseFloat(value);
      inputValue = this.formatNumber(parsedValue);
    } else {
      console.error('NumberDirective: Unsupported value type', value);
      inputValue = 'Invalid';
    }

    this.setProperty('value', inputValue);
  }

  @HostListener('keydown', ['$event'])
  private onKeyDown(event: KeyboardEvent) {
    this.updateCursorInfo();

    if (!this.isKeyAllowed(event.key)) {
      event.preventDefault();
      return;
    }

    const key = event.key;

    if (key == Keys.backspace) {
      if (this.selectionStart > 1 && (this.selectionStart === this.selectionEnd)) {
        let value = this.el.nativeElement.value;
        let beforeSelection = value.charAt(this.selectionStart - 1);
        if (beforeSelection === ',') {
          // If the character before the cursor is a comma, we need to skip it
          this.setProperty('selectionStart', this.selectionStart - 2);
        }
      }
    }
  }

  @HostListener('input', ['$event.target.value'])
  private onInput(s: string) {
    if (s === '') {
      this.value = undefined;
      this.onChange(undefined);
      return;
    }

    this.updateCursorInfo();

    if (this.isCursorInsideIntegerPart) {
      this.formatIntegerPart(s);
    }

    var number = Number(removeChar(this.el.nativeElement.value, this.thousandsSeparator));
    this.value = isNaN(number) ? undefined : number;
    this.onChange(this.value);
  }

  private formatIntegerPart(value: string) {
    // Format the input value
    const integerPart = value.split(this.decimalSeparator)[0];
    const decimalPart = value.split(this.decimalSeparator)[1];

    if (integerPart.length <= 3) {
      return;
    }

    let normalizedIntegerPart = removeChar(integerPart, this.thousandsSeparator); // Remove commas

    let formattedValue = addThousandsSeparator(normalizedIntegerPart);
    if (decimalPart !== undefined) {
      formattedValue += this.decimalSeparator + decimalPart;
    }

    this.setProperty('value', formattedValue);
    let newSelectionStart: number;

    // fix the cursor position after formatting
    if (value.length == 1) {
      newSelectionStart = 1;
    } else {
      const newValueLength = formattedValue.length;
      const cursorJump = newValueLength - value.length;
      newSelectionStart = Math.max(0, this.selectionStart + cursorJump);
    }

    this.setProperty('selectionStart', newSelectionStart);
    this.setProperty('selectionEnd', newSelectionStart);

    // return formattedValue;
  }

  @HostListener('blur')
  private onBlur() {
    if (this.value !== undefined) {
      let formattedValue = this.formatNumber(this.value);
      this.setProperty('value', formattedValue);
    }

    this.onTouched();
  }

  @HostListener('paste', ['$event'])
  private onPaste(event: ClipboardEvent) {
    // event.
    // value = value.trim();
  }

  private updateCursorInfo() {
    let value = this.el.nativeElement.value;
    this.selectionStart = this.el.nativeElement.selectionStart || 0;
    this.selectionEnd = this.el.nativeElement.selectionEnd || 0;

    this.decimalSeparatorPosition = value.indexOf(this.decimalSeparator);
    if (this.decimalSeparatorPosition > -1) {
      this.isCursorInsideIntegerPart = (this.selectionStart <= this.decimalSeparatorPosition);
    } else {
      this.isCursorInsideIntegerPart = true;
    }
  }

  private formatNumber(n: number): string {
    var isInteger = this.numberType() == 'integer';
    return new Intl.NumberFormat('en-US', {
      useGrouping: this.useGrouping(),
      minimumFractionDigits: isInteger ? 0 : this.minFractionDigits(),
      maximumFractionDigits: isInteger ? 0 : this.maxFractionDigits(),
      style: 'decimal',
    }).format(n);
  }

  private isKeyAllowed(key: string) {
    const allowedKeys = [Keys.backspace, Keys.tab, Keys.arrowLeft, Keys.arrowRight, Keys.delete, Keys.home, Keys.end];
    const input = this.el.nativeElement;
    const value = input.value;

    if (allowedKeys.includes(key)) {
      return true; // allow control/navigation keys
    }

    // Allow one leading minus
    if (key === '-') {
      return (input.selectionStart === 0 || input.selectionEnd === 0) && value.charAt(0) !== '-';
    }

    // Allow one dot for decimal
    if (key === this.decimalSeparator) {
      return (this.numberType() == 'decimal') &&
        (!value.includes(this.decimalSeparator)) &&
        (this.selectionStart == input.value.length);
    }

    // Allow numbers only
    if (/^\d$/.test(key)) {
      if (this.isCursorInsideIntegerPart) {
        return true;
      } else {
        var decimalPart = value.split(this.decimalSeparator)[1];
        var maxFractionDigits = this.maxFractionDigits();
        if (maxFractionDigits != undefined && decimalPart.length < maxFractionDigits) {
          return true;
        } else {
          return this.selectionStart !== this.selectionEnd; // allow a new digit if a substring is selected
        }
      }
    }

    return false;
  }
}
