import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { LocalizationService } from '@bootkit/ng0/localization';
import { EN_US_LOCALE } from '@bootkit/ng0/localization/locales/en-us';
import { FA_IR_LOCALE } from '@bootkit/ng0/localization/locales/fa-ir';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'BootKitTest';

  constructor(private localizationService: LocalizationService) {

    // var faLocale = FA_IR_LOCALE.extend({
    //   dictionary: {
    //     'hello': 'سلام',
    //     'welcome': 'خوش آمدید',
    //   },
    //   enums: {
    //     Enum1: {
    //       'Done': 'انجام شده',
    //       'Failed': 'ناموفق',
    //       '[?]': '⚠️ نامعلوم',
    //       '[empty]': 'در انتظار پرداخت', // '' or null or undefined
    //       '[null]': '❌ NULL', // exactly null value
    //       '[undefined]': '❌ UNDEFINED' // exactly undefined value
    //     }
    //   }
    // });

    // localizationService.add(faLocale);
  }
}
