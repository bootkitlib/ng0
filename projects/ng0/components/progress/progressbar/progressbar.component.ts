import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ng0-progressbar',
    exportAs: 'ng0Progressbar',
    templateUrl: './progressbar.component.html',
    styleUrls: ['./progressbar.component.scss'],
    standalone: true,
    imports: [
        CommonModule
    ],
})
export class ProgressbarComponent {
    // public activeStep = model(0);
    // @ContentChildren(StepDirective) protected _steps!: QueryList<StepDirective>;

    constructor() {
    }
}
