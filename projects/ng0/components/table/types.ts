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