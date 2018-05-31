# chabudai

A small table plugin for Bootstrap 4. Includes pagination, cell and row editing.

# Usage

```js
$("#myTable").table(json, config);
```

# Config

```
{
  headers: ..,      # defaults to `json` keys, the column headers
  paginate: 10,     # the number of rows to display on each page
  nav: {
    items: 5,       # the number of navigation items to show at a time, excludes < and >
    prev: "&lang;", # symbol to use for the previous navigation item
    next: "&rang;"  # symbol to use for the next navigation item
  }
}
```
