/* Shared navigation, reveal, and archive filtering. */
(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".nav");
  const menuToggle = document.querySelector(".menu-toggle");

  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (nav && menuToggle) {
    const setMenu = (open) => {
      nav.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    menuToggle.addEventListener("click", () => {
      setMenu(menuToggle.getAttribute("aria-expanded") !== "true");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenu(false);
    });

    document.addEventListener("click", (event) => {
      if (menuToggle.getAttribute("aria-expanded") !== "true") return;
      if (nav.contains(event.target) || menuToggle.contains(event.target)) return;
      setMenu(false);
    });
  }

  const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
  if (revealItems.length) {
    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
      );
      revealItems.forEach((item) => observer.observe(item));
    }

    // Safety net: content must never stay invisible if the observer is slow,
    // interrupted by a jump link, or unavailable in an embedded view.
    window.setTimeout(() => {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }, 2400);
  }

  const filterBar = document.querySelector(".filter-bar");
  const archiveGrid = document.querySelector(".archive-grid");
  const filterCount = document.querySelector(".filter-count");

  if (filterBar && archiveGrid) {
    const buttons = Array.from(filterBar.querySelectorAll(".filter-btn"));
    const cards = Array.from(archiveGrid.querySelectorAll("[data-category]"));
    const empty = archiveGrid.querySelector(".archive-empty");

    function applyFilter(filter) {
      let shown = 0;
      cards.forEach((card) => {
        const categories = (card.getAttribute("data-category") || "").split(/\s+/);
        const visible = filter === "all" || categories.includes(filter);
        card.hidden = !visible;
        if (visible) shown += 1;
      });

      if (filterCount) {
        filterCount.textContent = shown + (shown === 1 ? " project" : " projects");
      }

      if (empty) {
        empty.classList.toggle("is-visible", shown === 0);
      }
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.getAttribute("data-filter") || "all";
        buttons.forEach((item) => {
          const active = item === button;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", active ? "true" : "false");
        });
        applyFilter(filter);
      });
    });

    applyFilter("all");
  }
})();
