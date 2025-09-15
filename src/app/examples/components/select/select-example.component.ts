import { CommonModule } from '@angular/common';
import { afterNextRender, Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getEnumValues } from '@bootkit/ng0/common';
import { SelectModule } from '@bootkit/ng0/components/select';

enum Sexuality {
    male = 'Male',
    female = 'Female',
    other = 'Other'
}


@Component({
    selector: 'app-examples-select',
    templateUrl: './select-example.component.html',
    standalone: true,
    imports: [
        CommonModule,
        SelectModule,
        FormsModule,
    ]
})
export class SelectExampleComponent implements OnInit {
    stringArray = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
    numberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    source2 = Array.from({ length: 30 }, (_, i) => i + 1);

    stringValue1?: string;
    numberValue1?: number;
    booleanValue1?: boolean;
    booleanValue2?: boolean;
    booleanValue3?: boolean;
    booleanValue4?: boolean;

    Sexuality = getEnumValues(Sexuality);

    enum1?: boolean;

    objects1 = [
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
