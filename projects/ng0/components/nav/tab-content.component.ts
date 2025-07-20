import { Component, ContentChildren, QueryList, ElementRef, Renderer2, OnInit, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabPaneDirective } from './tab-pane.directive';
import { NavDirective } from './nav.directive';

@Component({
    selector: 'ng0-tab-content',
    exportAs: 'ng0TabContent',
    templateUrl: './tab-content.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule]
})
export class TabContentComponent implements OnInit {
    nav = input.required<NavDirective>();

    @ContentChildren(TabPaneDirective) protected _panes!: QueryList<TabPaneDirective>;

    disabled = input(false);

    constructor(private _elementRef: ElementRef, private _renderer: Renderer2) {
    }

    ngOnInit(): void {
        this._renderer.addClass(this._elementRef.nativeElement, 'tab-content');
    }
}
