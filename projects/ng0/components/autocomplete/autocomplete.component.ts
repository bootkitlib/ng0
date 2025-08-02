import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Component({
    selector: 'ng0-autocomplete',
    exportAs: 'ng0Autocomplete',
    templateUrl: './autocomplete.component.html',
    standalone: true,
    // changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `:host {display: block;}`
})
export class AutocompleteComponent implements OnInit {

    constructor(
        private _element: ElementRef,
        private _renderer: Renderer2,
        
        ) {
        // this._renderer.addClass(this._element.nativeElement, 'accordion');
    }

    ngOnInit(): void {
    }
}
