import { Component, ChangeDetectionStrategy, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormFieldModule } from '@bootkit/ng0/components/form-field';
import { FormModule } from '@bootkit/ng0/form';
import { HttpService } from '@bootkit/ng0/http';

@Component({
    selector: 'app-examples-form-number-directive',
    templateUrl: './file-value-accessor-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormModule,
        FormsModule,
        FormFieldModule,
    ]
})
export class FileValueAccessorExampleComponent {
    f1?: File;

    f1Change() {
        console.log(this.f1);
    }
}
