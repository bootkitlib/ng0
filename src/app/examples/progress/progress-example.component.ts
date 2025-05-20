import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressbarModule } from '@bootkit/ng0/progress';

@Component({
    selector: 'app-examples-bootkitpro-components-progress',
    templateUrl: './progress-example.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ProgressbarModule
    ]
})
export class ProgressbarExampleComponent {
    constructor() {
    }
}
