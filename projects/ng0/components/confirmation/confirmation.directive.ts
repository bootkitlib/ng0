import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ConfirmationService } from './confirmation.service';
import { ConfirmationConfig, ConfirmationRef } from './types';

@Directive({
  selector: '[ng0Confirmation]',
  exportAs: 'ng0Confirmation',
  standalone: true
})
export class ConfirmationDirective {
  @Input() config?: ConfirmationConfig;
  @Output() confirm = new EventEmitter<ConfirmationRef>();
  @Output() cancel = new EventEmitter<ConfirmationRef>();

  constructor(private confirmationService: ConfirmationService) {
  }

  @HostListener('click') private _onClick() {
    var ref = this.confirmationService.open(this.config);
    ref.confirmed.subscribe(x => this.confirm.emit(ref));
    ref.canceled.subscribe(x => this.cancel.emit(ref));
  }
}
