import { DialogRef } from "@angular/cdk/dialog";
import { BehaviorSubject, Subject } from "rxjs";

export interface ConfirmationConfig {
    message?: string;
    title?: string;
    // color?: BootstrapColor,
    icon?: 'loading' | 'check';
    /** automaticaly close confirmation after confirmation/cancelation. default is true */
    autoClose?: boolean;
}

export class ConfirmationRef {
    private _configChangeSubject = new Subject<ConfirmationConfig>();
    public configChanged = this._configChangeSubject.asObservable();

    private _confirmSubject = new Subject();
    public confirmed = this._confirmSubject.asObservable();

    private _cancelSubject = new Subject();
    public canceled = this._cancelSubject.asObservable();

    constructor(private _dialogRef: DialogRef<any, any>, private _config: ConfirmationConfig) {
    }

    confirm() {
        this._confirmSubject.next(undefined);
    }

    cancel() {
        this._cancelSubject.next(undefined);
    }

    close() {
        this._dialogRef.close();
    }

    update(config: ConfirmationConfig) {
        for (const key in config as any) {
            if (Object.prototype.hasOwnProperty.call(config, key)) {
                const element = (config as any)[key];
                if(element !== undefined) {
                    (this._config as any)[key] = element;
                }
            }
        }

        this._configChangeSubject.next(this._config);
    }
}
