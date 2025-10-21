import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalizationModule, LocalizationService } from '@bootkit/ng0/localization';
import { FA_IR_LOCALE } from '@bootkit/ng0/localization/locales/fa-ir';
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
    
    fieldExample = {
        value: { name: 'Test', age: 30 },
    }

    enumExample = {
        value: Sexuality.male,
    }

    arrayIndexExample = {
        value: ['First', 'Second', 'Third'],
    }
}
