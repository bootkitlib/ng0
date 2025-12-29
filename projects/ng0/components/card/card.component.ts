import { Component, ElementRef, Renderer2, ChangeDetectionStrategy, input, inject } from '@angular/core';
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
    private _element = inject(ElementRef);
    private _renderer = inject(Renderer2);

    constructor() {
        this._renderer.addClass(this._element.nativeElement, 'card');
    }
}
