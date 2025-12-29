import { CommonModule } from '@angular/common';
import { booleanAttribute, ChangeDetectionStrategy, DestroyRef, ElementRef, HostListener, inject, input, Renderer2, signal, ViewEncapsulation } from '@angular/core';
import { Component, ContentChild, AfterContentInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, NgControl } from '@angular/forms';
import { LocalizationService } from '@bootkit/ng0/localization';

@Component({
  selector: 'ng0-form-field, ng0-field',
  exportAs: 'ng0FormField',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
  host: {
    '[class.ng0-form-field-required]': '_hasRequiredControl()',
  }
})
export class FormFieldComponent implements AfterContentInit {
  @ContentChild(NgControl, { static: true, read: ElementRef }) private _ngControlElement?: ElementRef;
  private _destroyRef = inject(DestroyRef);
  private _renderer = inject(Renderer2);
  private _localizationService = inject(LocalizationService);
  // private _form = inject(NgForm, { optional: true });
  @ContentChild(NgControl) protected _ngControl?: NgControl;
  protected _status = signal<string | null>('');
  protected _hasRequiredControl = signal(false);
  protected _errorText = signal<string | undefined>(undefined);

  /**
   * The label text for the form field.
   */
  public readonly label = input<string>();

  /**
   * The hint text to display below the form field.
   */
  public readonly hint = input<string>();

  /**
   * If true, the form-field will show validation errors.
   */
  public readonly showErrors = input(true, { transform: booleanAttribute });

  /**
   * If undefined, the indicator will be shown based on the control's required state.
   * If true, the form-field will show a required indicator (*) next to the label (regardless of the control's required state).
   * If false, the required indicator will not be shown (regardless of the control's required state).
   */
  public readonly showRequired = input<boolean | undefined>(undefined);

  /**
   * If true, the form-field will show subscripts (e.g. hints, errors) for the field label.
   */
  public readonly showSubscripts = input(true, { transform: booleanAttribute });

  /**
   * If true, the form-field will be rendered inside a ".input-group" element.
   */
  public readonly inputGroup = input(true, { transform: booleanAttribute });

  ngAfterContentInit(): void {
    this._hasRequiredControl.set(this._isControlRequired());

    if (this._ngControl) {
      this._status.set(this._ngControl.status);

      this._ngControl.statusChanges?.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(change => {
        this._status.set(change);
        this._checkValidation();
      });

      this._ngControl.valueChanges?.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(value => {
        if (this._status() === 'INVALID' && this._ngControl!.errors) {
          this._checkValidation(); // Recheck validation errors
        }
      });
    }
  }

  private _checkValidation() {
    if (!this._ngControl || !this._ngControl.touched) {
      return;
    }

    let elm = this._ngControlElement!.nativeElement;
    let invalid = this._status() === 'INVALID';
    let errorText = invalid ?
      this._localizationService.get()?.translateFirstError(this._ngControl!.errors, 'Invalid')?.text :
      undefined;

    this._errorText.set(errorText);
    this._renderer.addClass(elm, invalid ? 'is-invalid' : 'is-valid');
    this._renderer.removeClass(elm, invalid ? 'is-valid' : 'is-invalid');
  }

  private _isControlRequired(): boolean {
    const validator = this._ngControl?.validator || this._ngControl?.control?.validator;
    const errors = validator && validator(new FormControl(null));
    return errors != null && errors['required'] === true;
  }

  @HostListener('focusout')
  protected _onFocusOut() {
    this._checkValidation();
  }
}
