import React, { useEffect, useState } from "react";
import {
    getPaginationValueStringed,
    preProcessColumns,
    processDataRows,
    processHeader,
    processRow
} from "./helpers/processors";

const ReactTable = ({
    rows = [],
    columns: rawColumns = [],
    noDatatableMessage = "No Data Found",
    sortProps = {},
    paginationProps = {},
    searchProps = {},
    showPagination = true,
    showSizePerPage = true,
    showSearchBar = true,
    classNames = {}
}) => {
    const columns = preProcessColumns(rawColumns);

    const [allDataRows, setAllDataRows] = useState([]);
    const [dataRows, setDataRows] = useState([]);
    const [tableMessage, setTableMessage] = useState(noDatatableMessage);

    const [sortBy, setSortBy] = useState(sortProps?.sortBy);
    const [sortOrder, setSortOrder] = useState(sortProps?.sortOrder ?? "asc");

    const [pageList, setPageList] = useState([]);
    const [currentPage, setCurrentPage] = useState(paginationProps?.currentPage ?? 1);
    const [prevCurrentPage, setPrevCurrentPage] = useState(1);
    const [sizePerPage, setSizePerPage] = useState(paginationProps?.sizePerPage ?? 10);
    const [sizePerPageList] = useState(paginationProps?.sizePerPageList ?? [10, 50, 100]);

    const [searchText, setSearchText] = useState("");

    const onSort = (column) => {
        if (!column.sort) return;

        const { dataField } = column;
        const newOrder = sortOrder === "asc" ? "desc" : "asc";

        const sortedRows = processDataRows(allDataRows, columns, { sortBy: dataField, sortOrder: newOrder }, { sizePerPage, currentPage }, { searchText });

        setSortBy(dataField);
        setSortOrder(newOrder);
        setDataRows(sortedRows);
    };

    const onPageNumberChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setPrevCurrentPage(pageNumber);
    };

    const onSizePerPageChange = (size) => {
        const numericSize = Number(size);
        setSizePerPage(numericSize);
        setCurrentPage(numericSize > allDataRows.length ? 1 : prevCurrentPage);
    };

    useEffect(() => {
        setAllDataRows(structuredClone(rows));
        setDataRows(processDataRows(structuredClone(rows), columns, { sortBy, sortOrder }, { ...paginationProps, sizePerPage, currentPage }, { searchText, ...searchProps }));
    }, [rows, currentPage, sizePerPage, searchText]);

    useEffect(() => {
        setTableMessage(noDatatableMessage);
    }, [noDatatableMessage]);

    useEffect(() => {
        const pageList = Array.from({ length: Math.ceil(allDataRows.length / sizePerPage) }, (_, i) => i + 1);
        setPageList(pageList);
    }, [allDataRows, sizePerPage]);

    return (
        <div className={`react-table-wrapper m-2 ${classNames.wrapper ?? ""}`}>
            {showSearchBar && <div className="d-flex justify-content-end">
                <input onChange={(e) => setSearchText(e.target.value)} placeholder="Search" type="text" className={`form-control w-auto ${classNames?.textInput ?? ""}`} />
            </div>
            }

            {columns.length > 0 && (
                <table className={`table mb-0 ${classNames.table ?? ""}`}>
                    <thead className={classNames.thead}>
                        <tr>
                            {columns.map((col, colIndx) => {
                                col = processHeader(col);
                                return (
                                    <th
                                        onClick={() => onSort(col)}
                                        scope="col"
                                        key={`table-thead-tr-th-${colIndx}`}
                                        className={classNames.th}
                                        style={{ cursor: col.sort ? "pointer" : "default" }}
                                    >
                                        {col.header()}
                                        {col.sort && (
                                            <>
                                                <span className={(sortOrder === "asc" && sortBy === col.dataField) ? "opacity-100 ms-1" : "opacity-50 ms-1"}>{"↑"}</span>
                                                <span className={(sortOrder === "desc" && sortBy === col.dataField) ? "opacity-100" : "opacity-50"}>{"↓"}</span>
                                            </>
                                        )}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody className={classNames.tbody}>
                        {dataRows.length === 0 ? (
                            <tr className="text-center">
                                <td colSpan={columns.length}>{tableMessage}</td>
                            </tr>
                        ) : (
                            dataRows.map((row, rowIndx) => (
                                <tr key={`table-tbody-tr-${rowIndx}`} className={classNames.tr}>
                                    {columns.map((col, colIndx) => {
                                        const processedJSX = processRow(row, col);
                                        return (
                                            <td key={`table-tbody-tr-td-${colIndx}`} className={classNames.td}>
                                                {processedJSX()}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}

            <div className={`d-flex justify-content-between align-items-center p-0 ${classNames.paginationWrapper ?? ""}`}>
                {showSizePerPage &&
                    <div className="d-flex align-items-center p-0 mt-3">
                        <select
                            id="rowsPerPage"
                            className={`form-select w-auto ${classNames.rowsPerPageSelect ?? ""}`}
                            value={sizePerPage}
                            onChange={(e) => onSizePerPageChange(e.target.value)}
                        >
                            {sizePerPageList.map((pageSize) => (
                                <option key={`pageSize-${pageSize}`} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                        <div className="d-flex align-items-center">
                            <p className="ms-2 mb-0 text-muted">{getPaginationValueStringed(allDataRows, sizePerPage, currentPage)}</p>
                        </div>
                    </div>
                }

                {showPagination &&
                    <nav className="ms-auto">
                        <ul className={`pagination justify-content-end mt-3 ${classNames.pagination ?? ""}`}>
                            <li
                                onClick={() => onPageNumberChange(currentPage - 1)}
                                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                            >
                                <a className="page-link" href="#" tabIndex="-1">
                                    Previous
                                </a>
                            </li>
                            {pageList.map((page, pageIndx) => (
                                <li
                                    onClick={() => onPageNumberChange(page)}
                                    key={`page-${page}-${pageIndx}`}
                                    className={`page-item ${page === currentPage ? "active" : ""}`}
                                >
                                    <a className="page-link" href="#">
                                        {page}
                                    </a>
                                </li>
                            ))}
                            <li
                                onClick={() => onPageNumberChange(currentPage + 1)}
                                className={`page-item ${currentPage === pageList.length ? "disabled" : ""}`}
                            >
                                <a className="page-link" href="#">
                                    Next
                                </a>
                            </li>
                        </ul>
                    </nav>
                }
            </div>
        </div>
    );
};

export { ReactTable };
