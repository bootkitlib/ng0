import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldModule } from '@bootkit/ng0/components/form-field';

@Component({
    selector: 'app-examples-components-form-field',
    templateUrl: './form-field-example.component.html',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        FormsModule,
        FormFieldModule,
        CommonModule
    ]
})
export class FormFieldExampleComponent {

    examples = {
        basicUsage: {
            value: undefined
        },
        required: {
            value: undefined
        },
        reactiveForms: {
            formControl1: new FormControl('', {
                validators: [
                    Validators.required
                ],
            })
        },
        conditionalRequired: {
            value: undefined,
            isRequired: true
        },
    }
}
