import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Input, Directive, HostListener, Output, EventEmitter, Renderer2, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { HttpRequestSendEvent, HttpService } from '@bootkit/ng0/http';
import { Subscription } from 'rxjs';

@Directive({
  selector: 'button[ng0Button], a[ng0Button], input[ng0Button]',
  exportAs: 'ng0Button',
  standalone: true,
  host: {
    '[class.disabled]': 'disabled',
    '[prop.disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled',
    '[attr.tabindex]': 'disabled ? "-1" : "" ',
  }
})
export class ButtonDirective implements OnInit, OnDestroy {
  private _disabled = false;
  private _httpEventSubscription?: Subscription;
  private _loadingElement: any;

  get disabled() { return this._disabled; }
  set disabled(value: BooleanInput) {
    this._disabled = coerceBooleanProperty(value);
  }

  /** Disable the button when some http requests with specified IDs. */
  @Input() disableOn = new Array<string>();
  @Input() showLoadingOn = new Array<string>();

  // Disables and show loading icon on http requests with specified IDs.
  @Input() waitFor = new Array<string>();

  @Output() safeClick = new EventEmitter<MouseEvent>();

  constructor(private _element: ElementRef, private _renderer: Renderer2, private http: HttpService) {
  }

  ngOnInit(): void {
    this._renderer.setStyle(this._element.nativeElement, "position", "relative");

    if (this.waitFor.length > 0) {
      this.disableOn = [...this.disableOn, ...this.waitFor];
      this.showLoadingOn = [...this.showLoadingOn, ...this.waitFor];
    }

    if (this.disableOn || this.showLoadingOn) {
      this._httpEventSubscription = this.http.events.subscribe(e => {
        if (this.disableOn?.find(x => x == e?.options?.id)) {
          if (e instanceof HttpRequestSendEvent) {
            this.disabled = true;
          } else {
            this.disabled = false;
          }
        }

        if (this.showLoadingOn?.find(x => x == e?.options?.id)) {
          if (e instanceof HttpRequestSendEvent) {
            this._showLoading();
          } else {
            this._hideLoading();
          }
        }
      });
    }
  }

  @HostListener('click', ['$event']) private _onClick(e: MouseEvent): void {
    if (!this._disabled) {
      this.safeClick.emit(e);
    }
  }

  private _showLoading() {
    this._loadingElement = this._renderer.createElement("div");
    ["spinner-grow", "spinner-grow-sm", "text-warning"].forEach(s => this._renderer.addClass(this._loadingElement, s));
    this._renderer.setStyle(this._loadingElement, "position", "absolute");
    this._renderer.setStyle(this._loadingElement, "top", "-25%");
    this._renderer.setStyle(this._loadingElement, "left", "-5px");
    this._renderer.appendChild(this._element.nativeElement, this._loadingElement);
  }

  private _hideLoading() {
    this._renderer.removeChild(this._element.nativeElement, this._loadingElement);
  }

  ngOnDestroy(): void {
    this._httpEventSubscription?.unsubscribe();
  }
}
