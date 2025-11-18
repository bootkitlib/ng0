import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { OffcanvasModule } from '@bootkit/ng0/components/offcanvas';

@Component({
    selector: 'app-example-bootkitpro-components-offcanvas',
    templateUrl: './offcanvas-example.component.html',
    standalone: true,
    imports: [CommonModule, OffcanvasModule]
})
export class OffcanvasExampleComponent {
    show1 = signal(false);
    show2 = signal(false);

    onClick() {
        this.show1.set(false)
    }
}
