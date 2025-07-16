// import { Directive, ElementRef, Input, OnInit, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
// import { Subscription } from 'rxjs';

// /** 
//  * Directive to disable an element for a countdown period.
//  * It emits an 'expire' event when the countdown finishes. 
// */
// @Directive({
//   selector: '[ng0DisableCountdown]',
//   exportAs: 'ng0DisableCountdown',
//   standalone: true
// })
// export class DisableCountdownDirective implements OnInit, OnDestroy {
//   @Input() seconds = 10;
//   @Input() startOnClick = true;
//   @Output() expire = new EventEmitter();
//   private _expired = true;
//   private _subscription?: Subscription;

//   constructor(private elementRef: ElementRef) {
//   }

//   ngOnInit(): void {
//   }

//   @HostListener('click') private onHostClick() {
//     if (this.startOnClick) {
//       this.start()
//     }
//   }

//   public start() {
//     let seconds = this.seconds;
//     // this._subscription = interval(1000).pipe(
//     //   map(s => seconds - s)
//     // )
//   }

//   ngOnDestroy(): void {
//     this._subscription?.unsubscribe();
//   }
// }
