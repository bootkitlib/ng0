import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalizationModule, createNumberFormatter } from '@bootkit/ng0/localization';
import { Sexuality } from 'src/app/common/enums';

enum Enum1 {
    done = 'Done',
    failed = 'Failed',
}

@Component({
    selector: 'app-example-localization-formatters',
    templateUrl: './formatters-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        LocalizationModule
    ]
})
export class FormattersExampleComponent {
    Sexuality = Sexuality;
    object1 = { name: 'Sample Name', age: 25 };
    numberFormatter = createNumberFormatter;

    examples = {
        fieldFormatter: {
            value: { name: 'Test', age: 30 },
        },
        enumFormatter: {
            value: Sexuality.male,
        },
        indexFormatter: {
            value: ['First', 'Second', 'Third'],
        },
        date: {
            value1: new Date(),
        }
    }
}
