import { Directive, TemplateRef, ViewContainerRef, input, effect } from '@angular/core';
import { UserStore } from './user-store';
import { ClaimLike } from '@bootkit/ng0/common';

@Directive({
  selector: '[ng0Claim]',
  exportAs: 'ng0Claim',
  standalone: true
})
export class ClaimDirective {
  public claim = input<ClaimLike | null | undefined>(undefined, { alias: 'ng0Claim' });
  private _viewCreated = false;

  constructor(
    templateRef: TemplateRef<any>,
    viewContainer: ViewContainerRef,
    userStore: UserStore,
  ) {
    effect(() => {
      let claim = this.claim();
      let user = userStore.user();
      let show = !user ? false : (claim == undefined ? true : user.hasClaim(claim))

      if (show && !this._viewCreated) {
         viewContainer.createEmbeddedView(templateRef);
        this._viewCreated = true;
      } else if (!show && this._viewCreated) {
        viewContainer.clear();
        this._viewCreated = false;
      }
    })
  }
}
