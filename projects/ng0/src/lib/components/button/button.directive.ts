import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Input, Directive, HostListener, Output, EventEmitter, Renderer2, ElementRef, OnInit } from '@angular/core';
import { ButtonSize, ButtonKind } from './types';

@Directive({
  selector: 'button[jssButton], a[jssButton], input[jssButton]',
  exportAs: 'jssButton',
  host: {
    '[class.disabled]': 'disabled',

    '[class.btn-primary]': '!outline && kind=="primary"',
    '[class.btn-secondary]': '!outline && kind=="secondary"',
    '[class.btn-success]': '!outline && kind=="success"',
    '[class.btn-danger]': '!outline && kind=="danger"',
    '[class.btn-warning]': '!outline && kind=="warning"',
    '[class.btn-info]': '!outline && kind=="info"',
    '[class.btn-light]': '!outline && kind=="light"',
    '[class.btn-dark]': '!outline && kind=="dark"',
    '[class.btn-link]': 'kind=="link"',

    '[class.btn-outline-primary]': 'outline && kind=="primary"',
    '[class.btn-outline-secondary]': 'outline && kind=="secondary"',
    '[class.btn-outline-success]': 'outline && kind=="success"',
    '[class.btn-outline-danger]': 'outline && kind=="danger"',
    '[class.btn-outline-warning]': 'outline && kind=="warning"',
    '[class.btn-outline-info]': 'outline && kind=="info"',
    '[class.btn-outline-light]': 'outline && kind=="light"',
    '[class.btn-outline-dark]': 'outline && kind=="dark"',

    '[class.btn-sm]': 'size=="small"',
    '[class.btn-lg]': 'size=="large"',

    '[attr.disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled',
    '[attr.tabindex]': 'disabled ? "-1" : "" ',
  }
})
export class ButtonDirective implements OnInit {
  private _disabled = false;

  get disabled() { return this._disabled; }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }
  @Input() size: ButtonSize = 'default';
  @Input() kind: ButtonKind = 'primary';
  @Output() safeClick = new EventEmitter<MouseEvent>();

  constructor(private _element: ElementRef, private _renderer: Renderer2) {
  }

  ngOnInit(): void {
    this._renderer.addClass(this._element.nativeElement, 'btn');
  }

  @HostListener('click', ['$event']) private _onClick(e): void {
    if (!this.disabled) {
      this.safeClick.emit(e);
    }
  }
}
