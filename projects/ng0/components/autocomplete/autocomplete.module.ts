import { NgModule } from '@angular/core';
import { AutocompleteContainerComponent } from './autocomplete-container.component';
import { AutocompleteTriggerDirective } from './autocomplete-trigger.directive';
import { AutocompleteComponent } from './autocomplete.component';


const items = [
    AutocompleteContainerComponent,
    AutocompleteTriggerDirective,
    AutocompleteComponent
]

@NgModule({
    imports: items,
    exports: items
})
export class AutocompleteModule {
}
