
export interface DataSourceChange {
  type: 'push';
}

export interface DataSourcePushChange extends DataSourceChange {
  type: 'push'

  /**
   * The items to insert.
   */
  items: any[];
}

// export interface DataSourceReplaceChange extends DataSourceChange {
//   type: 'replace'
//   replacements: {
//     index: number;
//     value: any;
//   }[]
// }

// export interface DataSourceRemoveChange extends DataSourceChange {
//   type: 'remove';

//   /**
//    * The indices of the items to remove. Indices are sorted in descending order.
//    */
//   indices: number[];
// }

export interface DataSourceChangeEvent {
  changes: Array<DataSourcePushChange>
}
