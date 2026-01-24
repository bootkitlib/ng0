import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, input, model, Renderer2 } from '@angular/core';
import { CollapseComponent } from '@bootkit/ng0/components/collapse';
import { AccordionComponent } from './accordion.component';

@Component({
    selector: 'ng0-accordion-item',
    exportAs: 'ng0AccordionItem',
    templateUrl: './accordion-item.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `:host {display: block;}`,
    imports: [
        CollapseComponent,
    ]
})
export class AccordionItemComponent {
    private readonly _element = inject(ElementRef);
    private readonly _renderer = inject(Renderer2);
    private readonly _accordion = inject(AccordionComponent);

    /**
     * The header text of the accordion item.
     */
    public readonly header = input<string>();

    /**
     * Whether the accordion item is collapsed or expanded.
     */
    public readonly collapsed = model(true, {});

    constructor() {
        this._renderer.addClass(this._element.nativeElement, 'accordion-item');

        effect(() => {
            var collapsed = this.collapsed();
            if (this._accordion.mode() == 'single') {
                if (!collapsed) {
                    this._accordion.items.filter(x => x !== this).forEach(x => x.collapsed.update(x => true));
                }
            }
        })
    }
}
