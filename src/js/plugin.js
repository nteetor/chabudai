(function($) {
  $.fn.table = function(data, config) {
    const matches = (el, selector) => {
      return (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector);
    };

    if (!this.length) {
      throw ".table() called on invalid element";
    }

    if (!this.is("table")) {
      throw ".table() must be called on table element";
    }

    var options = $.extend(true, {
      headers: data.length ? Object.keys(data[0]) : null,
      paginate: 10,
      nav: {
        items: 5,
        prev: "&lang;",
        next: "&rang;"
      }
    }, config);

    var plugin = this;
    var nav = {
      el: null,
      from: 0,
      to: options.nav.items
    };
    var editing = null;

    var keycode = {
      ENTER: 13
    };

    /*
     * Create table cells
     */
    plugin.addClass("chabudai");

    plugin.append(
      $("<thead>").append(
        $("<tr>").append(
          $("<th>", { scope: "col" }).html("#"),
          $.map(options.headers, x => `<th scope="col">${ x }</th>`)
        )
      )
    );

    plugin.append(
      $("<tbody>").append(
        $.map(
          data,
          (r, i) => $("<tr>").append(
            $("<th>", {
              scope: "row"
            }).html(i),
            Object.values(r).map(c => {
              var cell;

              if (Array.isArray(c)) {
                var options = c.map(x => `<option value="${ x }">${ x }</option>`).join("");
                cell = `<select class="custom-select">${ options }</select>`;
              } else {
                cell = `<input class="form-control" type="text" value="${ c }" readonly></input>`;
              }

              return `<td>${ cell }</td>`;
            })
          )
        )
      )
    );

    /*
     * Helper functions
     */
    var stopEditing = function() {
      if (editing === null) {
        return;
      }

      if (matches(editing, "td")) {
        var input = editing.firstChild;

        if (input.tagName === "INPUT") {
          input.setAttribute("readonly", "");
        }

        editing.classList.remove("editing", "table-primary");
        editing = null;

        return;
      }

      if (matches(editing, "tr")) {
        let input = editing.querySelector("td textarea");
        let values = Object.values(JSON.parse(input.value));

        editing.removeChild(input.parentNode);
        Array.from(editing.getElementsByTagName("td")).forEach((td, i) => {
          td.style = null;
          td.firstChild.value = values[i];
        });

        editing = null;

        return;
      }
    };

    const startEditing = function(el) {
      if (matches(el, "td")) {
        editing = el;
        var input = editing.firstChild;

        if (input.tagName === "INPUT") {
          input.focus();
          input.selectionStart = input.selectionEnd = input.value.length;
          input.removeAttribute("readonly");
        }

        editing.classList.add("editing", "table-primary");
        return;
      }

      if (matches(el, `th[scope="row"]`)) {
        editing = el.parentNode;

        let cells = Array.from(editing.getElementsByTagName("td"));
        let values = cells.map(el => el.firstChild.value);
        let headers = plugin.find(`thead th[scope="col"]`).get().map(el => el.innerHTML).slice(1);

        let map = {};
        headers.forEach((h, i) => map[h] = values[i]);

        cells.forEach(el => el.style.display = "none");

        $(editing.firstChild).after(
          $("<td>", {
            "class": "editing table-primary",
            "colspan": cells.length
          }).append(
            $("<textarea>", {
              "class": "form-control",
              "rows": cells.length + 2
            }).val(JSON.stringify(map, null, 2))
          )
        );

        let textarea = editing.querySelector("td textarea");
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = textarea.value.length;
      }
    };

    const pageTo = function(li) {
      if (nav.el === null) {
        return;
      }

      let active = nav.el[0].querySelector(".active");

      if (active) {
        active.classList.remove("active");
      }

      li.classList.add("active");

      let page = li.dataset.page;
      let rows = plugin[0].querySelector("tbody").getElementsByTagName("tr");

      for (let i = 0; i < rows.length; i++) {
        rows[i].style.display = "none";
      }

      for (let i = (page - 1) * options.paginate; i < rows.length && i < (page * options.paginate); i++) {
        rows[i].style.display = null;
      }
    };

    const navNext = function() {
      let items = nav.el.find("li:not(:first-child):not(:last-child)");

      if (nav.to >= items.length) {
        return;
      }

      if (nav.from == 0) {
        nav.el[0].querySelector("li:first-child").classList.remove("disabled");
      }

      nav.from = nav.from + options.nav.items;
      nav.to = nav.to + options.nav.items;

      items.each((i, el) => {
        i >= nav.from && i < nav.to ? el.style = null : el.style.display = "none";
      });

      if (nav.to >= items.length) {
        nav.el[0].querySelector("li:last-child").classList.add("disabled");
      }
    };

    const navPrev = function() {
      let items = nav.el.find("li:not(:first-child):not(:last-child)");

      if (nav.from == 0) {
        return;
      }

      if (nav.to >= items.length) {
        nav.el[0].querySelector("li:last-child").classList.remove("disabled");
      }

      nav.from = nav.from - options.nav.items;
      nav.to = nav.to - options.nav.items;

      items.each((i, el) => {
        i >= nav.from && i < nav.to ? el.style = null : el.style.display = "none";
      });

      if (nav.from == 0) {
        nav.el[0].querySelector("li:first-child").classList.add("disabled");
      }
    };

    const clickInside = function(e) {
      if (plugin[0].contains(e.target)) {
        plugin[0].removeEventListener("click", clickInside);
        document.addEventListener("click", clickOutside);
      }
    };

    const clickOutside = function(e) {
      if (!plugin[0].contains(e.target)) {
        stopEditing();
        document.removeEventListener("click", clickOutside);
        plugin[0].addEventListener("click", clickInside);
      }
    };

    /*
     * Interact/editing events
     */
    plugin[0].addEventListener("click", clickInside);

    plugin.on("click", `td:not(.editing), th[scope="row"]`, function(e) {
      stopEditing();
      startEditing(this);
    });

    plugin.on("keypress", "td.editing", function(e) {
      if (e.which == keycode.ENTER) {
        stopEditing();
      }
    });

    plugin.on("click", `th[scope="col"]`, function(e) {
      stopEditing();

      let index = Array.from(this.parentNode.children).indexOf(this);
      let column = plugin[0].querySelectorAll(`td:nth-child(${ index + 1 })`);

      for (let i = 0; i < column.length; i++) {
        column[i].classList.toggle("selected");
        column[i].classList.toggle("table-primary");
      }
    });

    plugin.appendTo(plugin);

    /*
     * Pagination
     */
    if (data.length > 10 && options.paginate !== false) {
      let total = Math.ceil(data.length / 10);
      let items = Array.from(
        Array(total),
        (_, i) => `<li class="page-item" data-page="${ i + 1 }"><a class="page-link">${ i + 1 }</a></li>`
      );

      nav.el = $("<nav>").append(
        $("<ul>", {
          "class": "pagination justify-content-center"
        }).append(
          items.join("")
        ));

      if (items.length > options.nav.items) {
        nav.el.find(`li:nth-child(n + ${ 1 + options.nav.items }):nth-child(-n + ${ items.length })`).css("display", "none");

        nav.el.find(".pagination").prepend(
          `<li class="page-item disabled"><a class="page-link">${ options.nav.prev }</a></li>`
        );

        nav.el.find(".pagination").append(
          `<li class="page-item"><a class="page-link">${ options.nav.next }</a></li>`
        );

        nav.el.on("click", "li:first-child", function(e) {
          navPrev();
        });

        nav.el.on("click", "li:last-child", function(e) {
          navNext();
        });
      }

      nav.el.on("click", `li[data-page]:not(.active)`, function(e) {
        e.preventDefault();
        pageTo(this);
      });

      plugin.after(nav.el);

      pageTo(nav.el[0].querySelector(`li[data-page="1"]`));
    }

    return plugin;
  };
}(jQuery));
