import { Component, ContentChildren, QueryList, model } from '@angular/core';
import { StepDirective } from './step.directive';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ng0-stepper',
    exportAs: 'ng0Stepper',
    templateUrl: './stepper.component.html',
    styles: `:host{display: block}`,
    standalone: true,
    imports: [
        CommonModule
    ],
})
export class StepperComponent {
    public readonly step = model.required<any>();
    @ContentChildren(StepDirective) protected _steps!: QueryList<StepDirective>;
}
