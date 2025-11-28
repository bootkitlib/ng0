import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IntersectionObserverDirective } from '@bootkit/ng0/platform/browser';

@Component({
    selector: 'app-examples-platform-browser-intersection-observer',
    templateUrl: './intersection-observer-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        IntersectionObserverDirective
    ]
})
export class IntersectionObserverExampleComponent {

    constructor() {
    }

}
