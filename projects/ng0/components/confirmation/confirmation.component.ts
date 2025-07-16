import { Component, OnInit } from '@angular/core';
import { ConfirmationConfig, ConfirmationRef } from './types';
import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { LocalizationModule } from '@bootkit/ng0/localization';

@Component({
    selector: 'ng0-confirmation',
    exportAs: 'ng0Confirmation',
    templateUrl: 'confirmation.component.html',
    styleUrls: ['confirmation.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        DialogModule,
        LocalizationModule,
    ],
})
export class ConfirmationComponent implements OnInit {
    confirmationRef!: ConfirmationRef;
    _config?: ConfirmationConfig;
    _clicked = false;

    constructor() {
    }

    _onClick(result: boolean) {
        this._clicked = true;
        if (result) {
            this.confirmationRef.confirm();
        } else {
            this.confirmationRef.cancel();
        }

        if (this._config?.autoClose == null || this._config?.autoClose === true) {
            this.confirmationRef.close();
        }
    }

    ngOnInit(): void {
        this.confirmationRef.configChanged.subscribe(x => this._config = x);
        // var addClass = (c: string) => this._renderer.addClass(this._element.nativeElement, c);

        // ['card', 'show'].forEach(c => addClass(c));
        // if (this.config?.color) {
        //     addClass('text-bg-' + this.config?.color);
        // }
    }
}
