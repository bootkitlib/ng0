import { NgModule } from '@angular/core';
import { CardComponent } from './card.component';
import { CardHeaderComponent } from './card-header.component';

const DECLARES = [
    CardComponent,
    CardHeaderComponent
];

@NgModule({
    imports: DECLARES,
    exports: DECLARES
})
export class CardModule {
}
