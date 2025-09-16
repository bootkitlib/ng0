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
export class SelectExampleComponent {
    stringArray = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
    numberArray = Array.from({ length: 30 }, (_, i) => i + 1);
    objects1 = [
        { id: 1, name: 'Option 1' },
        { id: 2, name: 'Option 2' },
        { id: 3, name: 'Option 3' },
        { id: 4, name: 'Option 4' },
        { id: 5, name: 'Option 5' },
    ];

    stringValue1?: string;
    numberValue1?: number;
    booleanValue1?: boolean;
    booleanValue2?: boolean;
    booleanValue3?: boolean;
    booleanValue4?: boolean;
    selectedObjectId1?: number;
    selectedObjectId2?: number;
    selectedObjectId3?: number;
    selectedObjectId4?: number;
    selectedObjectId5?: number;
    stringValue2?: string;

    Sexuality = getEnumValues(Sexuality);

    enum1?: boolean;

    width = signal('200px');

}
