import { Directive, TemplateRef, ViewContainerRef, effect } from '@angular/core';
import { UserStore } from './user-store';

/**
 * @deprecated use *ng0User directive instead
 */
@Directive({
  selector: '[ng0GuestUser]',
  exportAs: 'ng0GuestUser',
  standalone: true
})
export class GuestUserDirective {
  private _created = false;

  constructor(
    templateRef: TemplateRef<any>,
    viewContainer: ViewContainerRef,
    userStore: UserStore,
  ) {
    effect(() => {
      let show = userStore.user() == undefined

      if (show && !this._created) {
        viewContainer.createEmbeddedView(templateRef);
        this._created = true;
      } else if (!show && this._created) {
        viewContainer.clear();
        this._created = false;
      }
    })
  }
}
