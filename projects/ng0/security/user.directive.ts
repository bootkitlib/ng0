import { Directive, TemplateRef, ViewContainerRef, input, effect, inject } from '@angular/core';
import { UserStore } from './user-store';
import { UserCondition } from '@bootkit/ng0/common';
import { User } from './user';

/**
 * Directive to conditionally display content based on user claims or conditions.
 * If there is no condition provided, the content is always shown.
 * If a condition is provided, it checks against the current user.
 * @example
 * ```html
 * <ng-container *ng0User="true">
 *  This content is shown only if there is a logged-in user, regardless of claims.
 * </ng-container>
 * <ng-container *ng0User="false">
 * This content is shown only if there is no logged-in user.
 * </ng-container>
 * <ng-container *ng0User="'admin'">
 * This content is shown only if the user has the 'admin' claim.
 * </ng-container>
 * <ng-container *ng0User="{ all: ['read', 'write'] }">
 * This content is shown only if the user has both 'read' and 'write' claims.
 * </ng-container>
 * <ng-container *ng0User="{ any: ['editor', 'contributor'] }">
 * This content is shown if the user has either 'editor' or 'contributor' claims.
 * </ng-container>
 * <ng-container *ng0User="null">
 * This content is always shown, regardless of user state.
 * </ng-container>
 * ```
 */
@Directive({
  selector: '[ng0User]',
  exportAs: 'ng0User',
  standalone: true
})
export class UserDirective {
  private _viewCreated = false;
  private readonly _templateRef = inject(TemplateRef<any>);
  private readonly _viewContainer = inject(ViewContainerRef);
  private readonly _userStore = inject<UserStore<User>>(UserStore);

  /**
   * Show condition to check
   * 
   */
  public readonly condition = input<UserCondition | null | undefined>('', { alias: 'ng0User' });

  constructor() {
    effect(() => {
      let condition = this.condition();
      let user = this._userStore.user();
      let show: boolean;

      if (condition === null || condition === undefined) {
        show = true;
      } else {
        if (user) {
          if (condition === true) {
            show = true;
          } else if (condition === false) {
            show = false;
          } else {
            show = user.hasClaim(condition);
          }
        } else {
          show = condition === false;
        }
      }

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
