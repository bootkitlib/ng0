import { Directive, Renderer2, ElementRef, OnInit, OnDestroy, input, DestroyRef, model, booleanAttribute, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpService } from '@bootkit/ng0/http';

@Directive({
  selector: 'button[ng0Button], a[ng0Button], input[type=button][ng0Button], input[type=submit][ng0Button], input[type=reset][ng0Button]',
  exportAs: 'ng0Button',
  standalone: true,
  host: {
    '[class.disabled]': 'disabled()',
    '[prop.disabled]': 'disabled()',
    '[attr.aria-disabled]': 'disabled()',
    '[attr.tabindex]': 'disabled() ? "-1" : "" ',
  }
})
export class ButtonDirective implements OnInit, OnDestroy {
  private _loadingElement: any;

  /**
   * The IDs of the HTTP requests that this button listens to.
   * If one of these requests is in progress, it will show a loading indicator or will be disabled based on 'showLoading' and 'disableOnLoading' properties.
   */
  public request = input<string | string[] | undefined>(undefined);

  /** 
   * Whether the button is disabled or not.
   */
  public disabled = model<boolean>(false);

  /**
   * Whether to wait for the HTTP response before enabling the button again.
   * If true, the button will remain disabled until the HTTP request completes.
   * This is useful for preventing multiple clicks while waiting for a response.
   * Default is true.
   */
  public disableDuringRequest = input(true, { transform: booleanAttribute });

  /**
   * Whether to show a loading indicator when the HTTP request is in progress.
   * If true, a loading spinner will be displayed on the button while the request is being processed.
   * Default is true.
   */
  public loadingIndicator = input(false, { transform: booleanAttribute });

  private _element = inject(ElementRef);
  private _renderer = inject(Renderer2);
  private _http = inject(HttpService);
  private _destroyRef = inject(DestroyRef);

  constructor() {
  }

  ngOnInit(): void {
    this._renderer.setStyle(this._element.nativeElement, "position", "relative");

    if (this.request()) {
      this._http.events.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(e => {
        var ids = (Array.isArray(this.request()) ? this.request() : [this.request()]) as string[];

        if (ids.includes(e?.options?.id)) {
          let requestInProgress = e.type === 'Send' || e.type === 'Progress';

          if (this.disableDuringRequest()) {
            this.disabled.set(requestInProgress);
          }

          if (this.loadingIndicator()) {
            if (requestInProgress) {
              this._showLoading();
            } else {
              this._hideLoading();
            }
          }
        }
      });
    }
  }

  // @HostListener('click', ['$event']) private _onClick(e: MouseEvent): void {
  //   if (!this._disabled) {
  //   }
  // }

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
  }
}
