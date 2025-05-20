import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LayoutContentPosition } from './types';
import { PanelComponent } from './panel.component';

@Injectable()
export class LayoutComponentState {
    private _layoutChangeSubject = new Subject<LayoutContentPosition>();
    public readonly layoutChange = this._layoutChangeSubject.asObservable();

    private _panelChangeSubject = new Subject<PanelComponent>();
    public readonly panelChange = this._panelChangeSubject.asObservable();

    public panelChanged(panel: PanelComponent): void {
        this._panelChangeSubject.next(panel);
    }

    public layoutChanged(position: LayoutContentPosition): void {
        this._layoutChangeSubject.next(position);
    }
}
