import { ElementRef, input, OnInit, PLATFORM_ID, Directive, OnDestroy, Output, EventEmitter, inject, Renderer2, booleanAttribute } from '@angular/core';
import { isPlatformServer } from '@angular/common';

/**
 * Directive that observes the intersection of an element with the viewport and optionally applies CSS classes when the element enters or leaves the viewport.
 * It uses the Intersection Observer API to monitor visibility changes.
 * It can be used to trigger animate-on-scroll (AOS) animations, lazy loading, or other actions based on element visibility.
 */
@Directive({
    selector: '[ng0IntersectionObserver]',
    exportAs: 'ng0IntersectionObserver',
    standalone: true
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
    private readonly _platformId = inject(PLATFORM_ID);
    private readonly _elementRef = inject(ElementRef);
    private readonly _renderer = inject(Renderer2);
    private _entered?: boolean;
    private _observer?: IntersectionObserver;
    private _addClass(c: string) { this._renderer.addClass(this._elementRef.nativeElement, c) };
    private _removeClass(c: string) { this._renderer.removeClass(this._elementRef.nativeElement, c) };

    /**
     * Threshold(s) at which to trigger the intersection callback.
     * Can be a single number or an array of numbers between 0 and 1.
     * For example, 0.5 means the callback will be triggered when 50% of the element is visible in the viewport.
     */
    public readonly threshold = input<number | number[] | undefined>();

    /**
     * Root element to use for intersection observation. 
     * If not provided, the viewport (browser window) is used as the root.
     */
    public readonly root = input<Element | Document | null | undefined>();

    /**
     * Root margin to apply to the intersection observer.
     * This can be a string similar to the CSS margin property, e.g., '10px 20px 30px 40px'.
     * It defines the margin around the root element (viewport) to consider for intersection.
     */
    public readonly rootMargin = input<string | undefined>();

    /**
     * Css class to apply when the element enters the viewport.
     */
    public readonly enterClass = input<string | undefined>();

    /**
     * Css class to apply when the element leaves the viewport.
     */
    public readonly leaveClass = input<string | undefined>();

    /**
     * Whether to observe only once (true) or continuously (false).
     * If true, the observer will disconnect after the first intersection event.
     * @default false
     */
    public readonly once = input(false, { transform: booleanAttribute });

    /**
     * Event emitted when the element enters the viewport.
     */
    @Output() public readonly enter = new EventEmitter<IntersectionObserverEntry>();

    /**
     * Event emitted when the element leaves the viewport.
     * This event will only be emitted if the element has previously entered the viewport.
     */
    @Output() public readonly leave = new EventEmitter<IntersectionObserverEntry>();


    ngOnInit(): void {
        if (isPlatformServer(this._platformId)) {
            return;
        }

        this._setupObserver();
    }

    private _setupObserver() {
        this._observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (this.enterClass()) {
                            this._addClass(this.enterClass()!);
                        }
                        if (this._entered === false && this.leaveClass()) {
                            this._removeClass(this.leaveClass()!);
                        }

                        this._entered = true;
                        this.enter.emit(entry);

                        if (this.once()) {
                            this.disconnect();
                        }
                    } else {
                        if (this._entered) {
                            if (this.leaveClass()) {
                                this._addClass(this.leaveClass()!);
                            }
                            if (this.enterClass()) {
                                this._removeClass(this.enterClass()!);
                            }

                            this._entered = false;
                            this.leave.emit(entry);

                            if (this.once()) {
                                this.disconnect();
                            }
                        }
                    }
                });
            },
            {
                root: this.root(),
                threshold: this.threshold(),
                rootMargin: this.rootMargin()
            }
        );

        this._observer.takeRecords(); // Clear initial records
        this._observer.observe(this._elementRef.nativeElement);
    }

    /**
     * Disconnects the intersection observer.
     * This stops all observation and releases resources.
     */
    public disconnect(): void {
        this._observer?.disconnect();
    }

    ngOnDestroy(): void {
        this.disconnect();
    }
}
