// import { Directive, TemplateRef, ViewContainerRef, Inject, Optional, OnInit, OnDestroy } from '@angular/core';
// import { NgForm } from '@angular/forms';
// import { Subscription } from 'rxjs';
// import { ErrorDirective } from './error.directive';
// import { Locale, LocalizationService } from '@bootkit/angular/localization';

// @Directive({
//   selector: '[iscFirstError]',
//   exportAs: 'iscFirstError',
//   standalone: true,
// })
// export class FirstErrorDirective implements OnInit, OnDestroy {
//   private readonly _locale: Locale;
//   private _subscription?: Subscription;

//   constructor(
//     private _templateRef: TemplateRef<any>,
//     private _viewContainer: ViewContainerRef,
//     @Optional() private _errorDirective: ErrorDirective,
//     @Optional() private _form: NgForm,
//     l: LocalizationService,
//   ) {
//     if (!_errorDirective) {
//       throw Error('FirstErrorDirective must be used inside a ErrorDirective.');
//     }

//     this._locale = l.get();
//   }

//   ngOnInit(): void {
//     this.showFirstError();
//     this._subscription = this._form!.statusChanges!.subscribe(s => {
//       const control = this._form.controls[this._errorDirective.fieldName];
//       if (control.invalid) {
//         this.showFirstError();
//       }
//     });
//   }

//   showFirstError() {
//     const errors = this._errorDirective.errors;
//     const firstErrorKey = Object.keys(errors!)[0];
//     const firstError = errors![firstErrorKey];
//     const firstErrorText = this._locale!.translateFirstError(errors);
//     this._viewContainer.clear();
//     this._viewContainer.createEmbeddedView(this._templateRef, { $implicit: firstError, errorText: firstErrorText });
//   }

//   ngOnDestroy(): void {
//     this._subscription!.unsubscribe();
//   }
// }
