import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit } from '@angular/core';
import { DataResult } from '@bootkit/ng0/data';
import { Observable } from 'rxjs';

@Component({
    selector: 'ng0-autocomplete-container',
    templateUrl: './autocomplete-container.component.html',
    standalone: true,
    imports: [CommonModule],
    // changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `:host {display: block;}`
})
export class AutocompleteContainerComponent implements OnInit {
    public dataResult$!: Observable<DataResult>;
    public itemSelect = new EventEmitter<any>();

    constructor() {
    }

    ngOnInit(): void {
    }
}
