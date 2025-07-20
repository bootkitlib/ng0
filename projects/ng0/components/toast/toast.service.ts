import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, Injector } from '@angular/core';
import { ToastComponent } from './toast.component';
import { ToastConfig } from './types';
import { ToastRef } from './toast-ref';


/**
 * Service for displaying toast notifications in the application.
 *
 * The `ToastService` provides methods to open toast messages with customizable content,
 * header, style, position, and duration. It manages the lifecycle of toast notifications,
 * ensuring only one toast is visible at a time.
 *
 * @example
 * // Open a simple toast
 * toastService.open('Message body', 'Header', 'success');
 *
 * @example
 * // Open a toast with configuration
 * toastService.open({
 *   body: 'Message body',
 *   header: 'Header',
 *   style: 'success',
 *   verticalPosition: 'bottom',
 *   horizontalPosition: 'end',
 *   duration: 5000
 * });
 *
 * @remarks
 * - Only one toast can be displayed at a time; opening a new toast closes the previous one.
 * - The toast will automatically close after the specified duration (default: 3000ms).
 *
 * @publicApi
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _toastRef?: ToastRef;

  constructor(private _overlayService: Overlay, private _injector: Injector) { }

  open(body: string, header?: string, style?: string): ToastRef;
  open(config: ToastConfig): ToastRef;
  open(p: any): ToastRef {
    if (this._toastRef) {
      this._toastRef.close();
    }

    const config: ToastConfig =
      typeof p === 'object' ? p :
        { body: arguments[0], header: arguments[1], style: arguments[2] } as ToastConfig;

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
    componentRef.instance.toastRef = this._toastRef = new ToastRef(config, overlayRef);

    setTimeout(() => {
      this._toastRef?.close();
    }, config?.duration ?? 3000);

    return this._toastRef;
  }
}
