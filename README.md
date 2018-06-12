# chabudai

A small table plugin for Bootstrap 4. Includes pagination, cell and row editing.

# Usage

Download [chabudai.min.js](dist/js/chabudai.min.js) and [chabudai.min.css](dist/css/chabudai.min.css).
Include these files in a page header *after* Bootstrap and jQuery.

# Creating a table

Use `.table({ "data": .. }` to create a table. See https://nteetor.github.com/chabudai/ for examples.

# Config options

| Name    | Description | Default |
| :---    | :---------- | :------ |
| data    | A JSON array specifying the table's data | `[]` |
| headers  | The column headers. | The names found in `data` |
| paginate | The number of rows to display on each page or `false` to prevent pagination | 10 |
| responsive | Is the table responsive? If `true` the table will scroll horizontally when too large for a page | `false` |
| editable | An array of column names indicating which columns may be edited, `true` is interpreted as all columns and `false` as none | `true` |
| filled | Fill final page to keep pagination nav vertically steady | `true` |
| nav     | An object specifying config options for the pagination nav, see below | |
| nav.align | One of `"left"`, `"center"`, or `"right"` specifying the alignment of the nav | `"center"` |
| nav.items | The number of navigation items to display, if necssary a next and prev item are added | 5 |
| nav.prev | The symbol used on the previous nav item | `"&lang;"` |
| nav.next | The symbol used on the next nav item | `"&rang;"` |
