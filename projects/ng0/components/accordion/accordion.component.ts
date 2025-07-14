import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, input, QueryList, Renderer2 } from '@angular/core';
import { AccordionItemComponent } from './accordion-item.component';

@Component({
    selector: 'ng0-accordion',
    exportAs: 'ng0Accordion',
    templateUrl: './accordion.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `:host {display: block;}`
})
export class AccordionComponent {
    /** Items open mode */
    public mode = input<'single' | 'multiple'>('single');

    @ContentChildren(AccordionItemComponent)
    public readonly items!: QueryList<AccordionItemComponent>;

    constructor(private _element: ElementRef, private _renderer: Renderer2) {
        this._renderer.addClass(this._element.nativeElement, 'accordion');
    }
}
