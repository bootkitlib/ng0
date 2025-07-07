import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { PaginationModule } from '@bootkit/ng0/pagination';
import { PopoverDirective } from '@bootkit/ng0/popover';

@Component({
    selector: 'app-examples-pagination',
    templateUrl: './pagination-example.component.html',
    styleUrls: ['./pagination-example.component.css'],
    standalone: true,
    imports: [
        CommonModule,
        PaginationModule
    ]
})
export class PopoverExampleComponent {
    selectedPage = 1;
}
