import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LocalizationModule, LocalizationService } from '@bootkit/ng0/localization';
import { FA_IR_LOCALE } from '@bootkit/ng0/localization/locales/fa-ir';

enum Enum1 {
    done = 'Done',
    failed = 'Failed',
}

@Component({
    selector: 'app-localization-example',
    templateUrl: './localization-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        LocalizationModule
    ]
})
export class LocalizationExampleComponent {
    Enum1 = Enum1
    today = new Date()
    selectedValue = Enum1.failed;

    constructor(private localizationService: LocalizationService) {

    }
}
