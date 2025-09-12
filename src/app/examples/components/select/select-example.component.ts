import { CommonModule } from '@angular/common';
import { afterNextRender, Component, OnInit, signal } from '@angular/core';
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
export class SelectExampleComponent implements OnInit {
    source1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    source2 = Array.from({ length: 30 }, (_, i) => i + 1);
    selectedValue1 = 3;

    source3 = [
        { id: 1, name: 'Option 1' },
        { id: 2, name: 'Option 2' },
        { id: 3, name: 'Option 3' },
        { id: 4, name: 'Option 4' },
        { id: 5, name: 'Option 5' },
    ];

    width = signal('200px');

    /**
     *
     */
    constructor() {
        // afterNextRender(() => {
        //     setTimeout(() => {
        //         this.width.set('200px');
        //     }, 2000);
        // })

    }
    ngOnInit(): void {

    }
}
