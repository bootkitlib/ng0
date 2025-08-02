import { NgModule } from '@angular/core';
import { AutocompleteComponent } from './autocomplete.component';
import { AutocompleteTriggerDirective } from './autocomplete-trigger.directive';

@NgModule({
    imports: [
        AutocompleteComponent,
        AutocompleteTriggerDirective
    ],
    exports: [
        AutocompleteComponent,
        AutocompleteTriggerDirective
    ]
})
export class AutocompleteModule {
}
