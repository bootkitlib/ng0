import { signal, TemplateRef, WritableSignal } from "@angular/core";
import { CssClass } from "@bootkit/ng0/common";
import { SidenavMode, SidenavPosition, SidenavSize } from "@bootkit/ng0/components/sidenav";
import { Subject } from "rxjs";

/**
 * Represents a secondary sidenav options in the Layout1Component.
 */
export interface Layout1SecondarySidenavOptions {
    size?: SidenavSize;
    zIndex?: number;
    position?: SidenavPosition;
    mode?: SidenavMode;
    fixedInViewport?: boolean;
    hasBackdrop?: boolean;
    css?: CssClass;
    closeOnBackdropClick?: boolean
}

/**
 * Reference to a secondary sidenav in the Layout1Component.
 */
export class Layout1SecondarySidenav {
    private _disposedSubject = new Subject<any>();
    private _isDisposed = false;

    /**
     * Observable that emits when the sidenav is disposed.
     */
    public readonly disposed = this._disposedSubject.asObservable();

    /**
     * template of the sidenav content.
     */
    public readonly template: TemplateRef<any>;

    /**
     * Z-Index of the sidenav.
     */
    public readonly zIndex: WritableSignal<number | undefined>;

    /**
     * Sidenav css classes.
     */
    public readonly css: WritableSignal<CssClass>;

    /**
     * Size of the sidenav.
     */
    public readonly size: WritableSignal<SidenavSize>;

    /**
     * Position of the sidenav.
     */
    public readonly position: WritableSignal<SidenavPosition>;

    /**
     * Mode of the sidenav.
     */
    public readonly mode: WritableSignal<SidenavMode>;

    /**
     * Whether the sidenav has a backdrop.
     */
    public readonly hasBackdrop: WritableSignal<boolean>;

    /**
     * Whether the sidenav should close on backdrop click.
     */
    public readonly closeOnBackdropClick: WritableSignal<boolean>;

    /**
     * Whether the sidenav is disposed.
     */
    public get isDisposed() {
        return this._isDisposed;
    }

    constructor(template: TemplateRef<any>, options?: Layout1SecondarySidenavOptions) {
        this.template = template;
        this.zIndex = signal(options?.zIndex);
        this.css = signal(options?.css);
        this.size = signal(options?.size);
        this.position = signal(options?.position ?? 'start');
        this.mode = signal(options?.mode ?? 'over');
        this.hasBackdrop = signal(options?.hasBackdrop ?? true);
        this.closeOnBackdropClick = signal(options?.closeOnBackdropClick ?? false);
    }

    /**
     * Close and dispose the sidenav.
     * @param result Optional result to emit when the sidenav is closed.
     */
    public dispose(result?: any): void {
        if (!this._isDisposed) {
            this._isDisposed = true;
            this._disposedSubject.next(result);
        }
    }
}
