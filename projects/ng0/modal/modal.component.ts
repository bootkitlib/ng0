import { Component, Output, EventEmitter, ChangeDetectionStrategy, input, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCloseRequest } from './types';

@Component({
    selector: 'ng0-modal',
    exportAs: 'ng0Modal',
    templateUrl: 'modal.component.html',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
    ]
})
export class ModalComponent {
    public header = input<string>();
    public scrollable = input<boolean>(false);

    /** Is modal vertically centered? */
    public centered = input<boolean>(false);
    public size = input<'sm' | 'default' | 'lg' | 'xl'>('default');
    public fullscreen = input<'always' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'>();
    @Output() public closeRequest = new EventEmitter<ModalCloseRequest>();
    @Output() public backdropClick = new EventEmitter();

    protected _modalStatic = signal(false);

    constructor() {
    }

    protected _onBackdropClick() {
        this.backdropClick.emit();
        this._modalStatic.set(true)
        var timeout = setTimeout(() => {
            this._modalStatic.set(false)
            clearTimeout(timeout);
        }, 100);
    }

    @HostListener('document:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        this.closeRequest.emit();
      }
    }
}
