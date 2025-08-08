export type TableSelectionMode = 'single' | 'multiple';

export interface TableSelectionSettings {
  mode: TableSelectionMode;
  selected: any[];
  // onSelect?: (item: any) => void;
  // onDeselect?: (item: any) => void;
}

export interface TablePagingSettings {
  pageSizes?: number[];

}

/**
 * Options for configuring the table's paging behavior.
 */
export interface TablePagingOptions {
  /**
   * If true, the table will show pagination controls at the bottom.
   * This will allow users to navigate between pages of data.
   * Default is true.
   */
  showPagingControls?: boolean;

  /**
   * Initial page index to load when the table is initialized.
   * This is only used if pagable is true.
   * The index starts from 1.
   * Default is 1.
   */
  pageIndex?: number;

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

/** 
 * Type of the table cell.
 * This can be a primitive type like 'number', 'currency', 'date', 'time',
 * or an object with specific formatting options.
 */
export type TableCellType = 'number' | 'currency' | 'date' | 'time' | {

    /** Enum formatting options */
    enum?: {
      /** The name of the enum to use for translation */
      name: string,

      returnEnumAsFallback: boolean
    },

    /** Boolean formatting options */
    boolean?: {
      false?: string,
      true?: string
    },

    currency?: {
    },
  };