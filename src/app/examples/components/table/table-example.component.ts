import { CommonModule, isPlatformServer } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TableModule } from '@bootkit/ng0/components/table';
import { DataLoader, DataRequest, DataResult, LocalDataSource } from '@bootkit/ng0/data';
import { HttpService } from '@bootkit/ng0/http';
import { delay, of } from 'rxjs';
import { Array1, Array2 } from './data';
import { Sexuality } from 'src/app/common/enums';

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
    _platformId = inject(PLATFORM_ID);
    _isServer = isPlatformServer(this._platformId);
    _delay = this._isServer ? 0 : 1000; // No delay on server to speed up SSR rendering.

    Sexuality = Sexuality;
    array1 = Array1;
    dataLoader1: DataLoader = (req: DataRequest) =>
        new LocalDataSource(Array2).load(req).pipe(delay(this._delay));

    // source3 = new ArrayDataSource(Array2);

    constructor(private httpService: HttpService) {
    }
}
