import { OverlayRef } from "@angular/cdk/overlay";
import { Subject, timer } from "rxjs";
import { ToastConfig } from "./types";

export class ToastRef {
    private _isOpen = true;
    private _closedSubject = new Subject<any>();
    public closed = this._closedSubject.asObservable();

    constructor(public readonly config: ToastConfig, private overlayRef: OverlayRef) {
    }

    public get isOpen() {
        return this._isOpen;
    }

    public close() {
        if (this._isOpen) {
            this._closedSubject.next(0);
            this._isOpen = false;

            // Wait to ':leave' animation is done and then dispose the overlay
            timer(100).subscribe(x => {
                this.overlayRef.detach();
                this.overlayRef.dispose();
            });
        }
    }
}
