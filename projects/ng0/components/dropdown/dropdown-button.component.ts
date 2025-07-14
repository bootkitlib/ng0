// import { Component, ElementRef, Renderer2, ChangeDetectionStrategy, HostBinding, ContentChild, effect, AfterViewInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { OverlayDirective } from '../overlay/overlay.directive';
// // import { DropdownToggleDirective } from './dropdown-toggle.directive';

// @Component({
//     selector: 'ng0-dropdown',
//     exportAs: 'ng0DropdownButton',
//     templateUrl: './dropdown-button.component.html',
//     standalone: true,
//     changeDetection: ChangeDetectionStrategy.OnPush,
//     imports: [
//         CommonModule,
//     ]
// })
// export class DropdownComponent implements AfterViewInit {

//     @ContentChild(OverlayDirective) private _dropdown?: OverlayDirective;
//     // @ContentChild(DropdownToggleDirective) private _toggle!: DropdownToggleDirective;


//     @HostBinding('class.dropstart')
//     private get _placementStart() { return this._dropdown?.placement() == 'start' };

//     @HostBinding('class.dropend')
//     private get _placementEnd() { return this._dropdown?.placement() == 'end' };

//     @HostBinding('class.dropup')
//     private get _placementTop() { return this._dropdown?.placement() == 'top' };

//     @HostBinding('class.dropdown')
//     private get _placementBottom() { return this._dropdown?.placement() == 'bottom' };

//     constructor(private el: ElementRef, private renderer: Renderer2) {
//         this.renderer.addClass(this.el.nativeElement, 'btn-group');
//     }

//     ngAfterViewInit(): void {
//         // if (this._toggle)
//         //     this._dropdown.toggleBy.set(this._toggle);
//     }
// }
