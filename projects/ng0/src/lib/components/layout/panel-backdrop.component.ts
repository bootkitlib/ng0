import { Component, ElementRef} from '@angular/core';

@Component({
    selector: 'jss-panel-backdrop',
    exportAs: 'jssPanelBackdrop',
    styleUrls: ['./panel-backdrop.component.scss'],
    template: ''
})
export class PanelBackdropComponent {
    constructor(public elementRef: ElementRef) {
    }
}
