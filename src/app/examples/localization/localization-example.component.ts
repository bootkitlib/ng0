import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LocalizationModule } from '@bootkit/ng0/localization';
import { FA_IR_LOCALE } from '@bootkit/ng0/localization/locales/fa-ir';

@Component({
    selector: 'app-localization-example',
    templateUrl: './localization-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        LocalizationModule
    ]
})
export class LocalizationExampleComponent {
    constructor() {
        var faLocale = FA_IR_LOCALE.extend({
            dictionary:{
                'hello': 'سلام',
                'welcome': 'خوش آمدید',
                'ok': 'تایید - بازنویسی شده',
            }
        });
        console.log(faLocale.definition);
        console.log(faLocale.translateError('e5', {a : {}}));
    }
}
