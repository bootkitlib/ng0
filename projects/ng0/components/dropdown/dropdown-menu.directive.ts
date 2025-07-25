import { Directive, effect, ElementRef, HostListener, input, model, OnDestroy, Renderer2 } from '@angular/core';
import { DropdownAutoCloseBehavior } from './types';
import { Subscription } from 'rxjs';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
// import { OverlayDirective } from '../overlay';

/**
 * Directive to manage dropdown menu behavior.
 */
@Directive({
    selector: '[ng0DropdownMenu]',
    exportAs: 'ng0DropdownMenu',
    standalone: true,
})
export class DropdownMenuDirective implements OnDestroy {
    /** auto close behavior */
    public autoClose = input<DropdownAutoCloseBehavior>('default');

    /** Toggles element */
    public toggle = input<any>(undefined);

    private _pointerEventsSubscription?: Subscription;

    constructor(
        private _el: ElementRef,
        private _renderer: Renderer2,
        private _cdkOverlay: CdkConnectedOverlay
    ) {
        ['dropdown-menu', 'show'].forEach(x => this._renderer.addClass(this._el.nativeElement, x));
        _renderer.setStyle(this._el.nativeElement, 'position', 'static');

        this._pointerEventsSubscription = _cdkOverlay.overlayOutsideClick.subscribe(e => {
            if (this.toggle() == undefined || !this.toggle().contains(e.target)) {
                if (this.autoClose() == 'default' || this.autoClose() == 'outside') {
                    this._cdkOverlay.detachOverlay();
                }
            }
        });
    }

    @HostListener('click')
    private _onClick() {
        if (this.autoClose() == 'default' || this.autoClose() == 'inside') {
            this._cdkOverlay.detachOverlay();
        }
    }

    ngOnDestroy(): void {
        this._pointerEventsSubscription?.unsubscribe();
    }
}
