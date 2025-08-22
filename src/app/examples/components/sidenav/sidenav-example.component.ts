import { Component, ChangeDetectionStrategy, signal, input } from '@angular/core';
import { SidenavMode, SidenavModule, SidenavPosition } from '@bootkit/ng0/components/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'app-examples-sidenav',
    templateUrl: './sidenav-example.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        SidenavModule,
        // LayoutModule
    ]
})
export class SidenavExampleComponent {
    sidenav1 = {
        position: signal<SidenavPosition>('start'),
        open: signal(false),
        fixed: signal(true),
        mode: signal<SidenavMode>('push'),
        width: 100,
        hasBackdrop: signal(true)
    }

    sidenav2 = {
        position: signal<SidenavPosition>('start'),
        open: signal(false),
        fixed: signal(false),
        mode: signal<SidenavMode>('over'),
        width: 200,
        hasBackdrop: signal(true)
    }

    constructor(private observer: BreakpointObserver) {
        observer.observe(Breakpoints.Medium).subscribe(res => {
            console.log(res)
        })
    }
}
