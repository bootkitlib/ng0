import { Directive, TemplateRef, ViewContainerRef, input, effect, inject } from '@angular/core';
import { UserStore } from './user-store';
import { ClaimLike } from '@bootkit/ng0/common';

/**
 * @deprecated use *ng0User instead
 */
@Directive({
  selector: '[ng0Claim]',
  exportAs: 'ng0Claim',
  standalone: true
})
export class ClaimDirective {
  private _viewCreated = false;
  private _templateRef = inject(TemplateRef<any>);
  private _viewContainer = inject(ViewContainerRef);
  private _userStore = inject(UserStore);

  /**
   * Claim to check
   */
  public readonly claim = input<ClaimLike | null | undefined>('', { alias: 'ng0Claim' });

  constructor() {
    effect(() => {
      let claim = this.claim();
      let user = this._userStore.user();
      let show = !user ? false : (claim == undefined ? true : user.hasClaim(claim))

      if (show && !this._viewCreated) {
        this._viewContainer.createEmbeddedView(this._templateRef);
        this._viewCreated = true;
      } else if (!show && this._viewCreated) {
        this._viewContainer.clear();
        this._viewCreated = false;
      }
    })
  }
}
