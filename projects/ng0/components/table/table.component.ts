import { AfterContentInit, booleanAttribute, ChangeDetectionStrategy, Component, ContentChild, ContentChildren, DestroyRef, HostBinding, inject, input, model, numberAttribute, OnDestroy, QueryList, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { TableColumnDirective } from './table-column.directive';
import { TableDetailRowDirective } from './table-detail-row.directive';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { formatString } from '@bootkit/ng0/common';
import { LocalizationModule, LocalizationService, TableComponentPagingFormatter } from '@bootkit/ng0/localization';
import { DataRequest, DataRequestFilter, DataRequestPage, DataRequestSort, DataResult, DataSource, dataSourceAttribute, DataSourceLike } from '@bootkit/ng0/data';
import { PaginationComponent } from '@bootkit/ng0/components/pagination';
import { OverlayModule } from '@angular/cdk/overlay';
import { NumberDirective } from '@bootkit/ng0/form';
import { ItemSelectEvent, SelectComponent } from '@bootkit/ng0/components/select';

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
    PaginationComponent,
    NumberDirective,
    OverlayModule,
    SelectComponent
  ]
})
export class TableComponent implements AfterContentInit, OnDestroy {
  protected readonly _ls = inject(LocalizationService);
  private readonly _destroyRef = inject(DestroyRef);
  private _changeSubscription?: Subscription;

  @ContentChildren(TableColumnDirective)
  protected _columns!: QueryList<TableColumnDirective>;

  @ContentChild(TableDetailRowDirective)
  protected _detailRow?: TableDetailRowDirective;

  protected readonly _dataResult = signal<DataResult | undefined>(undefined);
  protected readonly _error = signal(undefined);
  protected _rowStates = new Map<any, { expanded: boolean }>();
  protected _formatString = formatString;
  protected _pagingFormatter!: TableComponentPagingFormatter;


  /**
   * The data source for the table.
   * This can be an array of data, a function that returns an observable of data,
   * or an instance of DataSource.
   */
  public readonly source = input.required<DataSource<any>, DataSourceLike<any>>({ transform: dataSourceAttribute });

  /**
   * If true, the table will automatically load data when initialized.
   * This is useful for tables that need to display data immediately without user interaction.
   */
  public readonly autoLoad = input(true, { transform: booleanAttribute });

  /**
   * If true, the table will show row numbers.
   * This will add a column to the left of the table with the row numbers.
   */
  public readonly showRowNumbers = input(false, { transform: booleanAttribute });

  /** 
   * If true, the table will show the header row.
   */
  public readonly showHeader = input(true, { transform: booleanAttribute });

  /**
   * If true, the table will support pagination.
   */
  public readonly pageable = input(false, { transform: booleanAttribute });

  /**
   * The currently selected page in the table.
   * @default 0
   */
  public readonly pageIndex = model(0);

  /**
   * The number of records to display per page.
   * @default 10
   */
  public readonly pageSize = model(10);

  /**
   * Maximum number of visible pages in the pagination controls.
   * @default 10
   */
  public readonly maxVisiblePages = input(10, { transform: numberAttribute });

  /**
   * If true, the table will show pagination controls at the bottom.
   * This will allow users to navigate between pages of data.
   * @default true
   */
  public readonly showPagingControls = input(true, { transform: booleanAttribute });

  /**
   * Whether to show the first and last buttons in the pagination controls.
   * @default true
   */
  public readonly showFirstLastButtons = input(false, { transform: booleanAttribute });

  /**
   * Whetheer to show the next and previous buttons in the pagination controls.
   * @default true
   */
  public readonly showNextPreviousButtons = input(false, { transform: booleanAttribute });

  /**
   * Array of page size options to display in the page size selector.
   * If not provided, the default page size options will be used.
   * @default true
   */
  public readonly pageSizeOptions = input<number[] | undefined>([10, 25, 50, 100]);

  /**
   * Whether to show paging info at the bottom of the table.
   * This will show the number of records displayed and total records.
   * @default true
   */
  public readonly showPagingInfo = input(true, { transform: booleanAttribute });

