export class DataRequest {
    constructor(
        public pageIndex = 0,
        public pageSize = 10,
        public computeTotal = true,
        public filters: DataRequestFilter[] = [],
        public sort?: DataRequestSort,
    ) { }

    public addFilter(field: string, value: string, operator: DataRequestFilterOperator = DataRequestFilterOperator.EQ) {
        this.filters.push(new DataRequestFilter(field, value, operator));
        return this;
    }

    public sortDescending(field: string) {
        this.sort = new DataRequestSort(field, false);
        return this;
    }

    public sortAscending(field: string) {
        this.sort = new DataRequestSort(field, true);
        return this;
    }

    public static all() {
        return new DataRequest(0, 1000000, false);
    }
}

export class DataRequestSort {
    constructor(
        public field: string,
        public asc = true) {
    }
}

export class DataRequestFilter {
    constructor(
        public field: string,
        public value?: string,
        public operator: DataRequestFilterOperator = DataRequestFilterOperator.EQ) {
    }
}

export enum DataRequestFilterOperator {
    EQ = 0,
    NEQ = 1,    
    LT = 2,
    LTE = 3,
    GT = 4,
	GTE = 5,
    LI = 6,
    SW = 7,
}
