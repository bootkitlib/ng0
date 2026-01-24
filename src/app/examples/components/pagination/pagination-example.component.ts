import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PaginationModule } from '@bootkit/ng0/components/pagination';

@Component({
    selector: 'app-examples-pagination',
    templateUrl: './pagination-example.component.html',
    standalone: true,
    imports: [
        CommonModule,
        PaginationModule
    ]
})
export class PopoverExampleComponent {
    selectedPage = 0;
}
