import {
  Component, Output, EventEmitter, ChangeDetectionStrategy,
  input, signal, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCloseRequest } from './types';

type BackdropBehavior = 'close' | 'static' | 'none';

@Component({
  selector: 'ng0-modal',
  exportAs: 'ng0Modal',
  templateUrl: 'modal.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ModalComponent {
  // layout
  public scrollable  = input<boolean>(false);
  public centered    = input<boolean>(false);
  public size        = input<'sm' | 'default' | 'lg' | 'xl'>('default');
  public fullscreen  = input<'always' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'>();

  // behavior
  public backdrop    = input<BackdropBehavior>('close'); // 'close' | 'static' | 'none'
  public closeOnEsc  = input<boolean>(true);
  public staticMs    = input<number>(150);

  @Output() public closeRequest  = new EventEmitter<ModalCloseRequest>();
  @Output() public backdropClick = new EventEmitter<MouseEvent>();

  protected _modalStatic = signal(false);

  protected _onBackdropClick(ev?: MouseEvent) {
    this.backdropClick.emit(ev!);
    const behavior = this.backdrop();

    if (behavior === 'close') {
      this.closeRequest.emit({ reason: 'backdrop', sourceEvent: ev });
      return;
    }
    if (behavior === 'static') {
      this._modalStatic.set(true);
      setTimeout(() => this._modalStatic.set(false), this.staticMs());
      return;
    }

  }

  /** optional: close programmatically */
  public requestClose() {
    this.closeRequest.emit({ reason: 'programmatic' });
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.closeOnEsc()) {
      this.closeRequest.emit({ reason: 'escape', sourceEvent: event });
    }
  }
}
