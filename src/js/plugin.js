(function($) {
  const all = function(array, type) {
    if (!array.length) {
      return false;
    }

    return array.reduce((acc, cur) => acc && typeof cur === type, true);
  };

  $.fn.table = function(config) {
    config = config || {};

    if (config === "selected") {
      let $table = this;
      let selected = $table[0].querySelectorAll("colgroup .selected");

      if (!selected.length) {
        return [];
      }

      let indeces = {};
      Array.prototype.forEach.call(selected, el => {
        indeces[el.dataset.variable] = Array.prototype.indexOf.call($table[0].querySelectorAll("colgroup col"), el);
      });

      return Array.prototype.map.call(
        $table[0].querySelectorAll("tbody tr:not([aria-hidden])"),
        tr => {
          let o = {};
          Object.keys(indeces).forEach(k => {
            o[k] = tr.querySelector(`td:nth-child(${ indeces[k] + 1 })`).firstChild.value;
          });
          return o;
        }
      );
    }


    if (!(config.data && config.data.length)) {
      return;
    }

    let options = $.extend(true, {
      "headers": config.data && config.data.length ? Object.keys(config.data[0]) : [],
      "paginate": 10,
      "responsive": false,
      "filled": true,
      "nav": {
        "items": 5,
        "prev": "&lang;",
        "next": "&rang;",
        "align": "center"
      }
    }, config, this[0].dataset);

    options.navItems = options.navItems || options.nav.items;
    options.navPrev = options.navPrev || options.nav.prev;
    options.navNext = options.navNext || options.nav.next;
    options.navAlign = options.navAlign || options.nav.align;

    options.data = options.data || [];

    let $plugin;
    let $nav;
    let editing;

    let keycode = {
      ENTER: 13
    };

    if (this[0].tagName.match(/table/i)) {
      $plugin = this;
    } else {
      $plugin = $("<table>", { "class": options["class"] });
      this.append($plugin);
    }

    $plugin[0].classList.add("table-chabudai");

    // clear out old contents
    $plugin.empty();

    if ($plugin[0].nextElementSibling &&
        $plugin[0].nextElementSibling.tagName.match(/nav/i) &&
        $plugin[0].nextElementSibling.firstChild &&
        $plugin[0].nextElementSibling.firstChild.classList.contains("pagination")) {
      $plugin[0].parentNode.removeChild($plugin[0].nextElementSibling);
    }

    /*
     * Table contents
     */
    $plugin.append(
      $("<colgroup>").append(
        ["#", ...options.headers].map(h => {
          return $("<col>", {
            "span": 1,
            "data-variable": h
          });
        })
      )
    );

    $plugin.append(
      $("<thead>").append(
        $("<tr>").append(
          ["#", ...options.headers].map(x => $(`<th scope="col">${ x }</th>`))
        )
      )
    );

    $plugin.append(
      $("<tbody>").append(
        options.data.map((row, index) => {
          return $("<tr>").append(
            $("<th>", { scope: "row" })
              .html(index + 1),
            Object.values(row).map(v => {
              if (Array.isArray(v)) {
                if (v.length === 0) {
                  return $(`<td><input type="text" value=""></td>`);
                }

                let options = v.map(x => `<option value="${ x }">${ x }</option>`).join("");
                return $(`<td><select class="custom-select">${ options }</select></td>`);
              } else {
                return $(`<td><input type="text" value="${ v }"></td>`);
              }
            })
          );
        })
      )
    );

    if (options.filled && options.data.length % options.paginate != 0) {
      let fillers = Array(options.paginate - (options.data.length % options.paginate));
      for (let i = 0; i < fillers.length; i++) {
        fillers[i] = $("<tr aria-hidden><th>&nbsp;</th></tr>");
      }
      $plugin.find("tbody").append(fillers);
    }

    /*
     * Editing
     */
    var stopEditing = function() {
      if (!editing) {
        return;
      }

      if (editing.tagName.match(/td/i)) {
        editing.classList.remove("editing");
      } else if (editing.tagName.match(/tr/i)) {
        let input = editing.querySelector("td textarea");
        let values = Object.values(JSON.parse(input.value));

        editing.removeChild(input.parentNode);
        Array.prototype.forEach.call(editing.getElementsByTagName("td"), (td, i) => {
          td.style = null;
          td.firstChild.value = values[i];
        });

        editing.classList.remove("editing");
      }

      editing = null;
    };

    const startEditing = function(el) {
      if (editing) {
        return;
      }

      if (el.tagName.match(/td/i)) {
        editing = el;
      } else if (el.tagName.match(/th/i)) {
        editing = el.parentNode;

        let cells = editing.getElementsByTagName("td");
        let values = Array.prototype.map.call(cells, el => el.firstChild.value);
        let headers = Array.prototype.map.call(
          $plugin[0].querySelectorAll(`thead th[scope="col"]`),
          el => el.innerHTML
        );

        let map = {};
        headers.slice(1).forEach((h, i) => map[h] = values[i]);

        Array.prototype.forEach.call(cells, el => el.style.display = "none");

        $(editing.firstChild).after(
          $("<td>", {
            "class": "editing",
            "colspan": cells.length
          }).append(
            $("<textarea>", {
              "rows": cells.length + 2
            }).val(JSON.stringify(map, null, 2))
          )
        );

        let textarea = editing.querySelector("td textarea");
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
      }

      editing.classList.add("editing");
    };

    const clickInside = function(e) {
      if ($plugin[0].contains(e.target)) {
        $plugin[0].removeEventListener("click", clickInside);
        document.addEventListener("click", clickOutside);
      }
    };

    const clickOutside = function(e) {
      if (!$plugin[0].contains(e.target)) {
        stopEditing();
        document.removeEventListener("click", clickOutside);
        $plugin[0].addEventListener("click", clickInside);
      }
    };

    $plugin[0].addEventListener("click", clickInside);

    $plugin.on("click", "td:not(.editing)", function(e) {
      stopEditing();
      startEditing(this);
    });

    $plugin.on("click", `th[scope="row"]`, function(e) {
      if (!this.parentNode.classList.contains("editing")) {
        stopEditing();
        startEditing(this);
      }
    });

    $plugin.on("keypress", "td.editing", function(e) {
      if (e.which == keycode.ENTER) {
        stopEditing();
      }
    });

    $plugin.on("click", `th[scope="col"]:not(:first-child)`, function(e) {
      stopEditing();

      $plugin[0].querySelector(`colgroup col[data-variable="${ this.innerHTML }"]`).classList.toggle("selected");

      $plugin.trigger($.Event("chabudai:select", { "target": this }));
    });

    /*
     * Pagination
     */
    const pageTo = function(li) {
      if ($nav === null) {
        return;
      }

      let active = $nav[0].querySelector(".active");

      if (active) {
        active.classList.remove("active");
      }

      li.classList.add("active");

      let page = li.dataset.page;
      let rows = $plugin[0].tBodies[0].rows; // querySelector("tbody").getElementsByTagName("tr");

      for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = "none";
      }

      for (let i = (page - 1) * options.paginate; i < rows.length && i < (page * options.paginate); i++) {
        rows[i].style.display = null;
      }
    };

    const navNext = function() {
      $nav[0].querySelector("li:first-child").classList.remove("disabled");

      let items = $nav[0].querySelectorAll("li:not(:first-child):not(:last-child)");

      let i = 0;
      let n = 0;

      while (items[i].classList.contains("d-none")) i++;

      while (i < (items.length - options.navItems) && n < options.navItems) {
        items[i].classList.add("d-none");
        n++;
        i++;
      }

      n = 0;
      while (i < items.length && n < options.navItems) {
        items[i].classList.remove("d-none");
        n++;
        i++;
      }

      if (!items[items.length - 1].classList.contains("d-none")) {
        $nav[0].querySelector("li:last-child").classList.add("disabled");
      }
    };

    const navPrev = function() {
      $nav[0].querySelector("li:last-child").classList.remove("disabled");

      let items = $nav[0].querySelectorAll("li:not(:first-child):not(:last-child)");

      let i = items.length - 1;
      let n = 0;

      while (items[i].classList.contains("d-none")) i--;

      while (i >= options.navItems && n < options.navItems) {
        items[i].classList.add("d-none");
        n++;
        i--;
      }

      n = 0;
      while (i >= 0 && n < options.navItems) {
        items[i].classList.remove("d-none");
        n++;
        i--;
      }

      if (!items[0].classList.contains("d-none")) {
        $nav[0].querySelector("li:first-child").classList.add("disabled");
      }
    };

    if (options.data.length > 10 && options.paginate !== false) {
      let total = Math.ceil(options.data.length / 10);
      let items = [];
      for (let i = 0; i < total; i++) {
        items[i] = $(`<li class="page-item" data-page="${ i + 1 }"><a class="page-link">${ i + 1 }</a></li>`);
      }

      $nav = $("<nav>");

      // if we need to add the next and prev additional nav items
      if (items.length > options.navItems) {
        for (let j = options.navItems; j < items.length; j++) {
          items[j][0].classList.add("d-none");
        }

        items.unshift($(`<li class="page-item disabled"><a class="page-link">${ options.navPrev }</a></li>`));
        items.push($(`<li class="page-item"><a class="page-link">${ options.navNext }</a></li>`));

        $nav.on("click", "li:first-child:not(.disabled)", function(e) {
          navPrev();
        });

        $nav.on("click", "li:last-child:not(.disabled)", function(e) {
          navNext();
        });
      }

      $nav.append($("<ul>", { "class": "pagination justify-content-center" }).append(items));

      $nav.on("click", `li[data-page]:not(.active)`, function(e) {
        e.preventDefault();
        pageTo(this);
      });

      $plugin.after($nav);

      pageTo($nav[0].querySelector(`li[data-page="1"]`));
    }

    /*
     * Make table responsive
     */
    if (options.responsive) {
      $plugin.wrap(`<div class="table-responsive"></div>`);
    }


    return $plugin;
  };
}(jQuery));
