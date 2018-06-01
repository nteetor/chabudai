---
# You don't need to edit this file, it's empty on purpose.
# Edit theme's home layout instead if you wanna make some changes
# See: https://jekyllrb.com/docs/themes/#overriding-theme-defaults
layout: home
---

# Chabudai

A table plugin for Bootstrap 4. Edit a cell by clicking on it. Edit a row as
JSON by clicking in the `#` column.

<p class="mb-5"></p>

## Default config

```html
<table id="table1" class="table table-bordered"></table>
<script>$("#table1").table(iris)</script>
```

<table id="table1" class="table table-bordered"></table>
<script>$(() => $("#table1").table(iris));</script>

## Expanded page nav

```html
<table id="table2" class="table"></table>
<script>$("#table2").table(iris, { nav: { items: 15 }})</script>
```

<table id="table2" class="table"></table>
<script>$(() => $("#table2").table(iris, { nav: { items: 15 }}));</script>

## More items per page

```html
<table id="table3" class="table table-striped"></table>
<script>$("#table3").table(iris, { paginate: 20 })<script>
```

<table id="table3" class="table table-striped"></table>
<script>$("#table3").table(iris, { paginate: 20 })</script>
