import { Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from '@bootkit/ng0/components/button';
import { HttpService } from '@bootkit/ng0/http';
import { delay } from 'rxjs';

@Component({
    selector: 'app-button-example',
    templateUrl: './button-example.component.html',
    styleUrls: ['./button-example.component.css'],
    standalone: true,
    imports: [
        ButtonModule
    ]

})
export class ButtonExampleComponent {
    counter1 = 0;
    counter2 = 0;

    constructor(private httpService: HttpService, private destroyRef: DestroyRef) {

    }

    sendHttpRequest(requestId: string) {
        this.httpService.get('https://jsonplaceholder.typicode.com/posts/1', {
            id: requestId
        }).pipe(
            // Simulate a delay
            delay(2000),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }

}
