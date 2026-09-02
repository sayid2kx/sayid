"use client";

import { useEffect, useRef } from "react";

type ThemeId = "garden" | "cupertino" | "paper" | "studio" | "flux";

const palette: Record<
  ThemeId,
  {
    accent: string;
    steel: string;
    grid: string;
    headStroke: string;
    shoulder: string;
  }
> = {
  garden: {
    accent: "#52b788",
    steel: "#95d5b2",
    grid: "rgba(82,183,136,0.08)",
    headStroke: "#52b788",
    shoulder: "rgba(31,59,47,0.45)",
  },
  cupertino: {
    accent: "#0071e3",
    steel: "#6e6e73",
    grid: "rgba(0,113,227,0.06)",
    headStroke: "#0071e3",
    shoulder: "rgba(29,29,31,0.35)",
  },
  paper: {
    accent: "#c75a3a",
    steel: "#8a7a65",
    grid: "rgba(199,90,58,0.07)",
    headStroke: "#c75a3a",
    shoulder: "rgba(26,26,26,0.40)",
  },
  studio: {
    accent: "#000000",
    steel: "#6e6e73",
    grid: "rgba(0,0,0,0.05)",
    headStroke: "#000000",
    shoulder: "rgba(0,0,0,0.35)",
  },
  flux: {
    accent: "#7c3aed",
    steel: "#06b6d4",
    grid: "rgba(124,58,237,0.07)",
    headStroke: "#7c3aed",
    shoulder: "rgba(124,58,237,0.35)",
  },
};

