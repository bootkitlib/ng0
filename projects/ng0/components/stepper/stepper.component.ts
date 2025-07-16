import { Component, ContentChildren, QueryList, model } from '@angular/core';
import { StepDirective } from './step.directive';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'ng0-stepper',
    exportAs: 'ng0Stepper',
    templateUrl: './stepper.component.html',
    styles: `:host{display: block}`,
    standalone: true,
    imports: [
        CommonModule
    ],
    animations: [
        trigger('stepAnimation', [
            state('hide', style({
                opacity: 0,
            })),
            state('show', style({
                opacity: 1,
            })),
            transition('show <=> hide', [
                animate('.3s ease-out')
            ])
        ])
    ]
})
export class StepperComponent {
    public step = model.required<any>();
    @ContentChildren(StepDirective) protected _steps!: QueryList<StepDirective>;

    constructor() {
    }
}
