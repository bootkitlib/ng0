import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ng0-progress',
    exportAs: 'ng0Progress',
    templateUrl: './progress.component.html',
    styleUrls: ['./progress.component.scss'],
    standalone: true,
    imports: [
        CommonModule
    ],
})
export class ProgressComponent {
    // public activeStep = model(0);
    // @ContentChildren(StepDirective) protected _steps!: QueryList<StepDirective>;

    constructor() {
    }
}
