---
layout: home
---

# Chabudai

A table plugin for Bootstrap 4. ([github](https://github.com/nteetor/chabudai))

* Edit a cell by clicking on it.
* Edit a row as JSON by clicking in the `#` column.
* Select a column by clicking a column header.
* Pagination by default.

## Default config

```html
<table id="table1" class="table table-bordered"></table>
<script>$(() => $("#table1").table({ "data": iris }));</script>
```

<table id="table1" class="table table-bordered"></table>
<script>$(() => $("#table1").table({ "data": iris }));</script>

## Expanded page nav

If the number of navigation items is at least the number of pages then the prev
and next items are removed.

```html
<table id="table2" class="table"></table>
<script>$(() => $("#table2").table({ "data": iris, "nav": { "items": 100 }}));</script>
```

<table id="table2" class="table"></table>
<script>$(() => $("#table2").table({ "data": iris, "nav": { "items": 15 }}));</script>

## More rows per page

Increase the number of rows per page from 10 to 20.

```html
<table id="table3" class="table table-striped"></table>
<script>$(() => $("#table3").table({ "data": iris, "paginate": 20 }))</script>
```

<table id="table3" class="table table-striped"></table>
<script>$(() => $("#table3").table({ "data": iris, "paginate": 20 }))</script>

## Responsive tables & dropdown cells

The columns with dropdown cells are found at the end of the table. A responsive
table has a horizontal scroll if it would not otherwise fit the page.

```html
<table id="table4" class="table table-bordered"></table>
<script>$(() => $("#table4").table({ "data": starwars, "responsive": true }))</script>
```

<table id="table4" class="table table-bordered"></table>
<script>$(() => $("#table4").table({ "data": starwars, "responsive": true }))</script>

## Getting values from selected columns

Values from selected columns may be pulled from a table with
`.table("selected")`. *Try selecting columns from the above table.*

```html
<table id="table5" class="table"></table>
<script>
    $(() => $("#table4").on("chabudai:select", (e) => {
      $("#table5").table({ "data": $("#table4").table("selected") });
    }));
</script>
```

<table id="table5" class="table"></table>
<script>
    $(() => $("#table4").on("chabudai:select", (e) => {
      $("#table5").table({ "data": $("#table4").table("selected") });
    }));
</script>
