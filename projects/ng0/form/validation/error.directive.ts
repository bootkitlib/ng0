// import { Directive, TemplateRef, ViewContainerRef, Input, Optional, OnInit, OnDestroy, EmbeddedViewRef } from '@angular/core';
// import { NgForm, ValidationErrors } from '@angular/forms';
// import { Subscription } from 'rxjs';

// @Directive({
//   selector: '[iscError]',
//   exportAs: 'iscError',
//   standalone: true,
// })
// export class ErrorDirective implements OnInit, OnDestroy {
//   private _embededViewRef?: EmbeddedViewRef<any>;
//   private _fieldName!: string;
//   private _formStatusChangeSubscription!: Subscription;
//   private _formSubmitSubscription!: Subscription;
//   private _errors: ValidationErrors | null = null;

//   constructor(
//     private _templateRef: TemplateRef<any>,
//     private _viewContainer: ViewContainerRef,
//     @Optional() private _form: NgForm,
//   ) {
//     if (!_form) {
//       throw Error('ErrorDirective must be used in a form element.');
//     }
//   }

//   ngOnInit(): void {
//     this._formStatusChangeSubscription = this._form.statusChanges!.subscribe(x => {
//       const control = this._form.controls[this._fieldName];
//       this._errors = control.errors;
//       if (control.invalid && (control.dirty || control.touched)) {
//         this._show(true);
//       } else {
//         this._show(false);
//       }
//     });

//     this._formSubmitSubscription = this._form.ngSubmit.subscribe(s => {
//       this._show(true);
//     });
//   }

//   @Input('iscError') set fieldName(value: string) {
//     this._fieldName = value;
//   }

//   get fieldName() {
//     return this._fieldName;
//   }

//   get errors() {
//     return this._errors;
//   }

//   ngOnDestroy(): void {
//     this._formStatusChangeSubscription.unsubscribe();
//     this._formSubmitSubscription.unsubscribe();
//   }

//   private _show(show: boolean): void {
//     if (show && !this._embededViewRef) {
//       this._embededViewRef = this._viewContainer.createEmbeddedView(this._templateRef);
//     } else if (!show && this._embededViewRef) {
//       this._embededViewRef.destroy();
//       this._embededViewRef = undefined;
//     }
//   }
// }
