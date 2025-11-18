import { ElementRef, Renderer2, effect, HostListener, Directive, input, Output, EventEmitter, OnDestroy, afterNextRender, untracked, booleanAttribute } from '@angular/core';

@Directive({
    selector: '[ng0Offcanvas]',
    exportAs: 'ng0Offcanvas',
    standalone: true,
})
export class OffcanvasDirective implements OnDestroy {
    /**
     * Whether to show the offcanvas element.
     */
    public show = input(false, { transform: booleanAttribute });

    /**
     * Whether to show a backdrop element behind the offcanvas.
     */
    public hasBackdrop = input(false, { transform: booleanAttribute });

    /**
     * Emitted when the backdrop is clicked.
     */
    @Output() public backdropClick = new EventEmitter<MouseEvent>;

    private _firstShowEffectRun = true;
    private _firstBackdropEffectRun = true;
    private _backdropElement?: any;
    private _backdropClickUnlistenFunc?: any;
    private _backdropTransitionendUnlistenFunc?: any;
    private addClass = (c: string) => this._renderer.addClass(this._el.nativeElement, c);

    constructor(private _el: ElementRef, private _renderer: Renderer2) {

        afterNextRender(() => {
            if (this.show() && this.hasBackdrop()) {
                this._createBackdrop();
            }
        });

        effect(() => {
            var show = this.show();
            var backdrop = untracked(() => this.hasBackdrop());

            if (this._firstShowEffectRun) {
                if (show) {
                    this.addClass('show');
                }
                this._firstShowEffectRun = false;
                return;
            }


            if (show) {
                this.addClass('show');
                if (backdrop)
                    this._createBackdrop();
            } else {
                this.addClass('hiding');
                this._hideBackdrop(); // we first hide backdrop, after hide transition completed, we destroy it.
            }
        });

        effect(() => {
            var backdrop = this.hasBackdrop();
            var show = untracked(() => this.show());

            if (this._firstBackdropEffectRun) {
                this._firstBackdropEffectRun = false;
                return;
            }

            if (show) {
                if (backdrop)
                    this._createBackdrop();
                else
                    this._destroyBackdrop();
            }
        });
    }


    private _createBackdrop() {
        if (!this._backdropElement) {
            this._backdropElement = this._renderer.createElement('div');
            ['offcanvas-backdrop', 'fade', 'show'].forEach(c => this._renderer.addClass(this._backdropElement, c));

            // Append the new element next to the host element
            const parent = this._renderer.parentNode(this._el.nativeElement);
            const nextSibling = this._renderer.nextSibling(this._el.nativeElement);
            this._renderer.insertBefore(parent, this._backdropElement, nextSibling);

            this._backdropClickUnlistenFunc = this._renderer.listen(this._backdropElement, 'click', (e) => {
                this.backdropClick.emit(e);
            });

            this._backdropTransitionendUnlistenFunc = this._renderer.listen(this._backdropElement, 'transitionend', (e) => {
                if (!this.show()) {
                    this._destroyBackdrop();
                }
            });
        }
    }

    private _destroyBackdrop() {
        if (this._backdropElement) {
            const parent = this._renderer.parentNode(this._el.nativeElement);
            this._renderer.removeChild(parent, this._backdropElement, false);
            this._backdropClickUnlistenFunc()

            this._backdropClickUnlistenFunc = undefined;
            this._backdropElement = undefined
        }
    }

    private _hideBackdrop() {
        if (this._backdropElement) {
            this._renderer.removeClass(this._backdropElement, 'show');
        }
    }

    @HostListener('transitionend', ['$event'])
    private _onTransitionend(e: TransitionEvent): void {
        if (!this.show() && e.propertyName == 'transform') {
            ['show', 'hiding'].forEach(x => this._renderer.removeClass(this._el.nativeElement, x));
            // if (this.backdrop())
            //     this._destroyBackdrop();
        }
    }

    ngOnDestroy(): void {
        this._destroyBackdrop()
    }
}
