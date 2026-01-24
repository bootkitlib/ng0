import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

/**
 * A component that provides collapse and expand functionality. 
*/
@Component({
    selector: 'ng0-collapse',
    templateUrl: './collapse.component.html',
    styleUrl: './collapse.component.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.ng0-collapsed]': 'collapsed()'
    }
})
export class CollapseComponent {
    /**
     * Indicates whether the host element is collapsed. 
     * @model 
     */
    public readonly collapsed = input(false);
}
