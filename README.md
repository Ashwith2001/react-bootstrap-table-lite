# ReactTable

A lightweight, customizable, and extensible React table component with support for sorting, pagination, and search functionality out of the box.

## ✨ Features

* Custom column and row rendering
* Sorting by column
* Pagination with configurable page size
* Client-side search functionality
* Easily pluggable and styled via props
* No external dependencies

---

## 📦 Installation

```bash
npm install react-boostrap-table-lite
# or
yarn add react-boostrap-table-lite
```

---

## 🚀 Usage

```jsx
import React from "react";
import { ReactTable } from "react-boostrap-table-lite";

const columns = [
  {
    dataField: "id",
    header: () => "ID",
    sort: true,
    cell: (cell, row) => () => <span>{cell}</span>,
  },
  {
    dataField: "name",
    header: () => "Name",
    sort: true,
    cell: (cell) => () => <strong>{cell}</strong>,
  },
];

const data = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const App = () => (
  <ReactTable
    rows={data}
    columns={columns}
    showPagination={true}
    showSizePerPage={true}
    showSearchBar={true}
    classNames={{
      table: "table-bordered",
    }}
  />
);
```
---
### ***Note: react-boostrap-table-lite depends on bootstrap styling, hence make sure bootstrap is installed by default, although you can override internal classes.*** 
---

---

## ⚙️ Props

| Prop                 | Type      | Description                                                               |                                  |
| -------------------- | --------- | ------------------------------------------------------------------------- | -------------------------------- |
| `rows`               | `Array`   | List of data objects to render in the table                               |                                  |
| `columns`            | `Array`   | Column definitions with render and formatting rules                       |                                  |
| `noDatatableMessage` | `string`  | Message to show when no data is available                                 |                                  |
| `sortProps`          | `object`  |  Initial sort settings `{ sortBy: "", sortOrder: ""}` |
| `paginationProps`    | `object`  | Inital page settings. `{ currentPage: number, sizePerPage: number, sizePerPageList: number[] }` |                                  |
| `searchProps`        | `object`  | Custom search configuration. `{ onSearch: (rows, searchQuery) => {}}` for custom Search behaviour. Must return rows.     |                                  |
| `showPagination`     | `boolean` | Toggle pagination visibility                                              |                                  |
| `showSizePerPage`    | `boolean` | Toggle page size selector visibility                                      |                                  |
| `showSearchBar`      | `boolean` | Toggle search input visibility                                            |                                  |
| `classNames`         | `object`  | Custom CSS class overrides for table elements                             |                                  |

---

## 📐 Column Definition

Each column should be an object with the following properties:

| Property       | Type       | Description                                                                        |
| -------------- | ---------- | ---------------------------------------------------------------------------------- |
| `header`       | `string \| function`   | The column title shown in the table UI.   It can be function that returns jsx for custom implementation.                                        |
| `dataField`    | `string`   | The key in the data source to bind to. For Nested Objects use `Author.Name` or `Address.City` or `Location.0.Address.Street`                                            |
| `sort`         | `boolean`  | Enables or disables sorting for the column.                                        |
| `cell`         | `function` | A custom function to render cell content. Gets `cellData`, `row`, and `dataField`. E.g: `(cellData, row, dataField) => { return <></>}` |
| `ignoreSearch` | `boolean`  | If `true`, this column is not included in global searches.         |


---

## 🎨 Styling

Override or extend styling by passing custom class names via the `classNames` prop:

```js
classNames={{
  wrapper: "my-wrapper-class",
  table: "table table-striped",
  thead: "thead-dark",
  th: "text-uppercase",
  tbody: "table-body",
  tr: "table-row",
  td: "table-cell",
  pagination: "custom-pagination",
  rowsPerPageSelect: "form-select-sm",
  textInput: "form-control-sm",
  paginationWrapper: "d-flex justify-content-between"
}}
```

---

## 📝 License

MIT

---
