import { Component, ChangeDetectionStrategy, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormFieldModule } from '@bootkit/ng0/components/form-field';
import { FormModule } from '@bootkit/ng0/form';
import { HttpService } from '@bootkit/ng0/http';

@Component({
    selector: 'app-examples-form',
    templateUrl: './form-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        FormFieldModule,
        FormModule,
    ]
})
export class FormExampleComponent {
    n1 = model<number>();
    n2 = model<number>();

    constructor(private httpService: HttpService) {
    }


}
