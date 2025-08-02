import { Directive, OnInit, ElementRef, Renderer2, input, effect, OnDestroy, Optional } from '@angular/core';
import { AutocompleteComponent } from './autocomplete.component';
import { NgControl } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';


@Directive({
    selector: 'input[ng0Autocomplete],textarea[ng0Autocomplete]',
    exportAs: 'ng0AutocompleteTrigger',
    standalone: true,
})
export class AutocompleteTriggerDirective implements OnInit, OnDestroy {
    /**
     * Reference to the autocomplete component.
     * @input
     */
    public autocomplete = input.required<AutocompleteComponent>();
    private _overlayRef?: OverlayRef;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private _overlay: Overlay,
        @Optional() private _ngControl?: NgControl,
    ) {
        if(!_ngControl) {
            throw new Error('AutocompleteTriggerDirective requires a NgControl instance.');
        }

        _ngControl.control?.valueChanges.subscribe(value => {
            // this.openPanel();
        });
    }

    openPanel() {
        
    }

    hidePanel() {
    }

    ngOnInit(): void {
    }

    // private _addClass = (cls: string) => this.renderer.addClass(this.el.nativeElement, cls);
    // private _removeClass = (cls: string) => this.renderer.removeClass(this.el.nativeElement, cls);

    ngOnDestroy(): void {
    }
}
