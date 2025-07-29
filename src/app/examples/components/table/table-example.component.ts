import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableModule } from '@bootkit/ng0/components/table';
import { ArrayDataSource, AsyncDataSource, DataLoader, DataRequest, DataResult } from '@bootkit/ng0/data';
import { HttpService } from '@bootkit/ng0/http';
import { map } from 'rxjs';
import { Array1, Array2 } from './data';

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
    source1 = Array1;
    source2 = new ArrayDataSource(Array2);
    source3: DataLoader = req => this.httpService.getDataResult('products', req);
    source4 = new AsyncDataSource(req => this.httpService.getDataResult('https://dummyjson.com/products', req));


    constructor(private httpService: HttpService) {
    }
}
