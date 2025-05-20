import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AccordionModule } from '@bootkit/ng0/accordion';

@Component({
    selector: 'app-accordion-example',
    templateUrl: './accordion-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        AccordionModule
    ]
})
export class AccordionExampleComponent {
 
 
}
