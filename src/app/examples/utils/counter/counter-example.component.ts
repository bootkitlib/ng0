import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Counter, easingFunctions } from '@bootkit/ng0/utils';

@Component({
    selector: 'app-examples-utils-counter',
    templateUrl: './counter-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule
    ]
})
export class CounterExampleComponent {
    public _counter1 = new Counter(0, 100, 3000, easingFunctions.smooth);

    constructor() {
    }
}
