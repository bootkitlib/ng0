import { computed, inject, Injectable, signal } from '@angular/core';

@Injectable()
export class VerticalMenuItemState {
  public parent? = inject(VerticalMenuItemState, { optional: true, skipSelf: true });
  public readonly routeActivated = signal(false);
  public readonly hasChildren = signal(false);
  public readonly childStates = signal<VerticalMenuItemState[]>([]);
  public readonly expanded = signal(false);

  public hasActiveRoute(): boolean {
    return this.routeActivated() || this.childStates().some(x => x.hasActiveRoute());
  }
}

