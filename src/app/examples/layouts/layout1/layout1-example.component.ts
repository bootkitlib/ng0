import { Component, ChangeDetectionStrategy, inject, signal, ViewChild, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Layout1Manager } from '@bootkit/ng0/layouts/layout1';
import { Layout1SecondarySidenav } from '@bootkit/ng0/layouts/layout1/types';

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
    public readonly manager = inject(Layout1Manager);
    @ViewChild('t', { static: true }) t!: TemplateRef<any>;

    showSidenav1 = signal(false);
    sidenav!: Layout1SecondarySidenav;

    onClick() {
        this.sidenav = this.manager.pushSidenav(this.t, { css: 'bg-secondary', closeOnBackdropClick: true });
    }
}
