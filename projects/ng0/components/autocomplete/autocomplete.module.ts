import { NgModule } from '@angular/core';
import { AutocompleteComponent } from './autocomplete.component';


const items = [
    AutocompleteComponent
]

@NgModule({
    imports: items,
    exports: items
})
export class AutocompleteModule {
}
