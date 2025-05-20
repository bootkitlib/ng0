import { Component, ElementRef, Renderer2, Input, ChangeDetectionStrategy } from '@angular/core';
import { ProgressBar } from './types';
import { ImmutableList } from '../../common/immutable-list';

@Component({
    selector: 'lui-progress-bar',
    exportAs: 'luiProgressBar',
    templateUrl: './progress-bar.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
    @Input() bars: ImmutableList<ProgressBar>;

    constructor(el: ElementRef, renderer: Renderer2) {
        renderer.addClass(el.nativeElement, 'progress');
    }

    _calculatePercent(item: ProgressBar) {
        return ((item.value - item.minValue) / (item.maxValue - item.minValue)) * 100;
    }

    _getItemClass(item: ProgressBar) {
        const result = ['progress-bar'];
        result.push(item.color ? `bg-${item.color}` : 'bg-primary');
        switch (item.type) {
            case 'striped':
                result.push('progress-bar-striped');
                break;
            case 'striped-animated':
                result.push('progress-bar-striped', 'progress-bar-animated');
                break;
        }

        return result;
    }
}
