import { Component, ChangeDetectionStrategy, signal, input } from '@angular/core';
import { SidenavMode, SidenavModule, SidenavPosition } from '@bootkit/ng0/components/sidenav';


@Component({
    selector: 'app-examples-sidenav',
    templateUrl: './sidenav-example.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        SidenavModule
    ]
})
export class SidenavExampleComponent {

    sidenav1 = {
        open: signal(false),
        fixed: signal(false),
        mode: signal<SidenavMode>('push'),
        position: signal<SidenavPosition>('start'),
        width: 100
    }

    sidenav2 = {
        open: signal(false),
        fixed: signal(false),
        mode: signal<SidenavMode>('over'),
        position: signal<SidenavPosition>('end'),
        width: 200
    }

    constructor() {
    }
}
