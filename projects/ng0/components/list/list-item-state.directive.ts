import { input, inject, Directive, TemplateRef, effect, ViewContainerRef, EmbeddedViewRef, signal } from '@angular/core';
import { ListItemComponent } from './list-item.component';

/**
 * ListItemStateDirective
 */
@Directive({
    selector: '[ng0ListItemState]',
    exportAs: 'ng0ListItemState',
    standalone: true,
})
export class ListItemStateDirective {
    private readonly _templateRef = inject(TemplateRef<any>);
    private _vcr = inject(ViewContainerRef);
    private _viewRef?: EmbeddedViewRef<any>;
    public readonly show = input(true);
    public listItem!: ListItemComponent;

    constructor() {
        effect(() => {
            if (this.show()) {
                if (!this._viewRef) {
                    this._viewRef = this._vcr.createEmbeddedView(this._templateRef);
                }

                if (this._vcr.length === 0) {
                    this._vcr.insert(this._viewRef);
                }
            } else {
                if (this._vcr.length > 0) {
                    this._vcr.detach(0);
                }
            }
        })
    }
}

