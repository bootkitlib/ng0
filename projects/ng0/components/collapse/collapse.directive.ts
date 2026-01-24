// import { Directive, OnInit, ElementRef, Renderer2, input, effect, OnDestroy, inject, booleanAttribute } from '@angular/core';
// import { animate, AnimationBuilder, AnimationMetadata, AnimationPlayer, style } from '@angular/animations';

// /** 
//  * Directive to handle the collapse and expand functionality of a host element. 
//  */
// @Directive({
//     selector: '[ng0Collapse]',
//     exportAs: 'ng0Collapse',
//     standalone: true,
// })
// export class CollapseDirective implements OnInit, OnDestroy {
//     private _player?: AnimationPlayer;
//     private _firstExecution = true;
//     private _el = inject(ElementRef)
//     private _animationBuilder = inject(AnimationBuilder)
//     private _renderer = inject(Renderer2);

//     /**
//      * Indicates whether the host element is collapsed. 
//      * @input 
//      */
//     public collapsed = input(false, { alias: 'ng0Collapse', transform: booleanAttribute });

//     /** Animation timings for collapse/expand animations. 
//      * @input 
//      */
//     public timings = input<string | number>('0.2s');

//     constructor() {
//         this._renderer.setStyle(this._el.nativeElement, 'overflow', 'hidden');

//         effect(() => {
//             var collapsed = this.collapsed();
//             if (this._firstExecution) {
//                 this._firstExecution = false;
//                 return;
//             }

//             if (collapsed)
//                 this._collapse()
//             else
//                 this._expand();
//         });
//     }

//     ngOnInit(): void {
//         this._addClass('collapse');
//         if (!this.collapsed()) {
//             this._addClass('show');
//         }
//     }

//     private _collapse() {
//         if (this._player) {
//             this._player.destroy();
//         }

//         this._playAnimation([
//             style({ height: '*', opacity: '*' }),
//             animate(this.timings(), style({ height: 0, opacity: 0 })),
//         ])

//         this._player!.onDone(() => {
//             if (this.collapsed()) {
//                 this._removeClass('show')
//             }
//         });
//     }

//     private _expand() {
//         if (this._player) {
//             this._player.destroy();
//         }

//         this._addClass('show')
//         this._playAnimation([
//             style({ height: 0, opacity: 0 }),
//             animate(this.timings(), style({ height: '*', opacity: '*' })),
//         ]);

//         this._player!.onDone(() => {
//             this._player!.destroy()
//             this._player = undefined;
//         });
//     }

//     private _playAnimation(animation: AnimationMetadata | AnimationMetadata[]) {
//         this._player = this._animationBuilder.build(animation).create(this._el.nativeElement);
//         this._player.play();
//     }

//     private _addClass = (cls: string) => this._renderer.addClass(this._el.nativeElement, cls);
//     private _removeClass = (cls: string) => this._renderer.removeClass(this._el.nativeElement, cls);

//     ngOnDestroy(): void {
//         this._player?.destroy();
//     }
// }
