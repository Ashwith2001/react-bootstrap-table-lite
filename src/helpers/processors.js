const getValueFromPath = (path, data) => {
    path = path.split(".");
    return path.reduce((prev, curr) => {
        return prev[curr];
    }, data);
}

const processHeader = (column) => {
    let { header } = column;
    let headerFunc = () => header;
    if (typeof header === "function") {
        headerFunc = () => header();
    }

    column.header = headerFunc;
    return column;
}

const processRow = (row, column) => {
    let { cell, dataField } = column;
    let result = getValueFromPath(dataField, row);

    let cellFunc = () => result;
    if (typeof cell === 'function') {
        cellFunc = () => cell(result, row, dataField);
    }
    return cellFunc;
}

const preProcessColumns = (columns) => {
    columns = columns.filter(col => !col.hidden);
    return columns;
}

const getPaginationValues = (rows, sizePerPage, currentPage) => {
    let startIndx, endIndx;
    const totalRows = rows?.length;

    startIndx = totalRows < (currentPage - 1) * sizePerPage ? 0 : (currentPage - 1) * sizePerPage;
    endIndx = totalRows < (currentPage * sizePerPage) ? totalRows : (currentPage * sizePerPage);
    return { startIndx, endIndx };
}

const getPaginationValueStringed = (rows, sizePerPage, currentPage) => {
    const { startIndx, endIndx } = getPaginationValues(rows, sizePerPage, currentPage);
    return `Showing ${startIndx + 1} to ${endIndx} of ${rows.length} entries`;
}

const processDataRows = (rows, columns, sortProps = {}, paginationProps = {}, searchProps = {}) => {

    // Search Handler
    const { searchText = "" } = searchProps;
    if (searchText) {
        if (searchProps?.onSearch) {
            rows = searchProps?.onSearch(rows, searchText);
        }
        rows = rows?.filter(r => columns.some(col => {
            if (col.ignoreSearch) return false;
            const value = getValueFromPath(col?.dataField, r);
            if (!value) return false;
            return `${value?.toLowerCase()}`?.toLowerCase()?.includes(searchText);
        }));
    }

    // Sort Handler.
    const { sortBy = "", sortOrder = "asc" } = sortProps;
    if (sortBy) {
        rows = rows.sort((a, b) => {
            const aValue = getValueFromPath(sortBy, a);
            const bValue = getValueFromPath(sortBy, b);

            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortOrder === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            // fallback for numbers or other types
            if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
            if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
            return 0;
        });
    }

    // Pagination Handler
    const { sizePerPage, currentPage } = paginationProps;
    const { startIndx, endIndx } = getPaginationValues(rows, sizePerPage, currentPage);
    rows = rows.slice(startIndx, endIndx);

    return rows;
};


export {
    processDataRows,
    preProcessColumns,
    processHeader,
    processRow,
    getValueFromPath,
    getPaginationValues,
    getPaginationValueStringed
}