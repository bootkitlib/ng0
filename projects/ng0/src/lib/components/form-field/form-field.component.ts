import { Component, Input, ContentChild, AfterContentInit, Optional, HostBinding, Inject, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { FormControl, NgControl, NgForm } from '@angular/forms';
import { Locale, LOCALE, LocaleProvider, FormValidationError } from '@js-sugar/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'jss-form-field, jss-field',
  exportAs: 'uisFormField',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
})
export class FormFieldComponent implements OnInit, AfterContentInit, OnDestroy {
  @Input() label: string;
  @Input() hint: string;
  @Input() showErrors = true;
  @Input() showRequiredMarker = true;
  @ContentChild(NgControl, { static: true }) private _ngControl: NgControl;
  @ContentChild(NgControl, { static: true, read: ElementRef }) private _ngControlElement: ElementRef;
  private _isRequired: boolean;
  private _subscription: Subscription;
  private _firstError: FormValidationError;
  private _locale: Locale;

  /** Returns the first (localized) error of the control */
  get firstError() { return this._firstError; }

  /** Returns true if this form-field is required, otherwise returns false. */
  @HostBinding('class.required-form-field') get isRequired(): boolean { return this._isRequired; }

  /** Reports whether the control is touched. */
  get touched(): boolean { return this._ngControl.touched; }

  /** Reports whether the control is dirty. */
  get dirty(): boolean { return this._ngControl.dirty; }

  constructor(
    @Optional() private _form: NgForm,
    @Optional() @Inject(LOCALE) private _l: Locale | LocaleProvider,
    private _renderer: Renderer2) {
  }

  ngOnInit(): void {
    if (!this._ngControl) {
      throw Error('FormFieldComponent requires a NgControl');
    }

    if (this._l) {
      this._locale = this._l instanceof Locale ? this._l : this._l.get();
    }
  }

  ngAfterContentInit(): void {
    this._isRequired = this._isRequiredField();
    this._subscription = this._ngControl.statusChanges.subscribe(change => this._onStatusChange(change));
  }

  private _onStatusChange(status: any): void {
    const invalid = status === 'INVALID';
    if (invalid) {
      const errors = this._ngControl.errors;
      const key = Object.keys(errors)[0];
      const text = this._locale ? this._locale.translateFirstError(errors) : null;
      this._firstError = { key, text };
    } else {
      this._firstError = null;
    }

    if (this.dirty) {
      this._renderer.addClass(this._ngControlElement.nativeElement, invalid ? 'is-invalid' : 'is-valid');
      this._renderer.removeClass(this._ngControlElement.nativeElement, invalid ? 'is-valid' : 'is-invalid');
    }
  }

  private _isRequiredField(): boolean {
    const validator = this._ngControl?.validator;
    const errors = validator && validator(new FormControl(null));
    return errors != null && errors.required === true;
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
}
