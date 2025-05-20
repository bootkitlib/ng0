import { NgModule } from '@angular/core';
import { AccordionComponent } from './accordion.component';
import { AccordionItemComponent } from './accordion-item.component';

@NgModule({
    imports: [
        AccordionComponent,
        AccordionItemComponent,
    ],
    exports: [
        AccordionComponent,
        AccordionItemComponent,
    ]
})
export class AccordionModule {
}
