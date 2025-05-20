import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { ToastComponent } from './toast.component';
import { ToastConfig } from './types';
import { ToastRef } from './toast-ref';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _currentToast: ToastRef;

  constructor(private _overlayService: Overlay, private _injector: Injector) { }

  open(messageKey: string, title?: string, titleKey?: string, style?: string): void;
  open(config: ToastConfig): void;
  open(p: any): void {
    if (this._currentToast) {
      this._currentToast.close();
    }

    const config: ToastConfig =
      typeof p === 'object' ? p :
        { messageKey: arguments[0], titleKey: arguments[1], style: arguments[2] } as ToastConfig;

    var portal = new ComponentPortal(ToastComponent, null, this._injector);

    // Position
    var vertical = config.verticalPosition ?? 'top';
    var horizontal = config.horizontalPosition ?? 'center';
    var posStrategy = this._overlayService.position().global();
    const padding = '1rem';

    switch (vertical) {
      case 'top':
        posStrategy = posStrategy.top(padding)
        break;
      case 'bottom':
        posStrategy = posStrategy.bottom(padding)
        break;
    }

    switch (horizontal) {
      case 'center':
        posStrategy = posStrategy.centerHorizontally();
        break;
      case 'end':
        posStrategy = posStrategy.end(padding);
        break;
      case 'start':
        posStrategy = posStrategy.start(padding);
        break;
    }

    var overlayRef = this._overlayService.create({
      positionStrategy: posStrategy,
    });

    var componentRef = overlayRef.attach(portal);
    componentRef.instance._config = config;
    componentRef.instance._toastRef = this._currentToast = new ToastRef(overlayRef);
  }
}