  /**
   * If true, the table will support sorting.
   * This will add a sort icon to each column header.
   */
  public readonly sortable = input(true, { transform: booleanAttribute });

  /**
   * The CSS class to apply to the internal table element.
   * This can be used to apply custom styles to the table.
   */
  public readonly tableClass = input<string | string[]>();

  /**
   * The CSS class to apply to the header element.
   */
  public readonly headerClass = input<string>();

  /**
   * The caption of the table.
   */
  public readonly caption = input<string>();

  /**
   * The height of the table in pixels.
   * This can be used to set a fixed height for the table.
   */
  public readonly height = input<number>();

  /**
   * If true, the table will support filtering.
   * This will add a filter input to each column header.
   */
  public readonly filterable = input(false, { transform: booleanAttribute });

  /**
   * The indicator to show while the table is loading data for the first time.
   */
  public readonly loadingIndicator = input<'none' | 'simple' | 'spinner'>('spinner');

  /** If true, the table will show a loading cover while data is being loaded.
   * This can be used to prevent user interaction with the table while loading.
   * This cover is not displayed when the table is loading for the first time.
   * Instead, the table will show a loading based on loadingIndicator settings.
   */
  public readonly loadingCover = input<'none' | 'simple' | 'spinner'>('spinner');

  ngAfterContentInit(): void {
    const locale = this._ls.get();
    this._pagingFormatter = locale?.definition.components?.table?.pagingInfo ??
      ((o) => `Showing ${o.firstRecord}-${o.lastRecord} of ${o.totalRecords} records`);

    // this._changeSubscription = this.dataSource().change.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(result => {
    //   this.reload();
    // });

    if (this.autoLoad()) {
      this.load();
    }
  }

  /**
   * Loads data from the data source based on the current state of the table (pagination, sorting, filtering).
   * This method can be called manually to refresh the data in the table.
   * It will construct a DataRequest object based on the current pagination, sorting, and filtering settings,
   * and then call the load method of the data source with that request.
   */
  public load(pageIndex?: number) {
    let filters: DataRequestFilter[] = [];
    let page: DataRequestPage | undefined;
    let sort: DataRequestSort | undefined;

    if (this.filterable()) {
      this._columns.forEach(col => {
        if (col.filterable() && col.filterValue() != '' && col.filterValue() != undefined) {
          filters.push({ field: col.fieldName() ?? col.filterField() ?? col.field(), value: col.filterValue(), operator: col.filterOperator() });
        }
      });
    }

    if (this.pageable()) {
      if (pageIndex != undefined) {
        this.pageIndex.set(pageIndex);
      }

      page = {
        index: this.pageIndex(),
        size: this.pageSize(),
      };
    }

    if (this.sortable()) {
      let col = this._columns.find(c => c.sortable() && c.sortDirection() != 'none' && (c.field() != '' || c.fieldName() != ''));
      if (col) {
        sort = {
          field: col.fieldName() ?? col.field()!,
          asc: col.sortDirection() === 'asc'
        }
      }
    }

    var request = new DataRequest({ page, filters, sort, select: [], computeTotal: true });

    this.source().load(request)
      .pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
        next: result => {
          this._dataResult.set(result);
          this._error.set(undefined);
        }, error: err => {
          this._error.set(err);
        }
      });
  }

  /**
   * Determines if the table is currently loading data.
   */
  @HostBinding('class.ng0-loading')
  public get isLoading() {
    return this.source().isLoading;
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

  protected _onToggleFilterOperator(col: TableColumnDirective) {
    if (col.showFilterOperators()) {
      col.showFilterOperators.set(false)
    } else {
      this._columns.forEach(x => x.showFilterOperators.set(false));
      col.showFilterOperators.set(true)
    }
  }

  protected _onSelectFilterOperator(col: TableColumnDirective, filterOperator: string) {
    col.filterOperator.set(filterOperator);
    this._columns.forEach(x => x.showFilterOperators.set(false));
    this.load(0);
  }

  _onPageSizeOptionsItemSelect(e: ItemSelectEvent) {
    this.pageSize.set(e.value);
    this.load(0);
  }

  ngOnDestroy(): void {
    this._changeSubscription?.unsubscribe();
  }
}
