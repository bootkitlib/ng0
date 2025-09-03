import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableModule } from '@bootkit/ng0/components/table';
import { ArrayDataSource, AsyncDataSource, DataLoader, DataRequest, DataResult } from '@bootkit/ng0/data';
import { HttpService } from '@bootkit/ng0/http';
import { delay, map, of } from 'rxjs';
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
    // source3: DataLoader = req => this.httpService.get('products', {
    //     // transferState: {},
    //     id: 'products',
    //     params: {
    //         // limit: req.page?.size!,
    //         // skip: (req.page?.index! - 1) * req.page?.size!
    //     }
    // }).pipe(
    //     map((r: any) => new DataResult(r.products, r.total)),
    //     delay(0)
    // );
    source4 = new AsyncDataSource(req => this.httpService.getDataResult('invalid-path', req));
    source5 = new AsyncDataSource(req => of(new DataResult(Array1, Array1.length)).pipe(delay(2000)));

    constructor(private httpService: HttpService) {
    }
}
