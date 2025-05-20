import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from '@bootkit/ng0/toast';

@Component({
    selector: 'app-toast-example',
    templateUrl: './toast-example.component.html',
    standalone: true,
    imports: [
        CommonModule,
    ]
})
export class ToastExampleComponent {
    constructor(private toast: ToastService) {
    }

    show() {
        this.toast.open({
            message: 'Message!',
            title: 'Title',
            icon: 'fas fa-user',
            horizontalPosition: 'center',
            verticalPosition: 'top',
            closeButton: true,
            duration: 1000
        })
    }
}
