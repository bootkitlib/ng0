import { Component, ChangeDetectionStrategy, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormFieldModule } from '@bootkit/ng0/components/form-field';
import { FormModule } from '@bootkit/ng0/form';

@Component({
    selector: 'app-examples-form-validation',
    templateUrl: './validation-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormModule,
        FormsModule,
        FormFieldModule,
    ]
})
export class ValidationExampleComponent {
    a1?: any;
    a2?: any;
    a3?: any;
    a4?: any;
    a5?: any;

    f1?: File; f2?: File; f3?: File;
    fm1?: File; fm2?: File; fm3?: File;

    f1Change() {
        console.log(this.f1);
    }
}
