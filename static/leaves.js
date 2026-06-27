/**
 * PlantCare AI — Falling Leaves Background Animation (Optimized)
 * Renders animated falling leaf particles on a fixed canvas behind all page content.
 */
(function () {
  "use strict";

  // ─── Canvas Setup ────────────────────────────────────────────────────────────
  const canvas = document.createElement("canvas");
  canvas.id = "leaf-canvas";
  canvas.style.cssText = [
    "position:fixed",
    "top:0",
    "left:0",
    "width:100%",
    "height:100%",
    "pointer-events:none",
    "z-index:0",
    "opacity:0.55",
  ].join(";");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let W, H;

  const LEAF_COLORS = [
    "#1DB954", // vivid green
    "#10B981", // primary green
    "#34D399", // mint
    "#6EE7B7", // pale mint
    "#A7F3D0", // very light green
    "#4ADE80", // lime-green
    "#22C55E", // medium green
    "#86EFAC", // soft green
    "#BBF7D0", // lightest green
    "#16A34A", // forest green
  ];

  // ─── Leaf Class ──────────────────────────────────────────────────────────────
  class Leaf {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * W;
      // Start above screen on reset; randomly spread on initial load
      this.y = initial ? Math.random() * H : -60;
      this.size = 18 + Math.random() * 28; // 18–46 px
      this.speedY = 0.6 + Math.random() * 1.4; // fall speed
      this.speedX = (Math.random() - 0.5) * 1.2; // slight horizontal drift
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04; // rotation speed
      this.wobble = Math.random() * Math.PI * 2; // phase offset for wobble
      this.wobbleSpeed = 0.015 + Math.random() * 0.02;
      this.wobbleAmp = 20 + Math.random() * 30; // horizontal swing amplitude
      this.color = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
      this.alpha = 0.4 + Math.random() * 0.5;
      this.type = Math.floor(Math.random() * 3); // 0,1,2 — three leaf shapes
    }

    update() {
      this.wobble += this.wobbleSpeed;
      this.x += Math.sin(this.wobble) * this.wobbleAmp * 0.02 + this.speedX;
      this.y += this.speedY;
      this.rot += this.rotSpeed;
      if (this.y > H + 80) this.reset();
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 0.5;

      const s = this.size;
      ctx.beginPath();

      if (this.type === 0) {
        // ── Simple oval leaf ────────────────────────────────────────────────
        ctx.ellipse(0, 0, s * 0.38, s * 0.55, Math.PI / 8, 0, Math.PI * 2);
      } else if (this.type === 1) {
        // ── Pointed leaf (bezier) ────────────────────────────────────────────
        ctx.moveTo(0, -s * 0.5);
        ctx.bezierCurveTo(s * 0.4, -s * 0.3, s * 0.45, s * 0.2, 0, s * 0.5);
        ctx.bezierCurveTo(-s * 0.45, s * 0.2, -s * 0.4, -s * 0.3, 0, -s * 0.5);
      } else {
        // ── Maple-ish lobe leaf ──────────────────────────────────────────────
        ctx.moveTo(0, -s * 0.5);
        ctx.bezierCurveTo(s * 0.15, -s * 0.35, s * 0.5, -s * 0.1, s * 0.35, s * 0.1);
        ctx.bezierCurveTo(s * 0.5, s * 0.3, s * 0.2, s * 0.55, 0, s * 0.5);
        ctx.bezierCurveTo(-s * 0.2, s * 0.55, -s * 0.5, s * 0.3, -s * 0.35, s * 0.1);
        ctx.bezierCurveTo(-s * 0.5, -s * 0.1, -s * 0.15, -s * 0.35, 0, -s * 0.5);
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Midrib vein
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.45);
      ctx.lineTo(0, s * 0.45);
      ctx.strokeStyle = "rgba(0,0,0,0.18)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      ctx.restore();
    }
  }

  // ─── Init & Resize ───────────────────────────────────────────────────────────
  const LEAF_COUNT = 24; // Optimized leaf count for mobile smooth scroll
  let leaves = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function init() {
    resize();
    leaves = Array.from({ length: LEAF_COUNT }, () => new Leaf());
  }

  window.addEventListener("resize", resize);

  // ─── Animation Loop ──────────────────────────────────────────────────────────
  function loop() {
    ctx.clearRect(0, 0, W, H);
    
    leaves.forEach((leaf) => {
      leaf.update();
      leaf.draw();
    });
    
    requestAnimationFrame(loop);
  }

  // Kick off after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => { init(); loop(); });
  } else {
    init();
    loop();
  }
})();
