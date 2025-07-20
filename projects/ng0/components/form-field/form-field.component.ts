import { CommonModule } from '@angular/common';
import { DestroyRef, HostListener, input, signal } from '@angular/core';
import { Component, Input, ContentChild, AfterContentInit, Optional, HostBinding, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, NgControl, NgForm } from '@angular/forms';
import { Locale, LocalizationService } from '@bootkit/ng0/localization';

@Component({
  selector: 'ng0-form-field, ng0-field',
  exportAs: 'ng0FormField',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ],
})
export class FormFieldComponent implements OnInit, AfterContentInit, OnDestroy {

  /**
   * The label text for the form field.
   */
  public label = input<string>();

  /**
   * The hint text to display below the form field.
   * This is typically used to provide additional information or instructions to the user.
   */
  public hint = input<string>();

  /**
   * If true, the form-field will show validation errors.
   * This is useful for displaying validation messages when the form control is invalid.
   */
  public showErrors = input(true);

  /**
   * If true, the form-field will show a red asterisk for required fields.
   * This is only a visual indicator and does not enforce validation.
   */
  public showRequiredIndicator = input(true);

  /**
   * If true, the form-field will show subscripts (e.g. hints, errors) for the field label.
   * This is useful for displaying additional information or validation messages.
   */
  public showSubscripts = input(true);

  /**
   * If true, the form-field will be rendered inside a ".input-group" element.
   */
  public inputGroup = input(true);

  /**
   * Returns the first localized error of the control 
   */
  public get errorText() { return this._errorText; }

  /** Reports whether the control is touched. */
  public get touched(): boolean | null | undefined { return this._ngControl?.touched; }

  /** Reports whether the control is dirty. */
  public get dirty(): boolean | null | undefined { return this._ngControl?.dirty; }

  /** Returns true if this form-field is required, otherwise returns false. */
  @HostBinding('class.required-form-field')
  public get isRequired(): boolean { return this._isRequired; }

  @HostListener('focusout')
  private _onFocusOut() { this._validate(); }

  @ContentChild(NgControl, { static: true })
  private _ngControl?: NgControl;

  @ContentChild(NgControl, { static: true, read: ElementRef })
  private _ngControlElement?: ElementRef;

  private _isRequired = false;
  private _locale?: Locale;
  private _errorText?: string;

  constructor(
    private _renderer: Renderer2,
    private _destroyRef: DestroyRef,
    @Optional() private _form: NgForm,
    private _ls: LocalizationService,
  ) {
    this._locale = this._ls.get();
    this._ls.change.pipe(takeUntilDestroyed()).subscribe(e => this._locale = e.new);
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    this._isRequired = this._isRequiredField();

    if (this._ngControl) {
      this._ngControl?.statusChanges?.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(change => {
        this._validate();
      });
    }
  }

  private _validate() {
    if (!this._ngControl || !this.dirty || !this.touched) {
      return;
    }

    const invalid = this._ngControl.status === 'INVALID';
    if (invalid) {
      this._errorText = this._locale?.translateFirstError(this._ngControl.errors, 'Invalid')?.text;
    } else {
      this._errorText = undefined;
    }
    this._renderer.addClass(this._ngControlElement!.nativeElement, invalid ? 'is-invalid' : 'is-valid');
    this._renderer.removeClass(this._ngControlElement!.nativeElement, invalid ? 'is-valid' : 'is-invalid');
  }

  private _isRequiredField(): boolean {
    const validator = this._ngControl?.validator;
    const errors = validator && validator(new FormControl(null));
    return errors != null && errors['required'] === true;
  }

  ngOnDestroy(): void {
  }
}
