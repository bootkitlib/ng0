import { transition, trigger, useAnimation } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from '@bootkit/ng0/components/select';

@Component({
    selector: 'app-examples-select',
    templateUrl: './select-example.component.html',
    standalone: true,
    imports: [
        CommonModule,
        SelectModule,
        FormsModule
    ]
})
export class SelectExampleComponent {
    source1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    selectedValue1 = 3;

    source2 = [
        { id: 1, name: 'Option 1' },
        { id: 2, name: 'Option 2' },
        { id: 3, name: 'Option 3' },
        { id: 4, name: 'Option 4' },
        { id: 5, name: 'Option 5' },
    ];
}
