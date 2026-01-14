import { Directive, EventEmitter, HostListener, inject, input, Input, Output } from '@angular/core';
import { ConfirmationService } from './confirmation.service';
import { ConfirmationConfig, ConfirmationRef } from './types';

@Directive({
  selector: '[ng0Confirmation]',
  exportAs: 'ng0Confirmation',
  standalone: true
})
export class ConfirmationDirective {
  private _confirmationService = inject(ConfirmationService);

  public readonly config = input<ConfirmationConfig>();
  @Output() public readonly confirm = new EventEmitter<ConfirmationRef>();
  @Output() public readonly cancel = new EventEmitter<ConfirmationRef>();

  @HostListener('click')
  protected _onClick() {
    var ref = this._confirmationService.open(this.config());
    ref.confirmed.subscribe(x => this.confirm.emit(ref));
    ref.canceled.subscribe(x => this.cancel.emit(ref));
  }
}
