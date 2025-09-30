import { Component, ElementRef, Renderer2, ChangeDetectionStrategy, inject, input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown.component';

@Component({
    selector: 'ng0-dropdown-menu',
    exportAs: 'ng0Dropdownmenu',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
    ],
    template: `<ng-content></ng-content>`,
    styles: `:host { display: block; }`,
})
export class DropdownMenuComponent {
    private _el = inject(ElementRef);
    private _renderer = inject(Renderer2);
    private _dropdown = inject(DropdownComponent);

    constructor() {
        this._renderer.addClass(this._el.nativeElement, 'dropdown-menu');
    }

    @HostListener('click')
    private _onClick() {
        // if (this.autoClose() == 'default' || this.autoClose() == 'inside') {
        //     this._cdkOverlay.detachOverlay();
        // }
    }

}
