export type DataTableSelectionMode = 'single' | 'multiple';

export interface DataTableSelectionSettings {
  mode: DataTableSelectionMode;
  selected: any[];
  // onSelect?: (item: any) => void;
  // onDeselect?: (item: any) => void;
}

export interface DataTablePagingSettings {
  pageSizes?: number[];

}


/**
 * Options for configuring the table's paging behavior.
 */
export interface TablePagingOptions {
  showPagingControls?: boolean;

  pageSize?: number;

  /**
   * Array of page size options to display in the page size selector.
   * If not provided, the default page size options will be used.
   */
  pageSizeOptions?: number[];

  /**
   * If true, the table will show a page size selector.
   */
  showPageSizeOptions?: boolean;
  showPageSizeSelectorLabel?: boolean;

  showNextPreviousButtons?: boolean;
  showFirstLastButtons?: boolean;

  /**
   * Maximum number of visible pages.
   * Default is 10.
   */
  maxVisiblePages?: number;

  /**
   * If true, the table will show paging info at the bottom.
   * This will show the number of records displayed and total records.
   */
  showPagingInfo?: boolean;
}

