import { Component, ElementRef, Renderer2, ChangeDetectionStrategy, OnInit, TemplateRef } from '@angular/core';
import { PopoverContent, PopoverPlacement } from '../types';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'jss-popover-wrapper',
    exportAs: 'jssPopoverWrapper',
    styleUrls: ['./popover-wrapper.component.scss'],
    templateUrl: './popover-wrapper.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule]
})
export class PopoverWrapperComponent implements OnInit {
    placement!: PopoverPlacement;
    header?: string;
    content: PopoverContent;
    protected _hasTemplate!: boolean;

    constructor(private _elementRef: ElementRef, private _renderer: Renderer2,) {
    }

    ngOnInit(): void {
        this._hasTemplate = this.content instanceof TemplateRef;
        const e = this._elementRef.nativeElement;
        this._renderer.setAttribute(e, 'role', 'tooltip');
        ['popover', 'fade', 'show', 'bs-popover-' + this.placement].forEach(c => this._renderer.addClass(e, c));
    }
}
