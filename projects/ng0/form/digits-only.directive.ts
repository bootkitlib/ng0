import { Directive, ElementRef, Host, HostListener, Input } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[iscDigitsOnly]',
  exportAs: 'iscDigitsOnly',
})
export class DigitsOnlyDirective {

  constructor(private elementRef: ElementRef) {
  }

  @HostListener('keydown', ['$event']) private onKeyDown(e: KeyboardEvent) {
    var allowedKeys = ['Tab', 'Backspace', 'ArrowLeft', 'ArrowRight'];
    if (!isFinite(e.key as any) && !allowedKeys.some(k => e.key == k)) {
      e.preventDefault()
    }
  }
}
