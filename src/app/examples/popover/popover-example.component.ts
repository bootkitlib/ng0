import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PopoverDirective } from '@bootkit/ng0/components/popover';

@Component({
    selector: 'app-popover-example',
    templateUrl: './popover-example.component.html',
    styleUrls: ['./popover-example.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        PopoverDirective
    ]
})
export class PopoverExampleComponent {
}
