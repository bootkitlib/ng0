import { ChangeDetectionStrategy, Component, effect, ElementRef, input, model, Renderer2 } from '@angular/core';
import { CollapseComponent } from '@bootkit/ng0/collapse';
import { AccordionComponent } from './accordion.component';

@Component({
    selector: 'ng0-accordion-item',
    exportAs: 'ng0AccordionItem',
    templateUrl: './accordion-item.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `:host {display: block;}`,
    imports: [
        CollapseComponent
    ]
})
export class AccordionItemComponent {
    public header = input<string>();
    public collapsed = model(true);

    constructor(private _element: ElementRef, private _renderer: Renderer2, private _accordion: AccordionComponent) {
        this._renderer.addClass(this._element.nativeElement, 'accordion-item');

        effect(() => {
            var collapsed = this.collapsed();
            
            if(_accordion.mode() == 'single') {
                if(!collapsed) {
                    this._accordion.items.filter(x => x !== this).forEach(x => x.collapsed.update(x => true));
                }
            }
        }, {allowSignalWrites: true})
    }
}
