import * as React from "react";

export interface Column {
    header: string | (() => React.ReactNode);
    dataField: string;
    sort?: boolean;
    cell?: (cellData: any, row: any, dataField: string) => React.ReactNode;
    ignoreSearch?: boolean;
}


export interface SortProps {
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}

export interface PaginationProps {
    currentPage?: number;
    sizePerPage?: number;
    sizePerPageList?: number[];
}

export interface SearchProps {
    onSearch?: (rows: Array<any>, searchText: string) => Array<any>;
}

export interface ClassNames {
    wrapper?: string;
    textInput?: string;
    table?: string;
    thead?: string;
    th?: string;
    tbody?: string;
    tr?: string;
    td?: string;
    paginationWrapper?: string;
    rowsPerPageSelect?: string;
    pagination?: string;
}

export interface ReactTableProps {
    rows: any[];
    columns: Column[];
    noDatatableMessage?: string;
    sortProps?: SortProps;
    paginationProps?: PaginationProps;
    searchProps?: SearchProps;
    showPagination?: boolean;
    showSizePerPage?: boolean;
    showSearchBar?: boolean;
    classNames?: ClassNames;
}

export declare const ReactTable: React.FC<ReactTableProps>;

export default ReactTable;
