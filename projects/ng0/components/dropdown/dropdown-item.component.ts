import { Component, ElementRef, Renderer2, ChangeDetectionStrategy, inject, input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ng0-dropdown-item',
    exportAs: 'ng0DropdownItem',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
    ],
    template: `<button class="dropdown-item"><ng-content></ng-content></button>`,
})
export class DropdownItemComponent {
    // private _el = inject(ElementRef);
    // private _renderer = inject(Renderer2);

    constructor() {
        // this._renderer.addClass(this._el.nativeElement, 'dropdown-item');
    }


}
