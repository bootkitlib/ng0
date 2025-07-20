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
    localizationService.add(FA_IR_LOCALE);
    localizationService.add(EN_US_LOCALE);
  }
}
