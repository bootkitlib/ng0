/**
 * DataRequest class represents a request for data with pagination, filtering, sorting, and field selection.
 * It is used to encapsulate the parameters needed to fetch data from a data source.
 * It can be used with various data sources such as HTTP services, in-memory arrays, etc.
 * 
 */
export class DataRequest {
    public page?: DataRequestPage;
    public filters?: DataRequestFilter[];
    public sort?: DataRequestSort;
    public select?: string[];
    public computeTotal?: boolean;

    constructor(options?: {
        page?: DataRequestPage,
        filters?: DataRequestFilter[],
        sort?: DataRequestSort,
        select?: string[],
        computeTotal?: boolean,
    }) {
        this.page = options?.page;
        this.filters = options?.filters;
        this.sort = options?.sort;
        this.select = options?.select;
        this.computeTotal = options?.computeTotal;
    }
}

/**
 * Represents a data request page.
 */
export interface DataRequestPage {
    /**
     * Index of the page.
     * If zeroBased is true, the index starts from 0.
     */
    index: number;

    /**
     * Size of the page, i.e., number of items in each page.
     */
    size: number;

    /**
     * Indicates if the index is zero-based.
     */
    zeroBased: boolean;
}

/**
 * Represents a sorting option in a DataRequest.
 * @property field The field to sort by.
 * @property asc Whether to sort in ascending order.
 */
export interface DataRequestSort {
    field: string;
    asc?: boolean
}

/**
 * Represents a filter in a DataRequest.
 * @property field The field to filter by.
 * @property value The value to filter by.
 * @property operator The operator to use for filtering.
 */
export interface DataRequestFilter {
    field: string;
    value?: string;
    operator: any;
}

// export enum DataRequestFilterOperator {
//     EQ = 0,
//     NEQ = 1,
//     LT = 2,
//     LTE = 3,
//     GT = 4,
//     GTE = 5,
//     LI = 6,
//     SW = 7,
// }
