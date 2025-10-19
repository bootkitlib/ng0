import { input, inject, Directive, TemplateRef, effect, ViewContainerRef, EmbeddedViewRef } from '@angular/core';

/**
 * IfDirective is a structural directive that conditionally includes or excludes a template
 * based on the boolean value of the `show` input property.
 * 
 */
@Directive({
    selector: '[ng0If]',
    exportAs: 'ng0If',
    standalone: true,
})
export class IfDirective {
    private readonly _templateRef = inject(TemplateRef<any>);
    private _vcr = inject(ViewContainerRef);
    private _viewRef?: EmbeddedViewRef<any>;
    public readonly show = input(true, { alias: 'ng0If' });

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

