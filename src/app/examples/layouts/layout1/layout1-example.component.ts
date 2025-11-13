import { Component, ChangeDetectionStrategy, inject, signal, ViewChild, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Layout1Manager } from '@bootkit/ng0/layouts/layout1';
import { Layout1SecondarySidenav } from '@bootkit/ng0/layouts/layout1/secondary-sidenav';

@Component({
    selector: 'app-examples-layouts-layout1',
    templateUrl: './layout1-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
    ]
})
export class Layout1ExampleComponent {
    protected _layoutManager = inject(Layout1Manager);
    protected _sidenav1!: Layout1SecondarySidenav;

    _showSidenav1(template: TemplateRef<any>) {
        this._sidenav1 = this._layoutManager.pushSidenav(template, { closeOnBackdropClick: true });

        this._sidenav1.disposed.subscribe((result: any) => {
            console.log('Sidenav 1 disposed', result);
        });
    }

    _toggleStickyHeader() {

    }
}
