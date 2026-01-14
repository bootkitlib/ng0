import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, inject, input, QueryList, Renderer2 } from '@angular/core';
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
    private _element = inject(ElementRef);
    private _renderer = inject(Renderer2);

    /**
     * The mode of the accordion - 'single' or 'multiple'.
     * 'single' mode allows only one item to be expanded at a time.
     * 'multiple' mode allows multiple items to be expanded simultaneously.
     */
    public readonly mode = input<'single' | 'multiple'>('single');

    @ContentChildren(AccordionItemComponent)
    public readonly items!: QueryList<AccordionItemComponent>;

    constructor() {
        this._renderer.addClass(this._element.nativeElement, 'accordion');
    }
}
