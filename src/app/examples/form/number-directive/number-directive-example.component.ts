import { Component, ChangeDetectionStrategy, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormFieldModule } from '@bootkit/ng0/components/form-field';
import { FormModule } from '@bootkit/ng0/form';
import { HttpService } from '@bootkit/ng0/http';

@Component({
    selector: 'app-examples-form-number-directive',
    templateUrl: './number-directive-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        FormFieldModule,
        FormModule,
    ]
})
export class NumberDirectiveExampleComponent {
    n1 = model<number>();
    n2 = model<number>();
    n3 = model<number>();
    n4 = model<number>();
    n5 = model<number>();
    n6 = model<number>();
    n7 = model<number>();
    n8 = model<number>();
    n9 = model<number>();
    n10 = model<number>();

    constructor(private httpService: HttpService) {
    }


}
