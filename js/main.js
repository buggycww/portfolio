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

  /* ---------------------------------------------------------------------
     Ticker
     The marquee travels exactly one sequence's width per cycle, so that
     sequence has to be at least as wide as the viewport or a gap opens up
     at the end of the strip. Repeat the authored items until one sequence
     covers the viewport, then print the sequence twice.
     --------------------------------------------------------------------- */

  const ticker = document.querySelector(".ticker");
  const tickerTrack = document.querySelector(".ticker-track");

  if (ticker && tickerTrack) {
    const seed = Array.from(tickerTrack.children).map((item) => item.cloneNode(true));
    const PIXELS_PER_SECOND = 46;

    const buildTicker = () => {
      const viewport = ticker.clientWidth;
      if (!viewport || !seed.length) return;

      // Measure one sequence from a clean copy.
      tickerTrack.replaceChildren(...seed.map((item) => item.cloneNode(true)));
      const sequenceWidth = tickerTrack.scrollWidth;
      if (!sequenceWidth) return;

      const repeats = Math.max(2, Math.ceil(viewport / sequenceWidth) + 1);
      const sequence = [];
      for (let i = 0; i < repeats; i += 1) {
        seed.forEach((item) => sequence.push(item.cloneNode(true)));
      }

      const fragment = document.createDocumentFragment();
      sequence.concat(sequence.map((item) => item.cloneNode(true))).forEach((item) => {
        fragment.appendChild(item);
      });
      tickerTrack.replaceChildren(fragment);

      // One sequence per cycle keeps the speed steady at any width.
      tickerTrack.style.animationDuration =
        Math.round((sequenceWidth * repeats) / PIXELS_PER_SECOND) + "s";
    };

    let resizeTimer = 0;
    const queueBuild = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(buildTicker, 150);
    };

    buildTicker();
    window.addEventListener("resize", queueBuild, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(buildTicker).catch(() => {});
    }
  }

  /* ---------------------------------------------------------------------
     YouTube fallback
     A YouTube embed opened from disk has no valid origin and fails with
     error 153, so replace it with a poster that links out instead. Served
     over http(s) the real player stays.
     --------------------------------------------------------------------- */

  if (window.location.protocol === "file:") {
    document.querySelectorAll("[data-youtube]").forEach((frame) => {
      const id = frame.getAttribute("data-youtube");
      if (!id) return;
      const label = frame.getAttribute("data-youtube-title") || "Video";

      frame.innerHTML =
        '<a class="case-video-link" href="https://www.youtube.com/watch?v=' + id +
        '" target="_blank" rel="noopener">' +
        '<img src="https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg" alt="">' +
        '<span class="case-video-play" aria-hidden="true">▶</span>' +
        '<span class="case-video-note">' + label + " — watch on YouTube ↗</span>" +
        "</a>";
    });
  }

  /* ---------------------------------------------------------------------
     Screenshot lightbox
     Click a project screenshot to see it full size, with arrows to move
     between the shots on the page. Esc, the close button, or a click on
     the backdrop closes it.
     --------------------------------------------------------------------- */

  const lightboxShots = Array.from(
    document.querySelectorAll(".case-shot:not(.case-shot--filler)")
  );

  if (lightboxShots.length && typeof HTMLDialogElement === "function") {
    const dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.setAttribute("aria-label", "Enlarged screenshot");
    dialog.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close image">✕</button>' +
      '<button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous image">‹</button>' +
      '<img alt="">' +
      '<button type="button" class="lightbox-nav lightbox-next" aria-label="Next image">›</button>' +
      '<p class="lightbox-caption"></p>';
    document.body.appendChild(dialog);

    const image = dialog.querySelector("img");
    const caption = dialog.querySelector(".lightbox-caption");
    let current = 0;

    const show = (index) => {
      current = (index + lightboxShots.length) % lightboxShots.length;
      const shot = lightboxShots[current];
      image.src = shot.currentSrc || shot.src;
      image.alt = shot.alt || "";
      caption.textContent =
        (shot.alt || "Screenshot") + " — " + (current + 1) + " / " + lightboxShots.length;
    };

    const open = (index) => {
      show(index);
      dialog.showModal();
    };

    lightboxShots.forEach((shot, index) => {
      shot.setAttribute("tabindex", "0");
      shot.setAttribute("role", "button");
      shot.addEventListener("click", () => open(index));
      shot.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          open(index);
        }
      });
    });

    dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
    dialog.querySelector(".lightbox-prev").addEventListener("click", () => show(current - 1));
    dialog.querySelector(".lightbox-next").addEventListener("click", () => show(current + 1));

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") show(current + 1);
      if (event.key === "ArrowLeft") show(current - 1);
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
