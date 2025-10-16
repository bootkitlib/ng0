/**
 * LogicalOperator is a list of predefined logical operators that can be used in data requests to filter data.
 */
export type LogicalOperator =
  | 'contains'
  | 'endsWith'
  | 'startsWith'
  | 'like'
  | 'eq'
  | 'ne'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte';

/**
 * 
 */
export type DataSourceItemTracker = (item: any) => string | number;