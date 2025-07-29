import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LocalizationService } from '@bootkit/ng0/localization';
import { EN_US_LOCALE } from '@bootkit/ng0/localization/locales/en-us';

@Component({
  selector: 'app-examples-bootkit',
  templateUrl: './bootkit-example.component.html',
  styleUrl: './bootkit-example.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class BootKitExampleComponent {

}
