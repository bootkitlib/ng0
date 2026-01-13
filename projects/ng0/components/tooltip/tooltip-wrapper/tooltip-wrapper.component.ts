import { Component, ChangeDetectionStrategy, OnInit, TemplateRef, ChangeDetectorRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipContent, TooltipPlacement } from '../types';
import { Subject } from 'rxjs';

/**
 * @private
 */
@Component({
    selector: 'ng0-tooltip-wrapper',
    exportAs: 'ng0TooltipWrapper',
    styleUrls: ['./tooltip-wrapper.component.scss'],
    templateUrl: './tooltip-wrapper.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule]
})
export class TooltipWrapperComponent {
    protected _placement!: TooltipPlacement;
    protected _content!: TooltipContent;
    protected _hasTemplate!: boolean;
    protected readonly _changeDetectorRef = inject(ChangeDetectorRef);
    protected readonly _show = signal(true);
    public readonly transitionEnd = new Subject<TransitionEvent>();

    public show(content: any, placement: TooltipPlacement) {
        this._content = content;
        this._placement = placement;
        this._hasTemplate = content instanceof TemplateRef;
        this._show.set(true);
    }

    public hide() {
        this._show.set(false);
    }
}
