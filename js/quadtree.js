/* An interactive, small quadtree for the hero panel.
   It stores axis-aligned boxes, mirrors the broad-phase used in 2D-Shooter,
   and rebuilds only when the canvas is resized. */
(function () {
  "use strict";

  const canvas = document.getElementById("quadtree");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const CAPACITY = 5;
  const MAX_DEPTH = 5;
  const ENTRY_COUNT = 86;
  const QUERY_W = 148;
  const QUERY_H = 108;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let entries = [];
  let root = null;
  let query = { x: 0, y: 0, w: QUERY_W, h: QUERY_H };
  let pointer = null;
  let visible = true;
  let rafId = null;
  let reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function intersects(a, b) {
    return (
      a.x < b.x + b.w &&
      a.x + a.w > b.x &&
      a.y < b.y + b.h &&
      a.y + a.h > b.y
    );
  }

  function contains(outer, inner) {
    return (
      inner.x >= outer.x &&
      inner.x + inner.w <= outer.x + outer.w &&
      inner.y >= outer.y &&
      inner.y + inner.h <= outer.y + outer.h
    );
  }

  class Node {
    constructor(x, y, w, h, depth) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.depth = depth;
      this.items = [];
      this.children = null;
    }

    get isLeaf() {
      return this.children === null;
    }

    get quadrant() {
      return { x: this.x + this.w / 2, y: this.y + this.h / 2 };
    }

    subdivide() {
      if (this.depth >= MAX_DEPTH) return;
      const halfW = this.w / 2;
      const halfH = this.h / 2;
      if (halfW < 18 || halfH < 18) return;

      this.children = [
        new Node(this.x, this.y, halfW, halfH, this.depth + 1),
        new Node(this.x + halfW, this.y, halfW, halfH, this.depth + 1),
        new Node(this.x, this.y + halfH, halfW, halfH, this.depth + 1),
        new Node(this.x + halfW, this.y + halfH, halfW, halfH, this.depth + 1),
      ];

      const old = this.items;
      this.items = [];
      old.forEach((item) => insertInto(this, item));
    }
  }

  function childFor(node, item) {
    const midX = node.x + node.w / 2;
    const midY = node.y + node.h / 2;

    // A box that crosses a split stays in the parent.
    if (item.x < midX && item.x + item.w > midX) return null;
    if (item.y < midY && item.y + item.h > midY) return null;

    const left = item.x + item.w <= midX;
    const above = item.y + item.h <= midY;

    if (left && above) return node.children[0];
    if (!left && above) return node.children[1];
    if (left && !above) return node.children[2];
    return node.children[3];
  }

  function insertInto(node, item) {
    if (!node.isLeaf) {
      const child = childFor(node, item);
      if (child) {
        insertInto(child, item);
        return;
      }
      node.items.push(item);
      return;
    }

    node.items.push(item);
    if (node.items.length > CAPACITY) node.subdivide();
  }

  function build() {
    const pad = 12;
    root = new Node(pad, pad, width - pad * 2, height - pad * 2, 0);
    entries = [];

    for (let i = 0; i < ENTRY_COUNT; i++) {
      const w = rand(9, 34);
      const h = rand(9, 34);
      const item = {
        x: rand(pad, width - pad - w),
        y: rand(pad, height - pad - h),
        w,
        h,
        hot: false,
      };
      entries.push(item);
      insertInto(root, item);
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.round(rect.width);
    height = Math.round(rect.height);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    draw(performance.now());
    schedule();
  }

  function markQuery() {
    entries.forEach((item) => {
      item.hot = intersects(item, query);
    });
  }

  function drawNode(node) {
    if (!node) return;
    const depth = node.depth;
    ctx.strokeStyle =
      depth === 0
        ? "rgba(215,255,95,0.18)"
        : depth < 3
        ? "rgba(241,238,230,0.10)"
        : "rgba(241,238,230,0.055)";
    ctx.lineWidth = 1;
    ctx.strokeRect(node.x + 0.5, node.y + 0.5, node.w - 1, node.h - 1);

    if (node.isLeaf) {
      ctx.fillStyle = `rgba(215,255,95,${0.01 + depth * 0.004})`;
      ctx.fillRect(node.x + 1, node.y + 1, node.w - 2, node.h - 2);
    }

    if (!node.isLeaf) node.children.forEach(drawNode);
  }

  function drawQuery() {
    const x = query.x;
    const y = query.y;
    const w = query.w;
    const h = query.h;

    ctx.save();
    ctx.fillStyle = "rgba(215,255,95,0.045)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "rgba(215,255,95,0.9)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

    const tick = 9;
    ctx.strokeStyle = "rgba(215,255,95,1)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y + tick);
    ctx.lineTo(x, y);
    ctx.lineTo(x + tick, y);
    ctx.moveTo(x + w - tick, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + tick);
    ctx.moveTo(x + w, y + h - tick);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w - tick, y + h);
    ctx.moveTo(x + tick, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + h - tick);
    ctx.stroke();

    ctx.font = '8px "Cascadia Mono", Consolas, monospace';
    ctx.fillStyle = "rgba(215,255,95,0.9)";
    ctx.fillText("QUERY", x + 8, y + 14);
    ctx.restore();
  }

  function draw(time) {
    if (!width || !height) return;

    if (!pointer && !reduced) {
      const t = time * 0.00016;
      const cx = width * 0.5 + Math.sin(t) * width * 0.24;
      const cy = height * 0.5 + Math.cos(t * 0.82) * height * 0.22;
      query.x = Math.max(8, Math.min(width - QUERY_W - 8, cx - QUERY_W / 2));
      query.y = Math.max(8, Math.min(height - QUERY_H - 8, cy - QUERY_H / 2));
    }

    markQuery();

    ctx.clearRect(0, 0, width, height);

    // faint base grid
    ctx.strokeStyle = "rgba(241,238,230,0.035)";
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
      ctx.stroke();
    }

    drawNode(root);

    // entries
    entries.forEach((item) => {
      if (item.hot) {
        ctx.fillStyle = "rgba(215,255,95,0.92)";
        ctx.strokeStyle = "rgba(215,255,95,0.4)";
      } else {
        ctx.fillStyle = "rgba(241,238,230,0.18)";
        ctx.strokeStyle = "rgba(241,238,230,0.12)";
      }
      ctx.fillRect(item.x, item.y, item.w, item.h);
      ctx.strokeRect(item.x + 0.5, item.y + 0.5, item.w - 1, item.h - 1);
    });

    drawQuery();

    // corner label
    ctx.font = '8px "Cascadia Mono", Consolas, monospace';
    ctx.fillStyle = "rgba(241,238,230,0.35)";
    ctx.fillText(String(entries.length).padStart(2, "0") + " BOXES", 14, height - 12);
  }

  function frame(time) {
    rafId = null;
    draw(time);
    if (visible) schedule();
  }

  function schedule() {
    if (rafId !== null || reduced || !visible) return;
    rafId = requestAnimationFrame(frame);
  }

  function setPointer(event) {
    const rect = canvas.getBoundingClientRect();
    pointer = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    query.x = Math.max(6, Math.min(width - QUERY_W - 6, pointer.x - QUERY_W / 2));
    query.y = Math.max(6, Math.min(height - QUERY_H - 6, pointer.y - QUERY_H / 2));
    if (reduced) draw(performance.now());
  }

  canvas.addEventListener("pointermove", setPointer);
  canvas.addEventListener("pointerdown", setPointer);
  canvas.addEventListener("pointerleave", () => {
    pointer = null;
    if (reduced) draw(performance.now());
  });

  const resizeObserver =
    "ResizeObserver" in window
      ? new ResizeObserver(() => resize())
      : null;
  if (resizeObserver) resizeObserver.observe(canvas);

  window.addEventListener("resize", resize);
  resize();

  if ("IntersectionObserver" in window) {
    const visibility = new IntersectionObserver(
      (observed) => {
        visible = observed[0].isIntersecting;
        if (visible) {
          draw(performance.now());
          schedule();
        }
      },
      { threshold: 0.05 }
    );
    visibility.observe(canvas);
  } else {
    schedule();
  }

  if (reduced) {
    query.x = width / 2 - QUERY_W / 2;
    query.y = height / 2 - QUERY_H / 2;
    draw(0);
  }
})();
