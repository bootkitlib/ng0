import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldModule } from '@bootkit/ng0/components/form-field';
import { LocalizationService } from '@bootkit/ng0/localization';
import { EN_US_LOCALE } from '@bootkit/ng0/localization/locales/en-us';

@Component({
    selector: 'app-examples-components-form-field',
    templateUrl: './form-field-example.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        FormFieldModule,
    ]
})
export class FormFieldExampleComponent {
    constructor() {

    }

    p1 = '';
    p2 = new FormControl('', {
        validators: [Validators.minLength(5)],
        // updateOn: 'blur'
    });

}
