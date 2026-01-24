import { Component, Output, EventEmitter, ChangeDetectionStrategy, input, signal, HostListener, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalCloseRequest } from './types';

@Component({
    selector: 'ng0-modal',
    exportAs: 'ng0Modal',
    templateUrl: 'modal.component.html',
    styleUrls: ['./modal.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule],
})
export class ModalComponent {
    protected readonly _modalStatic = signal(false);

    /**
     * Is modal open?
     */
    public readonly open = input(true, { transform: booleanAttribute });

    /**
     * Is modal scrollable?
     */
    public readonly scrollable = input(false, { transform: booleanAttribute });

    /** Is modal vertically centered? */
    public readonly centered = input(false, { transform: booleanAttribute });

    /**
     * Size of the modal.
     */
    public readonly size = input<'sm' | 'default' | 'lg' | 'xl'>('default');

    /**
     * Is modal fullscreen?
     */
    public readonly fullscreen = input<'always' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'>();

    /**
     * Emitted when user clicks the backdrop or presses the escape key.
     */
    @Output() public readonly closeRequest = new EventEmitter<ModalCloseRequest>();

    /**
     * Emitted when the backdrop is clicked.
     */
    @Output() public readonly backdropClick = new EventEmitter<Event>();

    protected _onBackdropClick(event: MouseEvent) {
        this.closeRequest.emit({ reason: 'backdrop', event });
        this.backdropClick.emit(event);
        this._shakeModal(); // if user closes the modal, shake will not occure.
    }

    @HostListener('document:keydown', ['$event'])
    protected _onDocumentKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            this.closeRequest.emit({ reason: 'escape', event });
            this._shakeModal();
        }
    }

    private _shakeModal() {
        this._modalStatic.set(true);
        setTimeout(() => this._modalStatic.set(false), 100);
    }
}
