import { Component, ElementRef, Renderer2, ChangeDetectionStrategy, OnInit, TemplateRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipPlacement } from '../types';

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
    placement!: TooltipPlacement;
    content!: any;
    protected _hasTemplate!: boolean;

    constructor(private _elementRef: ElementRef,private _renderer: Renderer2) {
    }

    ngOnInit(): void {
        this._hasTemplate = this.content instanceof TemplateRef;
        const elm = this._elementRef.nativeElement;
        this._renderer.setAttribute(elm, 'role', 'tooltip');
        ['tooltip', 'fade', 'show', 'bs-tooltip-' + this.placement].forEach(c => this._renderer.addClass(elm, c));
    }
}
