import { Component, ContentChildren, QueryList, ElementRef, Renderer2, OnInit, input, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavContentDirective } from './nav-content.directive';
import { NavDirective } from './nav.directive';

@Component({
    selector: 'ng0-navcontent-container',
    exportAs: 'ng0Navcontent',
    templateUrl: './nav-content-container.component.html',
    styles: `:host{display: block;}`,
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule]
})
export class NavContentContainerComponent implements OnInit {
    /** 
     * The navigation directive that this content belongs to.
     */
    nav = input.required<NavDirective>();

    @ContentChildren(NavContentDirective) protected _contents!: QueryList<NavContentDirective>;
    protected _activeItem = computed(() => this.nav().activeItem());

    constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {
    }

    ngOnInit(): void {
        this._renderer.addClass(this._elementRef.nativeElement, 'tab-content');
    }
}
