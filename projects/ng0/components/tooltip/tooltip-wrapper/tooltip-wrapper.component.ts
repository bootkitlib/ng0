import { Component, ChangeDetectionStrategy, OnInit, TemplateRef, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipContent, TooltipPlacement } from '../types';

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
export class TooltipWrapperComponent implements OnInit {
    protected _placement!: TooltipPlacement;
    protected _content!: TooltipContent;
    protected _hasTemplate!: boolean;
    protected _changeDetectorRef = inject(ChangeDetectorRef);

    constructor() {
    }

    ngOnInit(): void {
        this._hasTemplate = this._content instanceof TemplateRef;
    }

    public set(content: any, placement: TooltipPlacement) {
        this._content = content;
        this._placement = placement;
        this._hasTemplate = content instanceof TemplateRef;
        this._changeDetectorRef.markForCheck();
    }
}
