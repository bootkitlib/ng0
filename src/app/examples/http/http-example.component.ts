import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataRequest, DataResult } from '@bootkit/ng0/data';
import { HttpService, provideHttpService } from '@bootkit/ng0/http';
import { LocalizationModule } from '@bootkit/ng0/localization';

@Component({
    selector: 'app-examples-http',
    templateUrl: './http-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule
    ]
})
export class HttpExampleComponent {
    response1 = '';
    response2 = '';

    constructor(private httpService: HttpService) {
    }

    getData() {
        var request = new DataRequest({});

        this.httpService.getDataResult('products', request).subscribe({
            next: (data) => {
                this.response1 = JSON.stringify(data);
            },
            error: (error) => {
                console.error('Error fetching data:', error);
            }
        });
    }
}
