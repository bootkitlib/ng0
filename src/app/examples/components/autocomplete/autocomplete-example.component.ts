import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AutocompleteModule } from '@bootkit/ng0/components/autocomplete';

@Component({
    selector: 'app-examples-autocomplete',
    templateUrl: './autocomplete-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        AutocompleteModule,
        FormsModule
    ]
})
export class AutocompleteExampleComponent {
    fruit = { name: 'Apple', value: 'apple' };

    source = [ { name: 'Apple', value: 'apple' },];
    formatter = (v: any) => v ? v.name : '';
}
