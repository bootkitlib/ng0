import { Component, ElementRef, Renderer2, ChangeDetectionStrategy, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
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
    imports: [CommonModule],
    host: {
        '[class.bs-tooltip-top]': 'placement == "top"',
        '[class.bs-tooltip-bottom]': 'placement == "bottom"',
        '[class.bs-tooltip-start]': 'placement == "start"',
        '[class.bs-tooltip-end]': 'placement == "end"',
    }
})
export class TooltipWrapperComponent implements OnInit {
    protected placement!: TooltipPlacement;
    protected content!: TooltipContent;
    protected hasTemplate!: boolean;

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.hasTemplate = this.content instanceof TemplateRef;
        const elm = this.elementRef.nativeElement;
        this.renderer.setAttribute(elm, 'role', 'tooltip');
        ['tooltip', 'fade', 'show'].forEach(c => this.renderer.addClass(elm, c));
    }

    public set(content: any, placement: TooltipPlacement) {
        this.content = content;
        this.placement = placement;
        this.hasTemplate = content instanceof TemplateRef;
        this.changeDetectorRef.markForCheck();
    }
}
