const PROXIMITY_RADIUS = 2.6;
const NEAR_MAX_SCALE = 2.2;
const HOVER_BASE_SCALE = 1.6;
const HOVER_SPAN_SCALE = 1.4;
const BURST_SCALE = 6;
const BURST_INTERVAL = 1750;
const BURST_DURATION = 150;
const SEED_INTERVAL = 130;
const SETTLE_EPSILON = 0.06;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function initAvatar(figure) {
  const image = figure.querySelector(".crt-avatar__image");
  const noise = figure.querySelector("#crt-avatar-noise");
  const displace = figure.querySelector("#crt-avatar-displace");
  const chR = figure.querySelector("#crt-avatar-ch-r");
  const chG = figure.querySelector("#crt-avatar-ch-g");
  const chB = figure.querySelector("#crt-avatar-ch-b");

  if (!image || !noise || !displace || !chR || !chG || !chB) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  let frame = null;
  let current = 0;
  let pointerTarget = 0;
  let burst = 0;
  let hovering = false;
  let burstTimer = 0;
  let seed = 7;
  let lastSeedAt = 0;
  let lastChroma = -1;
  let box = figure.getBoundingClientRect();

  function setAttr(node, name, value) {
    node.setAttribute(name, value.toFixed(2));
  }

  function setChroma(amount) {
    if (Math.abs(amount - lastChroma) < 0.04) return;
    lastChroma = amount;

    setAttr(chR, "dx", amount);
    setAttr(chG, "dx", amount * 0.2);
    setAttr(chB, "dx", -amount);
  }

  function apply(scale) {
    setAttr(displace, "scale", scale);
    setChroma(scale > 0.05 ? clamp(scale * 0.6, 0.2, 3.2) : 0);
  }

  function nextSeed() {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    noise.setAttribute("seed", String((seed % 89) + 1));
  }

  function toggleIdle(isIdle) {
    figure.classList.toggle("is-idle", isIdle);
  }

  function run(timestamp) {
    const target = pointerTarget + burst;
    current += (target - current) * 0.16;

    if (Math.abs(target - current) < SETTLE_EPSILON) {
      current = target;
      apply(current);
      frame = null;
      toggleIdle(current <= 0.05 && !hovering);
      figure.classList.toggle("is-near", current > 0.35);
      return;
    }

    apply(current);
    toggleIdle(false);
    figure.classList.toggle("is-near", current > 0.35);

    if (hovering && timestamp - lastSeedAt > SEED_INTERVAL) {
      lastSeedAt = timestamp;
      nextSeed();
    }

    frame = window.requestAnimationFrame(run);
  }

  function kick() {
    if (!frame) frame = window.requestAnimationFrame(run);
  }

  function setTarget(value) {
    pointerTarget = clamp(value, 0, 24);
    kick();
  }

  function startBursts() {
    stopBursts();
    burstTimer = window.setInterval(() => {
      if (!hovering) return;

      figure.classList.add("is-burst");
      burst = BURST_SCALE;
      nextSeed();
      kick();

      window.setTimeout(() => {
        burst = 0;
        figure.classList.remove("is-burst");
        kick();
      }, BURST_DURATION);
    }, BURST_INTERVAL);
  }

  function stopBursts() {
    if (!burstTimer) return;
    window.clearInterval(burstTimer);
    burstTimer = 0;
    burst = 0;
    figure.classList.remove("is-burst");
  }

  function closeness(event) {
    const radius = Math.max(box.width, box.height) / 2;
    if (!radius) return 0;

    const dx = event.clientX - (box.left + box.width / 2);
    const dy = event.clientY - (box.top + box.height / 2);
    const ratio = Math.hypot(dx, dy) / (radius * PROXIMITY_RADIUS);

    return clamp(1 - ratio, 0, 1);
  }

  function onPointerMove(event) {
    const near = closeness(event);

    if (hovering) {
      setTarget(HOVER_BASE_SCALE + near * HOVER_SPAN_SCALE);
    } else {
      setTarget(near > 0.02 ? near * NEAR_MAX_SCALE : 0);
    }
  }

  function remeasure() {
    box = figure.getBoundingClientRect();
  }

  let measureFrame = 0;

  function remeasureSoon() {
    if (measureFrame) return;
    measureFrame = window.requestAnimationFrame(() => {
      measureFrame = 0;
      remeasure();
    });
  }

  if (!finePointer.matches || reduce.matches) {
    figure.classList.add("is-idle");
    return;
  }

  remeasure();
  image.addEventListener("load", remeasure, { once: true });
  window.addEventListener("resize", remeasureSoon, { passive: true });
  window.addEventListener("scroll", remeasureSoon, { passive: true });

  figure.addEventListener("pointerenter", () => {
    hovering = true;
    figure.classList.add("is-hover");
    setTarget(HOVER_BASE_SCALE + HOVER_SPAN_SCALE * 0.5);
    startBursts();
  });

  figure.addEventListener("pointerleave", (event) => {
    hovering = false;
    figure.classList.remove("is-hover");
    stopBursts();
    onPointerMove(event);
  });

  document.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerleave", () => setTarget(0), { passive: true });

  reduce.addEventListener("change", (event) => {
    if (event.matches) {
      hovering = false;
      stopBursts();
      setTarget(0);
      current = 0;
      apply(0);
      figure.classList.remove("is-hover", "is-near");
      figure.classList.add("is-idle");
    }
  });

  apply(0);
  toggleIdle(true);
}

function init() {
  document.querySelectorAll("[data-crt-avatar]").forEach(initAvatar);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init, { once: true });
} else {
  init();
}
