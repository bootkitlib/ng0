import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { VerticalMenuItemComponent } from './item.component';

@Injectable()
export class VerticalMenuState {
    private _itemExpandedSubject = new Subject<VerticalMenuItemComponent>();
    public itemExpanded = this._itemExpandedSubject.asObservable();

    public notifyItemExpanded(item: VerticalMenuItemComponent) {
        this._itemExpandedSubject.next(item);
    }
}