import { AfterContentInit, ChangeDetectionStrategy, Component, computed, ContentChild, ContentChildren, DestroyRef, HostBinding, input, OnDestroy, OnInit, QueryList, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { TableColumnDirective } from './table-column.directive';
import { TableDetailRowDirective } from './table-detail-row.directive';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { formatString } from '@bootkit/ng0/common';
import { LocalizationModule, LocalizationService, TableComponentPagingFormatter } from '@bootkit/ng0/localization';
import { DataRequest, DataRequestFilter, DataRequestPage, DataRequestSort, DataResult, DataSource, convertToDataSource, DataSourceLike } from '@bootkit/ng0/data';
import { PaginationComponent } from '@bootkit/ng0/components/pagination';
import { TablePagingOptions } from './types';

/**
 * A generic table component that can display data in a tabular format.
 * It supports features like pagination, sorting, filtering, and row details.
 * It can be used with any data source that implements the DataSource interface.
 */
@Component({
  selector: 'ng0-table',
  exportAs: 'ng0Table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LocalizationModule,
    PaginationComponent
  ]
})
export class TableComponent implements OnInit, AfterContentInit, OnDestroy {

  /**
   * The data source for the table.
   * This can be an array of data, a function that returns an observable of data,
   * or an instance of DataSource.
   */
  public source = input.required<DataSourceLike<any>>();

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
  public pageable = input<TablePagingOptions | undefined, TablePagingOptions | boolean>(undefined, {
    transform: v => {
      if (v === undefined || v === null || v === false) {
        return undefined;
      }

      if (v === true) {
        v = {};
      }

      v.pageIndex = v.pageIndex ?? 1;
      v.pageSize = v.pageSize ?? 10;
      v.maxVisiblePages = v.maxVisiblePages ?? 10;
      v.showPagingControls = v.showPagingControls ?? true;
      return v;
    }
  });

  /**
   * If true, the table will support sorting.
   * This will add a sort icon to each column header.
   */
  public sortable = input(true);

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

  /**
   * The height of the table in pixels.
   * This can be used to set a fixed height for the table.
   */
  public height = input<number>();

  /**
   * If true, the table will support filtering.
   * This will add a filter input to each column header.
   */
  public filterable = input(false);

  /**
   * The indicator to show while the table is loading data for the first time.
   */
  public loadingIndicator = input<'none' | 'simple' | 'spinner', boolean | 'none' | 'simple' | 'spinner'>('spinner', {
    transform: v => {
      if (typeof v === 'boolean') {
        return v ? 'spinner' : 'none';
      }
      return v;
    }
  });

  /** If true, the table will show a loading cover while data is being loaded.
   * This can be used to prevent user interaction with the table while loading.
   * This cover is not displayed when the table is loading for the first time.
   * Instead, the table will show a loading based on loadingIndicator settings.
   */
  public loadingCover = input<'none' | 'simple' | 'spinner', boolean | 'none' | 'simple' | 'spinner'>('spinner', {
    transform: v => {
      if (typeof v === 'boolean') {
        return v ? 'spinner' : 'none';
      }
      return v;
    }
  });

  // @Input() rowColor?: (row: any) => BootstrapColor;

  @ContentChildren(TableColumnDirective)
  protected _columns!: QueryList<TableColumnDirective>;

  @ContentChild(TableDetailRowDirective)
  protected _detailRow?: TableDetailRowDirective;

  protected _dataResult = signal<DataResult | undefined>(undefined);
  protected _lastRequest?: DataRequest; // The last data request made to the data source
  protected _loadingRequest?: DataRequest; // The current data request being processed
  protected _rowStates = new Map<any, { expanded: boolean }>();
  protected _formatString = formatString;
  private _changeSubscription?: Subscription;
  protected _dataSource!: DataSource;
  protected _pagingFormatter!: TableComponentPagingFormatter;
  protected _lastError?: any;

  constructor(protected _ls: LocalizationService, private _destroyRef: DestroyRef) {
  }

  ngOnInit(): void {
    this._dataSource = convertToDataSource(this.source());
    const locale = this._ls.get();
    this._pagingFormatter = locale?.definition.components?.table?.pagingInfo ??
      ((o) => `Showing ${o.firstRecord}-${o.lastRecord} of ${o.totalRecords} records`);

    // this._changeSubscription = this.dataSource().change.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(result => {
    //   this.reload();
    // });

    if (this.autoLoad()) {
      this.load(this.pageable()?.pageIndex);
    }
  }

  ngAfterContentInit(): void {

  }

  /**
   * Load data for the specified page index (optional).
   * @param pageIndex The page index to load.
   */
  public load(pageIndex?: number) {
    let page: DataRequestPage | undefined;
    let filters: DataRequestFilter[] = [];
    let sort: DataRequestSort | undefined;

    if (this.filterable()) {
      // this._columns.forEach(col => {
      //   if (col.filterable && col.filterValue != '' && col.filterValue != undefined) {
      //     filters.push({ field: col.filterField ?? col.field!, value: col.filterValue, operator: 'EQ' });
      //   }
      // });
    }

    if (this.pageable()) {
      page = {
        index: pageIndex || this._lastRequest?.page?.index || 1,
        size: this._lastRequest?.page?.size || 10,
        zeroBased: false
      };
    }

    if (this.sortable()) {
      // sort = ...
    }

    this._loadingRequest = new DataRequest({ page, filters, sort, select: [], computeTotal: true });

    this._dataSource.load(this._loadingRequest)
      .pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
        next: result => {
          this._dataResult.set(result);
          this._lastRequest = this._loadingRequest;
          this._loadingRequest = undefined;
          this._lastError = undefined;
        }, error: err => {
          this._lastError = err;
          this._lastRequest = this._loadingRequest;
          this._loadingRequest = undefined;
        }
      });
  }

  /**
   * Determines if the table is currently loading data.
   */
  @HostBinding('class.ng0-loading')
  public get isLoading() {
    return this._dataSource.isLoading;
  }

  protected _getCellValue(row: any, col: TableColumnDirective) {
    var subFields = col.field()!.split('.');
    let value = row[subFields[0]];
    for (let i = 1; i < subFields.length; i++) {
      if (value == null) break;
      value = value[subFields[i]];
    }

    return value;
  }


  protected _onPageChange(pageIndex: number) {
    this.load(pageIndex);
  }

  protected _onToggleRowDetailClick(row: any) {
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
