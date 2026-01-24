import { OverlayRef } from "@angular/cdk/overlay";
import { Subject, timer } from "rxjs";
import { ToastConfig } from "./types";

/**
 * A reference to a toast component
 */
export class ToastRef {
    private _closed = false;
    private _disposed = false;
    private _closedSubject = new Subject<any>();

    public closed = this._closedSubject.asObservable();

    constructor(public readonly config: ToastConfig, private overlayRef: OverlayRef) {
    }

    public isOpen() {
        return !this._closed;
    }

    /**
     * Close the toast.
     */
    public close() {
        if (!this._closed) {
            this._closedSubject.next(0);
            this._closed = true;
        }
    }

    public dispose() {
        if (!this._disposed) {
            this.overlayRef.detach();
            this.overlayRef.dispose();
            this._disposed = true;
        }
    }
}
