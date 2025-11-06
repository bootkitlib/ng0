import { Component, signal } from '@angular/core';
import { SidenavMode, SidenavModule, SidenavPosition } from '@bootkit/ng0/components/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-examples-sidenav',
    templateUrl: './sidenav-example.component.html',
    // changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        SidenavModule,
    ]
})
export class SidenavExampleComponent {
    examples = {
        basicUsage: {
            sidenav1: {
                position: signal<SidenavPosition>('start'),
                open: signal(true),
                mode: signal<SidenavMode>('push'),
                size: '100px',
                hasBackdrop: signal(false)
            },
            sidenav2: {
                position: signal<SidenavPosition>('start'),
                open: signal(false),
                mode: signal<SidenavMode>('push'),
                size: 'small',
                hasBackdrop: signal(false)
            }
        }
    }

    constructor(private observer: BreakpointObserver) {
        observer.observe(Breakpoints.Medium).subscribe(res => {
            // console.log(res)
        })
    }
}
