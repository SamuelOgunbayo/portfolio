/* Samuel Ogunbayo portfolio: plain JavaScript, no dependencies */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* footer year */
  $("#year").textContent = new Date().getFullYear();

  /* mobile menu */
  var btn = $("#menu-btn"), menu = $("#mobile-menu");
  function setMenu(open) {
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  btn.addEventListener("click", function () { setMenu(menu.hidden); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !menu.hidden) { setMenu(false); btn.focus(); } });

  /* highlight the current section in the navigation */
  var links = $$("#nav-links a, #mobile-menu a[href^='#']:not(.btn)");
  function setActive(id) {
    links.forEach(function (a) {
      if (a.getAttribute("href") === "#" + id) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-40% 0px -55% 0px" });
    $$("main section[id]").forEach(function (s) { io.observe(s); });
  }
  setActive("home");

  /* projects */
  var projects = window.PROJECTS || [];
  var LABEL = { personal: "Personal Project", team: "Team Project | Don Dada Technologies" };
  var GROUPS = [
    { type: "personal", title: "Personal Projects", note: "Websites I developed independently.", icon: "i-user", limit: 6 },
    { type: "team", title: "Team Projects | Don Dada Technologies", note: "Websites I contributed to through my work at Don Dada Technologies. Individual contributions are not itemised.", icon: "i-users", limit: 6 }
  ];
  var FILTERS = [{ id: "all", label: "All projects" }, { id: "personal", label: "Personal" }, { id: "team", label: "Don Dada Technologies" }];
  var state = { filter: "all", expanded: {} };
  var SVG = "http://www.w3.org/2000/svg";

  var countEl = $("#project-count"); if (countEl) countEl.textContent = projects.length;

  function el(tag, props, kids) {
    var n = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      if (k === "text") n.textContent = props[k]; else if (k === "class") n.className = props[k]; else n.setAttribute(k, props[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function icon(id) {
    var s = document.createElementNS(SVG, "svg"); s.setAttribute("class", "i"); s.setAttribute("aria-hidden", "true");
    var u = document.createElementNS(SVG, "use"); u.setAttribute("href", "#" + id); s.appendChild(u); return s;
  }
  function host(url) { try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return url; } }
  function shot(p) { return p.thumbnail || "https://s0.wp.com/mshots/v1/" + encodeURIComponent(p.url) + "?w=800&h=500"; }

  function card(p) {
    var h = host(p.url);
    var img = el("img", { src: shot(p), alt: "", width: "800", height: "500", loading: "lazy", decoding: "async" });
    img.addEventListener("error", function () { img.remove(); }); /* branded fallback stays visible */
    var shotLink = el("a", { class: "shot", href: p.url, target: "_blank", rel: "noopener noreferrer", tabindex: "-1", "aria-hidden": "true" }, [
      el("div", { class: "shot-fallback" }, [el("b", { text: p.title }), el("span", { text: h })]), img
    ]);
    var visit = el("a", { class: "visit", href: p.url, target: "_blank", rel: "noopener noreferrer" }, [
      document.createTextNode("View Live Website "), icon("i-out"), el("span", { class: "sr-only", text: " (" + h + ", opens in a new tab)" })
    ]);
    var kind = el("p", { class: "kind" }, [icon(p.type === "personal" ? "i-user" : "i-users"), document.createTextNode(LABEL[p.type])]);
    return el("article", { class: "card card--" + p.type }, [shotLink, el("div", { class: "card-body" }, [
      kind, el("h4", { text: p.title }), p.category ? el("p", { class: "cat", text: p.category }) : null,
      el("p", { class: "desc", text: p.description || "" }), visit
    ])]);
  }

  /* filter buttons are built once so keyboard focus is never lost */
  var filtersEl = $("#filters");
  FILTERS.forEach(function (x) {
    var n = x.id === "all" ? projects.length : projects.filter(function (p) { return p.type === x.id; }).length;
    var b = el("button", { type: "button", "data-f": x.id }, [document.createTextNode(x.label + " "), el("small", { text: "(" + n + ")" })]);
    b.addEventListener("click", function () { state.filter = x.id; syncFilters(); renderGroups(); });
    filtersEl.appendChild(b);
  });
  function syncFilters() {
    $$("button", filtersEl).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-f") === state.filter)); });
  }

  function renderGroups(focusType) {
    var root = $("#project-groups"); root.textContent = "";
    GROUPS.filter(function (g) { return state.filter === "all" || state.filter === g.type; }).forEach(function (g) {
      var list = projects.filter(function (p) { return p.type === g.type; });
      var open = !!state.expanded[g.type];
      var shown = open ? list : list.slice(0, g.limit);
      var sec = el("div", { class: "group", "data-type": g.type, role: "group", "aria-labelledby": "grp-" + g.type }, [
        el("div", { class: "group-head" }, [el("div", {}, [
          el("h3", { id: "grp-" + g.type }, [document.createTextNode(g.title + " "), el("span", { text: "(" + list.length + ")" })]),
          el("p", { text: g.note })
        ])]),
        el("div", { class: "cards" }, shown.map(card))
      ]);
      if (list.length > g.limit) {
        var more = el("button", { type: "button", "aria-expanded": String(open), text: open ? "Show fewer" : "View all " + list.length + " projects" });
        more.addEventListener("click", function () {
          state.expanded[g.type] = !open;
          renderGroups(g.type);
          if (open) { var h = $("#grp-" + g.type); if (h && h.scrollIntoView) h.scrollIntoView({ block: "center" }); }
        });
        sec.appendChild(el("div", { class: "more" }, [more]));
      }
      root.appendChild(sec);
    });
    if (focusType) { var fb = $('.group[data-type="' + focusType + '"] .more button'); if (fb) fb.focus(); }
  }
  syncFilters();
  renderGroups();
})();
