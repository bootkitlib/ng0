import { AfterContentInit, Component, ContentChild, ContentChildren, DestroyRef, input, OnDestroy, OnInit, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { TableColumnDirective } from './table-column.directive';
import { TableDetailRowDirective } from './table-detail-row.directive';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TablePagingComponent } from './paging/paging.component';
import { formatString } from '@bootkit/ng0/common';
import { LocalizationModule } from '@bootkit/ng0/localization';
import { ArrayDataSource, AsyncDataSource, DataLoader, DataRequest, DataRequestFilter, DataSource } from '@bootkit/ng0/data';

@Component({
  selector: 'ng0-table',
  exportAs: 'ng0Table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LocalizationModule,
    TablePagingComponent
  ]
})
export class TableComponent implements OnInit, AfterContentInit, OnDestroy {
  /**
   * The data source for the table.
   * This can be an array of data, a function that returns an observable of data,
   * or an instance of DataSource.
   */
  public source = input.required<Array<any> | DataLoader | DataSource | undefined | null>();

  /**
   * If true, the table will automatically load data when initialized.
   * This is useful for tables that need to display data immediately without user interaction.
   */
  public autoLoad = input(true);

  /**
   * If true, the table will show row numbers.
   * This will add a column to the left of the table with the row numbers.
   */
  public showRowNumbers = input(false);

  /** 
   * If true, the table will show the header row.
   */
  public showHeader = input(true);

  /**
   * If true, the table will support pagination.
   * If false, the table will load all records at once.
   */
  public pagable = input(true);

  /**
   * If true, the table will show pagination controls at the bottom.
   */
  public showPagination = input(true);

  /** 
   * The number of records to show per page.
   * This is only used if pagable is true.
   */
  public pageSize = input(10);

  /**
   * The current page index.
   * This is only used if pagable is true.
   * The first page is 0.
   */
  public pageIndex = input(0);

  /**
   * The CSS class to apply to the table element.
   * This can be used to apply custom styles to the table.
   */
  public tableClass = input<string | string[]>();

  /**
   * The CSS class to apply to the header element.
   */
  public headerClass = input<string>();

  /**
   * The caption of the table.
   */
  public caption = input<string>();
  public height = input<number>();

  /**
   * If true, the table will support filtering.
   * This will add a filter input to each column header.
   */
  public filterable = input(false);

  // @Input() rowColor?: (row: any) => BootstrapColor;

  @ContentChildren(TableColumnDirective)
  protected _columns!: QueryList<TableColumnDirective>;

  @ContentChild(TableDetailRowDirective)
  protected _detailRow?: TableDetailRowDirective;

  protected _data?: any[];
  protected _totalRecords?: number;
  protected _totalPages?: number;
  protected _rowStates = new Map<any, { expanded: boolean }>();
  protected _formatString = formatString;
  private _changeSubscription?: Subscription;
  protected _dataSource!: DataSource;

  constructor(private _destroyRef: DestroyRef) {
  }

  ngOnInit(): void {
    if (Array.isArray(this.source())) {
      this._dataSource = new ArrayDataSource(this.source() as Array<any>);
    } else if (typeof this.source() == 'function') {
      this._dataSource = new AsyncDataSource(this.source() as DataLoader);
    } else if (this.source() instanceof DataSource) {
      this._dataSource = this.source() as DataSource;
    } else if (this.source() == undefined) {
      this._dataSource = new ArrayDataSource([]);
    } else {
      throw new Error('Invalid data source provided to ng0-table.');
    }

    // this._changeSubscription = this.dataSource().change.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(result => {
    //   this.reload();
    // });
  }

  ngAfterContentInit(): void {
    if (this.autoLoad()) {
      this.reload();
    }
  }

  reload() {
    const filters = this._columns
      .filter(x => x.filterable && x.filterValue != '' && x.filterValue != undefined)
      .map(col => ({ field: col.filterField ?? col.field!, value: col.filterValue, operator: 'EQ' }));
    let pageIndex: number | undefined;
    let pageSize: number | undefined;

    if (this.pagable()) {
      pageIndex = this.pageIndex();
      pageSize = this.pageSize();
    }

    var dr = new DataRequest({ pageIndex, pageSize, filters })
    this._dataSource.load(dr).pipe(takeUntilDestroyed(this._destroyRef)).subscribe(result => {
      this._data = result.data;
      this._totalRecords = result.total;
      this._totalPages = Math.ceil(result.total! / this.pageSize());
    });
  }

  get loading() {
    return this._dataSource.loading;
  }

  protected _getCellValue(row: any, col: TableColumnDirective) {
    var subFields = col.field!.split('.');
    let value = row[subFields[0]];
    for (let i = 1; i < subFields.length; i++) {
      if (value == null) break;
      value = value[subFields[i]];
    }

    return value;
  }

  protected onNextPageClick() {
    // ++this.pageIndex()
    this.reload();
  }

  protected onPreviousPageClick() {
    // --this.pageIndex
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
