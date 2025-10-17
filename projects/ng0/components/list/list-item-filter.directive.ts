import { input, inject, Directive, TemplateRef, effect, ViewContainerRef, EmbeddedViewRef } from '@angular/core';

/**
 * Directive for managing list item state.
 */
@Directive({
    selector: '[ng0ListItemFilter]',
    exportAs: 'ng0ListItemFilter',
    standalone: true,
})
export class ListItemFilterDirective {
    private readonly _templateRef = inject(TemplateRef<any>);
    private _vcr = inject(ViewContainerRef);
    private _viewRef?: EmbeddedViewRef<any>;

    public readonly show = input(true, { alias: 'ng0ListItemFilter' });

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

