// import { Directive, ElementRef, Host, HostListener, input, Input, numberAttribute } from '@angular/core';

// @Directive({
//   standalone: true,
//   selector: 'input[type=number][maxlength]',
//   exportAs: 'ng0NumberMaxlength',
// })
// export class NumberMaxLengthDirective {
//   maxlength = input.required<number, number | string | undefined | null>({
//     transform: numberAttribute,
//   });

//   @HostListener('keydown', ['$event']) private onKeyDown(e: KeyboardEvent) {
//     const input = e.target as HTMLInputElement;

//     var allowedKeys = ['Tab', 'Backspace', 'ArrowLeft', 'ArrowRight'];
//     if (allowedKeys.some(k => e.key == k)) {
//       return;
//     }

//     // Check if something is selected.
//     if (input.selectionStart != null && input.selectionStart !== input.selectionEnd) {
//       return;
//     }

//     if (Number.isInteger(this.maxlength()) && input.value.length >= this.maxlength()) {
//       e.preventDefault()
//     }
//   }


//   @HostListener('select', ['$event']) private onKesdfyDown(e: KeyboardEvent) {
//     console.log('selected', e);
//   }
// }
