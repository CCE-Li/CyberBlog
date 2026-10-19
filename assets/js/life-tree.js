const TRUNK_INSET = 1.75;

function initTree(root) {
  const tree = root.querySelector("[data-life-tree]");
  if (!tree) return;

  const svg = tree.querySelector("[data-life-svg]");
  const layer = tree.querySelector("[data-life-edges]");
  const trunk = tree.querySelector(".life-trunk");
  if (!svg || !layer || !trunk) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const branches = Array.from(tree.querySelectorAll("[data-life-branch]"));
  let edges = [];
  let frame = 0;

  function trunkX() {
    const rect = trunk.getBoundingClientRect();
    return rect.left - tree.getBoundingClientRect().left - TRUNK_INSET;
  }

  function clear() {
    while (layer.firstChild) layer.removeChild(layer.firstChild);
    edges = [];
  }

  function draw() {
    const treeRect = tree.getBoundingClientRect();
    if (!treeRect.width) return;

    clear();

    const baseX = trunkX();
    if (baseX <= 0) return;

    svg.setAttribute("viewBox", `0 0 ${treeRect.width} ${treeRect.height}`);
    svg.setAttribute("width", String(treeRect.width));
    svg.setAttribute("height", String(treeRect.height));

    branches.forEach((branch) => {
      const dot = branch.querySelector(".life-branch__dot");
      if (!dot) return;

      const depth = Number(branch.style.getPropertyValue("--depth")) || 0;
      const dotRect = dot.getBoundingClientRect();

      const endX = dotRect.left + dotRect.width / 2 - treeRect.left;
      const endY = dotRect.top + dotRect.height / 2 - treeRect.top;

      const rise = Math.max(5, 30 - depth * 8);
      const startY = Math.max(2, endY - rise);
      const span = Math.max(12, endX - baseX);
      const bow = Math.min(7, span * 0.22);

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

      path.setAttribute(
        "d",
        `M ${baseX} ${startY} C ${baseX + span * 0.5} ${startY - bow}, ${endX - span * 0.32} ${endY + bow}, ${endX} ${endY}`
      );
      path.setAttribute("data-thread", branch.dataset.thread || "");
      path.style.setProperty("--thread", getComputedStyle(branch).getPropertyValue("--thread").trim());

      layer.appendChild(path);
      edges.push(path);
    });
  }

  function scheduleDraw() {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      draw();
    });
  }

  function focus(thread) {
    if (!thread) {
      tree.classList.remove("is-focusing");
      branches.forEach((branch) => branch.classList.remove("is-matched"));
      edges.forEach((path) => path.classList.remove("is-matched"));
      return;
    }

    tree.classList.add("is-focusing");
    branches.forEach((branch) => {
      branch.classList.toggle("is-matched", branch.dataset.thread === thread);
    });
    edges.forEach((path) => {
      path.classList.toggle("is-matched", path.dataset.thread === thread);
    });
  }

  branches.forEach((branch) => {
    branch.addEventListener("pointerenter", () => focus(branch.dataset.thread));
    branch.addEventListener("pointerleave", () => focus(null));
  });

  if (reduce.matches) {
    draw();
  } else {
    scheduleDraw();
  }

  window.addEventListener("resize", scheduleDraw, { passive: true });
  window.addEventListener("load", scheduleDraw, { once: true });
  window.addEventListener("scroll", scheduleDraw, { passive: true });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(scheduleDraw);
    observer.observe(trunk);
  }

  if ("fonts" in document) {
    document.fonts.ready.then(scheduleDraw);
  }
}

function init() {
  document.querySelectorAll("[data-life]").forEach(initTree);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