export function LearningSimulation({ theme }: { theme: string }) {
  const t = (["garden", "flux", "cupertino", "paper", "studio"].includes(theme) ? theme : "garden") as ThemeId;
  const cfg = palette[t];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cfgRef = useRef(cfg);

  useEffect(() => {
    cfgRef.current = cfg;
  }, [cfg]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;
    let clock = 0;
    let last = performance.now();
    let visible = true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Source = {
      x: number;
      y: number;
      kind: "book" | "code" | "tools" | "idea";
      color: string;
      target: { x: number; y: number };
      mid: { x: number; y: number };
      rot: number;
      particles: { t: number; speed: number; offset: number }[];
      label: string;
    };

    let head: { cx: number; cy: number; r: number } | null = null;
    let sources: Source[] = [];
    let impacts: { x: number; y: number; age: number; life: number; color: string }[] = [];
    let trails: { x: number; y: number; a: number }[] = [];

    function buildLayout() {
      if (!wrap || !canvas || !ctx) return;
      const rect = wrap.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      if (W < 10 || H < 10) return;

      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isNarrow = W < 420;
      const isTiny = W < 360;
      const cx = W * 0.5;
      const cy = isNarrow ? H * 0.48 : H * 0.46;
      const r = Math.min(W, H) * (isTiny ? 0.11 : isNarrow ? 0.12 : 0.125);
      if (r < 16) return;
      head = { cx, cy, r };

      const insetX = isTiny ? 0.20 : isNarrow ? 0.18 : 0.16;
      const insetTop = isNarrow ? 0.24 : 0.22;
      const insetBottom = isNarrow ? 0.76 : 0.74;
      const raw: { x: number; y: number; kind: Source["kind"]; label: string; color: string }[] = [
        { x: insetX, y: insetTop, kind: "book", label: "Study", color: cfgRef.current.accent },
        { x: 1 - insetX, y: insetTop - 0.02, kind: "code", label: "Code", color: cfgRef.current.steel },
        { x: insetX, y: insetBottom, kind: "tools", label: "Tools", color: cfgRef.current.steel },
        { x: 1 - insetX, y: insetBottom, kind: "idea", label: "Ideas", color: cfgRef.current.accent },
      ];

      sources = raw.map((s, i) => {
        const sx = s.x * W;
        const sy = s.y * H;
        const dx = cx - sx;
        const dy = cy - sy;
        const dist = Math.hypot(dx, dy) || 1;
        const ux = dx / dist;
        const uy = dy / dist;
        const target = { x: cx - ux * r * 0.98, y: cy - uy * r * 0.98 };
        const perp = { x: -uy, y: ux };
        const bow = (i % 2 === 0 ? 1 : -1) * dist * 0.22;
        const mid = {
          x: (sx + target.x) / 2 + perp.x * bow,
          y: (sy + target.y) / 2 + perp.y * bow,
        };
        const count = reduceMotion ? 1 : i % 2 === 0 ? 3 : 2;
        const baseSpeed = reduceMotion ? 0.09 : 0.18 + i * 0.02;
        return {
          x: sx,
          y: sy,
          kind: s.kind,
          color: s.color,
          target,
          mid,
          rot: 0,
          label: s.label,
          particles: Array.from({ length: count }, (_, k) => ({
            t: (k / count + i * 0.17) % 1,
            speed: baseSpeed + k * 0.02,
            offset: k * 0.33,
          })),
        };
      });
    }

    function quadPoint(p0: { x: number; y: number }, c: { x: number; y: number }, p1: { x: number; y: number }, tVal: number) {
      const it = 1 - tVal;
      return {
        x: it * it * p0.x + 2 * it * tVal * c.x + tVal * tVal * p1.x,
        y: it * it * p0.y + 2 * it * tVal * c.y + tVal * tVal * p1.y,
      };
    }

    function quadTangent(p0: { x: number; y: number }, c: { x: number; y: number }, p1: { x: number; y: number }, tVal: number) {
      return {
        x: 2 * (1 - tVal) * (c.x - p0.x) + 2 * tVal * (p1.x - c.x),
        y: 2 * (1 - tVal) * (c.y - p0.y) + 2 * tVal * (p1.y - c.y),
      };
    }

    function drawGrid() {
      if (!ctx) return;
      const step = 22;
      ctx.save();
      ctx.fillStyle = cfgRef.current.grid;
      for (let y = 14; y < H; y += step) {
        for (let x = 14; x < W; x += step) {
          ctx.beginPath();
          ctx.arc(x, y, 0.65, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    function drawShoulders() {
      if (!head || !ctx) return;
      const { cx, cy, r } = head;
      const shTop = cy + r * 0.72;
      const shL = cx - r * 1.42;
      const shR = cx + r * 1.42;
      const bottom = H * 0.99;

      ctx.save();
      ctx.strokeStyle = cfgRef.current.shoulder;
      ctx.lineWidth = 1.35;
      ctx.globalAlpha = 0.55;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(12, bottom);
      ctx.quadraticCurveTo(18, shTop + 8, shL, shTop);
      ctx.quadraticCurveTo(cx - r * 0.3, shTop - 2, cx - r * 0.92, cy + r * 0.55);
      ctx.moveTo(W - 12, bottom);
      ctx.quadraticCurveTo(W - 18, shTop + 8, shR, shTop);
      ctx.quadraticCurveTo(cx + r * 0.3, shTop - 2, cx + r * 0.92, cy + r * 0.55);
      ctx.stroke();

      ctx.globalAlpha = 0.18;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.42, cy + r * 0.58);
      ctx.quadraticCurveTo(cx, cy + r * 0.78, cx + r * 0.42, cy + r * 0.58);
      ctx.stroke();
      ctx.restore();
    }

    function drawHead(time: number) {
      if (!head || !ctx) return;
      const { cx, cy, r } = head;
      const p = cfgRef.current;

      const pulse = 0.42 + 0.18 * Math.sin(time * 1.1);
      const glow = ctx.createRadialGradient(cx, cy, r * 0.7, cx, cy, r * 2.1);
      glow.addColorStop(0, p.accent + "22");
      glow.addColorStop(1, "transparent");
      ctx.save();
      ctx.globalAlpha = pulse;
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.05, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const fill = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.35, r * 0.2, cx, cy, r);
      fill.addColorStop(0, "rgba(255,255,255,0.62)");
      fill.addColorStop(0.55, "rgba(255,255,255,0.06)");
      fill.addColorStop(1, "rgba(255,255,255,0)");
      ctx.save();
      ctx.globalAlpha = t === "flux" || t === "garden" ? 0.38 : 0.22;
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.98, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = p.headStroke;
      ctx.lineWidth = 1.7;
      ctx.globalAlpha = 0.92;
      const breath = 1 + 0.012 * Math.sin(time * 1.4);
      ctx.beginPath();
      ctx.arc(cx, cy, r * breath, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.16;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.94, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = 0.55 + 0.25 * Math.sin(time * 2.2);
      ctx.fillStyle = p.accent;
      ctx.beginPath();
      ctx.arc(cx, cy - r * 0.72, 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawSourceIcon(s: Source) {
      if (!ctx) return;
      const { x, y, kind, color } = s;
      const isNarrow = W < 420;
      const sz = Math.min(W, H) * (isNarrow ? 0.032 : 0.028);
      const plateR = Math.min(W, H) * (isNarrow ? 0.048 : 0.042);

      ctx.save();
      ctx.fillStyle = t === "studio" ? "#ffffff" : "rgba(255,255,255,0.88)";
      ctx.strokeStyle = color + "28";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const pr = 10;
      const left = x - plateR;
      const top = y - plateR;
      const w = plateR * 2;
      const h = plateR * 2;
      const ctxAny = ctx as unknown as { roundRect?: (x: number, y: number, w: number, h: number, r: number) => void };
      if (ctxAny.roundRect) {
        ctxAny.roundRect(left, top, w, h, pr);
      } else {
        ctx.moveTo(left + pr, top);
        ctx.arcTo(left + w, top, left + w, top + h, pr);
        ctx.arcTo(left + w, top + h, left, top + h, pr);
        ctx.arcTo(left, top + h, left, top, pr);
        ctx.arcTo(left, top, left + w, top, pr);
      }
      ctx.fill();
      ctx.stroke();
      ctx.shadowColor = "rgba(0,0,0,0.07)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 2;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.35;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 0.95;

      if (kind === "book") {
        ctx.beginPath();
        ctx.moveTo(x, y - sz * 0.6);
        ctx.bezierCurveTo(x - sz * 1.45, y - sz * 0.95, x - sz * 1.45, y + sz * 0.65, x - sz * 0.05, y + sz * 0.45);
        ctx.moveTo(x, y - sz * 0.6);
        ctx.bezierCurveTo(x + sz * 1.45, y - sz * 0.95, x + sz * 1.45, y + sz * 0.65, x + sz * 0.05, y + sz * 0.45);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y - sz * 0.6);
        ctx.lineTo(x, y + sz * 0.58);
        ctx.stroke();
        ctx.globalAlpha = 0.5;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(x - sz * 0.95, y - sz * 0.15);
        ctx.lineTo(x - sz * 0.22, y - sz * 0.05);
        ctx.moveTo(x + sz * 0.22, y - sz * 0.05);
        ctx.lineTo(x + sz * 0.95, y - sz * 0.15);
        ctx.stroke();
      } else if (kind === "code") {
        ctx.font = `${Math.round(sz * 1.45)}px var(--font-jetbrains), monospace`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("</>", x, y + 1);
      } else if (kind === "tools") {
        s.rot += 0.007;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(s.rot * 0.6);
        ctx.beginPath();
        ctx.arc(0, -sz * 0.35, sz * 0.32, -0.9, Math.PI * 2 - 0.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(sz * 0.08, -sz * 0.05);
        ctx.lineTo(sz * 0.06, sz * 0.78);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-sz * 0.12, -sz * 0.58);
        ctx.lineTo(sz * 0.12, -sz * 0.58);
        ctx.stroke();
        ctx.restore();
      } else if (kind === "idea") {
        ctx.beginPath();
        ctx.arc(x, y - sz * 0.18, sz * 0.72, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - sz * 0.34, y + sz * 0.55);
        ctx.lineTo(x + sz * 0.34, y + sz * 0.55);
        ctx.moveTo(x - sz * 0.26, y + sz * 0.74);
        ctx.lineTo(x + sz * 0.26, y + sz * 0.74);
        ctx.stroke();
        ctx.globalAlpha = 0.7;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - sz * 0.18, y - sz * 0.42);
        ctx.lineTo(x - sz * 0.18, y + sz * 0.06);
        ctx.moveTo(x + sz * 0.18, y - sz * 0.42);
        ctx.lineTo(x + sz * 0.18, y + sz * 0.06);
        ctx.stroke();
        ctx.globalAlpha = 0.35;
        ctx.beginPath();
        ctx.moveTo(x, y - sz * 1.05);
        ctx.lineTo(x, y - sz * 0.88);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawParticle(pos: { x: number; y: number }, dir: { x: number; y: number }, color: string, alpha: number) {
      if (!ctx) return;
      const len = Math.hypot(dir.x, dir.y) || 1;
      const nx = dir.x / len;
      const ny = dir.y / len;

      ctx.save();
      ctx.globalAlpha = alpha * 0.22;
      ctx.strokeStyle = color;
      ctx.lineWidth = 3.5;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(pos.x - nx * 9, pos.y - ny * 9);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.restore();

      const grad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 7);
      grad.addColorStop(0, color);
      grad.addColorStop(0.5, color + "AA");
      grad.addColorStop(1, "transparent");
      ctx.save();
      ctx.globalAlpha = alpha * 0.95;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 1.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawImpacts(dt: number) {
      if (!ctx) return;
      impacts = impacts.filter((im) => im.age < im.life);
      for (const im of impacts) {
        im.age += dt;
        const p = im.age / im.life;
        const ease = 1 - Math.pow(1 - p, 2);
        ctx.save();
        ctx.strokeStyle = im.color;
        ctx.globalAlpha = (1 - p) * 0.85;
        ctx.lineWidth = 1.2 + (1 - p) * 0.6;
        ctx.beginPath();
        ctx.arc(im.x, im.y, 2 + ease * 13, 0, Math.PI * 2);
        ctx.stroke();
        if (p < 0.45) {
          ctx.globalAlpha = (1 - p / 0.45) * 0.55;
          ctx.fillStyle = im.color;
          ctx.beginPath();
          ctx.arc(im.x, im.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    function frame(now: number) {
      if (!ctx) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const speedScale = reduceMotion ? 0.35 : 1;
      clock += dt * speedScale;

      if (!visible || !head) {
        raf = requestAnimationFrame(frame);
        return;
      }

      ctx.clearRect(0, 0, W, H);
      drawGrid();

      for (const s of sources) {
        const wob = Math.sin(clock * 0.9 + s.x * 0.01) * 3;
        const mx = s.mid.x + wob;
        const my = s.mid.y - wob * 0.5;

        ctx.save();
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = t === "flux" ? 0.16 : 0.13;
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 5]);
        ctx.lineDashOffset = -clock * 22;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.quadraticCurveTo(mx, my, s.target.x, s.target.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 0.07;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.quadraticCurveTo(mx, my, s.target.x, s.target.y);
        ctx.stroke();
        ctx.restore();

        for (const p of s.particles) {
          p.t += p.speed * dt * 0.42 * speedScale;
          let wrapped = false;
          if (p.t >= 1) {
            p.t -= 1;
            wrapped = true;
          }
          const pm = { x: mx, y: my };
          const pos = quadPoint({ x: s.x, y: s.y }, pm, s.target, p.t);
          const tan = quadTangent({ x: s.x, y: s.y }, pm, s.target, p.t);
          const a = p.t < 0.08 ? p.t / 0.08 : p.t > 0.88 ? (1 - p.t) / 0.12 : 1;
          drawParticle(pos, tan, s.color, Math.max(0, Math.min(1, a)));

          if (wrapped) {
            impacts.push({ x: s.target.x, y: s.target.y, age: 0, life: 0.52, color: s.color });
            trails.push({ x: s.target.x, y: s.target.y, a: 1 });
          }
        }
      }

      drawShoulders();
      drawHead(clock);

      for (const s of sources) drawSourceIcon(s);

      drawImpacts(dt * speedScale);

      if (trails.length) {
        trails = trails.filter((tr) => tr.a > 0.02);
        for (const tr of trails) {
          tr.a *= 0.92;
          if (!ctx) continue;
          ctx.save();
          ctx.globalAlpha = tr.a * 0.35;
          ctx.fillStyle = cfgRef.current.accent;
          ctx.beginPath();
          ctx.arc(tr.x, tr.y, 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      raf = requestAnimationFrame(frame);
    }

    const ro = new ResizeObserver(() => {
      buildLayout();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible) {
          last = performance.now();
        }
      },
      { threshold: 0.05 }
    );
    io.observe(wrap);

    buildLayout();
    raf = requestAnimationFrame((curr) => {
      last = curr;
      raf = requestAnimationFrame(frame);
    });

    const onResize = () => buildLayout();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [t]);

  return (
    <div className="mx-auto w-full">
      <div
        ref={wrapRef}
        className="relative mx-auto w-full overflow-hidden rounded-[18px] border bg-card shadow-sm sm:rounded-[22px] aspect-[1.15/1] sm:aspect-[1.52/1]"
        style={{
          minHeight: 220,
          maxHeight: 440,
          boxShadow: "var(--shadow-soft)",
          borderColor: "var(--border)",
        }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
}
