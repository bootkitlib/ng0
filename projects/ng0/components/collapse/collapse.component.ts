import { ChangeDetectionStrategy, Component, HostBinding, input, model } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';

/**
 * A component that provides collapse and expand functionality. 
*/
@Component({
    selector: 'ng0-collapse',
    templateUrl: './collapse.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `:host{display :block; overflow: hidden}`,
    animations: [
        trigger('collapseExpand', [
            state('collapsed', style({ height: 0, opacity: 0, })),
            state('expanded', style({ height: '*', opacity: '*', })),
            transition('collapsed <=> expanded', [
                animate('{{timings}}')
            ])
        ])
    ]
})
export class CollapseComponent {
    /**
     * Indicates whether the host element is collapsed. 
     * @model 
     */
    public collapsed = model(false);

    /** Animation timings for collapse/expand animations. 
     * @input 
     */
    public timings = input<string | number>('0.2s');

    @HostBinding('@collapseExpand')
    private get _collapseExpand() {
        return { value: this.collapsed() ? 'collapsed' : 'expanded', params: { timings: this.timings() } };
    }
}
