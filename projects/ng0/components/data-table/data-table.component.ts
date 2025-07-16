import { AfterContentInit, Component, ContentChild, ContentChildren, DestroyRef, input, Input, OnDestroy, OnInit, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataTableColumnDirective } from './data-table-column.directive';
import { DataTableDetailRowDirective } from './data-table-detail-row.directive';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DataTablePagingComponent } from './paging/paging.component';
import { formatString } from '@bootkit/ng0/common';
import { LocalizationModule } from '@bootkit/ng0/localization';
import { DataRequest, DataRequestFilter, DataSource } from '@bootkit/ng0/data';

@Component({
  selector: 'ng0-data-table',
  exportAs: 'ng0DataTable',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LocalizationModule,
    DataTablePagingComponent
  ]
})
export class DataTableComponent implements OnInit, AfterContentInit, OnDestroy {
  @Input() dataSource!: DataSource;
  @Input() autoLoad = true;
  rowNumber = input<boolean>(false);
  @Input() showHeader = true;
  @Input() pagable = true;
  pagination = input<boolean>(true);
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Input() showPagination = true;
  tableClass = input<string>();
  headClass = input<string>();
  caption = input<string>();
  @Input() height?: string;
  @Input() filterable = false;
  // @Input() rowColor?: (row: any) => BootstrapColor;

  @ContentChildren(DataTableColumnDirective) protected _columns!: QueryList<DataTableColumnDirective>;
  @ContentChild(DataTableDetailRowDirective) protected _detailRow?: DataTableDetailRowDirective;

  protected _data?: any[];
  protected _totalRecords?: number;
  protected _totalPages?: number;
  protected _rowStates = new Map<any, { expanded: boolean }>();
  protected _formatString = formatString;
  private _changeSubscription?: Subscription;

  constructor(private _destroyRef: DestroyRef) {

  }

  ngOnInit(): void {
    this._changeSubscription = this.dataSource.change.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(result => {
      this.reload();
    });
  }

  ngAfterContentInit(): void {
    if (this.autoLoad) {
      this.reload();
    }
  }

  reload() {
    const filters = this._columns
      .filter(x => x.filterable && x.filterValue != '' && x.filterValue != undefined)
      .map(col => new DataRequestFilter(col.filterField ?? col.field!, col.filterValue));
    let pageIndex: number | undefined; 
    let pageSize: number | undefined;

    if (this.pagable) {
      pageIndex = this.pageIndex;
      pageSize = this.pageSize;
    }

    var dr = new DataRequest(pageIndex, pageSize, this.pagable == true, filters)
    this.dataSource.load(dr).pipe(takeUntilDestroyed(this._destroyRef)).subscribe(result => {
      this._data = result.data;
      this._totalRecords = result.total;
      this._totalPages = Math.ceil(result.total! / this.pageSize);
    });
  }

  get loading() {
    return this.dataSource.loading;
  }

  protected _getCellValue(row: any, col: DataTableColumnDirective) {
    var subFields = col.field!.split('.');
    let value = row[subFields[0]];
    for (let i = 1; i < subFields.length; i++) {
      if (value == null) break;
      value = value[subFields[i]];
    }

    return value;
  }

  protected onNextPageClick() {
    ++this.pageIndex
    this.reload();
  }

  protected onPreviousPageClick() {
    --this.pageIndex
    this.reload();
  }

  protected onToggleRowDetailClick(row: any) {
    var state = this._rowStates.get(row)
    if (!state) {
      this._rowStates.set(row, { expanded: true });
    } else {
      state.expanded = !state.expanded;
    }
  }

  protected isRowExpanded(row: any) {
    var state = this._rowStates.get(row)
    return state == undefined ? false : state.expanded;
  }

  ngOnDestroy(): void {
    this._changeSubscription?.unsubscribe();
  }
}
