import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TooltipDirective, TooltipModule } from '@bootkit/ng0/components/tooltip';

@Component({
    selector: 'app-tooltip-example',
    templateUrl: './tooltip-example.component.html',
    standalone: true,
    imports: [
        CommonModule,
        TooltipModule
    ]
})
export class TooltipExampleComponent {
}
