import { Component, ElementRef, Renderer2, ContentChild, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'ng0-card',
    exportAs: 'ng0Card',
    templateUrl: 'card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule]
})
export class CardComponent {
    public header = input<string>();
 
    constructor(private _element: ElementRef, private _renderer: Renderer2) {
        this._renderer.addClass(this._element.nativeElement, 'card');        
    }
}
