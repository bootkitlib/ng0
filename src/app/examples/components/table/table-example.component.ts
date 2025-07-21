import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableModule } from '@bootkit/ng0/components/table';
import { ArrayDataSource, AsyncDataSource, DataLoader, DataRequest, DataResult } from '@bootkit/ng0/data';
import { HttpService } from '@bootkit/ng0/http';
import { map } from 'rxjs';

interface ProductDataResult {
    products: any[];
    total: number;
    take: number;
    skip: number;
}

@Component({
    selector: 'app-data-table-example',
    templateUrl: './table-example.component.html',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TableModule
    ],
})
export class DataTableExampleComponent {
    source1 = [
        { id: 1, name: 'Item 1', description: 'Description 1' },
        { id: 2, name: 'Item 2', description: 'Description 2' },
        { id: 3, name: 'Item 3', description: 'Description 3' }
    ];

    source2 = new ArrayDataSource([
        { id: 4, name: 'Item 4', description: 'Description 4' },
        { id: 5, name: 'Item 5', description: 'Description 5' },
        { id: 6, name: 'Item 6', description: 'Description 6' }
    ]);

    source3: DataLoader = req => this.httpService.getDataResult('products', req);

    source4 = new AsyncDataSource(req => this.httpService.getDataResult('https://dummyjson.com/products', req));


    constructor(private httpService: HttpService) {
    }
}
