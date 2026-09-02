"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useScroll,
} from "framer-motion";
import {
  MapPin,
  Mail,
  Clock,
  GraduationCap,
  Store,
  Wrench,
  Bike,
  Hammer,
  Lightbulb,
  FileText,
  ArrowUp,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { LearningSimulation } from "@/components/LearningSimulation";

const themes = [
  { id: "garden", label: "Garden", dot: "bg-[#52b788]" },
  { id: "flux", label: "Flux", dot: "bg-[#7c3aed]" },
  { id: "cupertino", label: "Apple", dot: "bg-[#0071e3]" },
  { id: "paper", label: "Paper", dot: "bg-[#c75a3a]" },
  { id: "studio", label: "Studio", dot: "bg-[#1d1d1f]" },
] as const;

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#gallery", label: "Gallery" },
  { href: "#journey", label: "Journey" },
  { href: "#education", label: "Education" },
  { href: "#store", label: "Store" },
  { href: "#contact", label: "Contact" },
];

const gallery = [
  { src: "/assets/sayid1.jpg", label: "Everyday Presence", span: "" },
  { src: "/assets/sayid2.jpg", label: "Focused And Grounded", span: "" },
  { src: "/assets/sayid3.jpg", label: "Simple Moments", span: "" },
  { src: "/assets/sayid4.jpg", label: "Personal Style", span: "" },
  { src: "/assets/sayid5.jpg", label: "Life Outside Work", span: "" },
  { src: "/assets/sayid6.jpg", label: "Local Roots", span: "" },
  { src: "/assets/sayid7.jpg", label: "Work-Life Balance", span: "" },
];

const galleryCaptions: Record<string, string[]> = {
  garden: [
    "Everyday Presence",
    "Focused And Grounded",
    "Simple Moments",
    "Personal Style",
    "Life Outside Work",
    "Local Roots",
    "Work-Life Balance",
  ],
  flux: [
    "Presence — 01",
    "Focus — 02",
    "Light — 03",
    "Detail — 04",
    "Off Hours — 05",
    "Rooted — 06",
    "Equilibrium — 07",
  ],
  cupertino: [
    "Candid Frame",
    "Studio Focus",
    "Natural Light",
    "Minimal Edit",
    "Off Duty",
    "Field View",
    "Even Balance",
  ],
  paper: [
    "Morning Light",
    "Quiet Hours",
    "Soft Day",
    "Woven Threads",
    "Unhurried Life",
    "Village Hearth",
    "Gentle Equilibrium",
  ],
  studio: [
    "01 — PRESENCE",
    "02 — FOCUS",
    "03 — STILL",
    "04 — FORM",
    "05 — LIFE",
    "06 — TERRAIN",
    "07 — EQUILIBRIUM",
  ],
};

function Magnetic({
  children,
  strength = 0.22,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx2 = useSpring(mx, { damping: 18, stiffness: 260 });
  const sy2 = useSpring(my, { damping: 18, stiffness: 260 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    mx.set((e.clientX - cx) * strength);
    my.set((e.clientY - cy) * strength);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx2, y: sy2 }}
      className="inline-flex"
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [theme, setTheme] = useState("garden");
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [year, setYear] = useState(2026);
  const [cursorHover, setCursorHover] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // motion values for flux cursor + aurora
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  const cX = useSpring(mX, { damping: 26, stiffness: 320 });
  const cY = useSpring(mY, { damping: 26, stiffness: 320 });
  const aX = useSpring(mX, { damping: 40, stiffness: 80 });
  const aY = useSpring(mY, { damping: 40, stiffness: 80 });
  // hero tilt (flux only)
  const hRX = useMotionValue(0);
  const hRY = useMotionValue(0);
  const hX = useSpring(hRX, { damping: 14, stiffness: 140 });
  const hY = useSpring(hRY, { damping: 14, stiffness: 140 });

  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, {
    damping: 30,
    stiffness: 120,
    restDelta: 0.001,
  });

  const isFlux = theme === "flux";

  useEffect(() => {
    setYear(new Date().getFullYear());
    const stored = localStorage.getItem("portfolio-theme");
    if (stored && themes.some((t) => t.id === stored)) setTheme(stored);
    else {
      const attr = document.documentElement.getAttribute("data-theme");
      if (attr) setTheme(attr);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // flux cursor + aurora mouse tracking (desktop only)
  useEffect(() => {
    if (!isFlux) {
      setCursorVisible(false);
      return;
    }
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduce) return;

    const onMove = (e: MouseEvent) => {
      mX.set(e.clientX);
      mY.set(e.clientY);
      if (!cursorVisible) setCursorVisible(true);
    };
    const onLeave = () => setCursorVisible(false);
    const onEnter = () => setCursorVisible(true);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [isFlux, mX, mY, cursorVisible]);

  // flux gallery scroll affordance (arrows + edge fade)
  useEffect(() => {
    if (!isFlux) return;
    const el = carouselRef.current;
    if (!el) return;
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 8);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    // re-check after images load
    const imgs = el.querySelectorAll("img");
    imgs.forEach((im) => im.addEventListener("load", update));
    const t = setTimeout(update, 600);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      imgs.forEach((im) => im.removeEventListener("load", update));
      clearTimeout(t);
    };
  }, [isFlux]);

  const fluxScroll = (dir: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const w = el.clientWidth * 0.85;
    el.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  // drag-to-scroll for desktop mouse
  const dragState = useRef({ down: false, startX: 0, left: 0 });
  const onFluxDown = (e: React.MouseEvent) => {
    const el = carouselRef.current;
    if (!el) return;
    dragState.current = { down: true, startX: e.pageX - el.offsetLeft, left: el.scrollLeft };
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  };
  const onFluxMove = (e: React.MouseEvent) => {
    const el = carouselRef.current;
    if (!el || !dragState.current.down) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.1;
    el.scrollLeft = dragState.current.left - walk;
  };
  const onFluxUp = () => {
    const el = carouselRef.current;
    if (!el) return;
    dragState.current.down = false;
    el.style.cursor = "grab";
    el.style.userSelect = "";
  };

  const onHeroMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFlux) return;
    const r = e.currentTarget.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    hRY.set((e.clientX - cx) * 0.045);
    hRX.set((e.clientY - cy) * -0.045);
  };
  const onHeroLeave = () => {
    hRX.set(0);
    hRY.set(0);
  };

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    if (id === "#") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      {/* flux scroll progress */}
      <motion.div className="flux-progress" style={{ scaleX: progressScale }} />

      {/* flux custom cursor */}
      {isFlux && (
        <motion.div
          aria-hidden
          className={`flux-cursor ${cursorVisible ? "is-visible" : ""} ${cursorHover ? "is-hover" : ""}`}
          style={{ x: cX, y: cY }}
        >
          <span className="flux-cursor__dot" />
        </motion.div>
      )}

      {/* flux aurora — light mesh with cursor follow */}
      {isFlux && (
        <div className="flux-aurora" aria-hidden>
          <div className="flux-aurora__grid" />
          <div className="flux-aurora__glow" />
          <motion.div
            className="flux-aurora__orb"
            style={{
              width: 620,
              height: 620,
              left: -90,
              top: -140,
              background: "radial-gradient(ellipse at center, rgba(124,58,237,0.18), rgba(124,58,237,0) 68%)",
              x: aX,
              y: aY,
            }}
          />
          <div
            className="flux-aurora__orb"
            style={{
              width: 680,
              height: 680,
              right: -110,
              top: 100,
              left: "auto",
              background: "radial-gradient(ellipse at center, rgba(79,70,229,0.14), transparent 66%)",
            }}
          />
          <div
            className="flux-aurora__orb"
            style={{
              width: 540,
              height: 540,
              left: "34%",
              top: "38%",
              background: "radial-gradient(ellipse at center, rgba(6,182,212,0.11), transparent 70%)",
            }}
          />
        </div>
      )}

      {/* liquid blobs - only visible in garden (hidden for flux via --blob-opacity:0) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-[#95d5b2] blur-[70px] opacity-[var(--blob-opacity)] animate-[move_26s_infinite_alternate]" />
        <div className="absolute -bottom-40 -right-32 h-[620px] w-[620px] rounded-full bg-[#52b788] blur-[70px] opacity-[var(--blob-opacity)] animate-[move_32s_infinite_alternate-reverse]" />
        <div className="absolute top-[48%] left-[54%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d8f3dc] blur-[70px] opacity-[var(--blob-opacity)]" />
      </div>

      {/* NAV */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          scrolled ? "pt-2 md:pt-3" : "pt-0"
        }`}
      >
        <div
          className={`mx-auto flex items-center justify-between transition-all duration-500 ${
            scrolled
              ? "mx-3 max-w-[760px] rounded-full border bg-card/80 px-4 py-2.5 shadow-lg backdrop-blur-xl sm:mx-auto sm:px-5 md:px-6"
              : "max-w-[1200px] px-4 py-3 sm:px-6 sm:py-4 md:px-8"
          }`}
        >
          <button
            onClick={() => scrollTo("#")}
            onMouseEnter={() => isFlux && setCursorHover(true)}
            onMouseLeave={() => isFlux && setCursorHover(false)}
            className="flex items-center gap-3"
            aria-label="Back to top"
          >
            <div className="h-9 w-9 overflow-hidden rounded-full border shadow-sm md:h-10 md:w-10">
              <img
                src="/assets/Sayid.jpg"
                alt="Sayid"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="hidden font-mono text-xs font-semibold tracking-widest uppercase opacity-60 md:block">
              SAYID
            </span>
          </button>

          {/* desktop */}
          <ul className="hidden items-center gap-7 md:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => scrollTo(l.href)}
                  onMouseEnter={() => isFlux && setCursorHover(true)}
                  onMouseLeave={() => isFlux && setCursorHover(false)}
                  className="font-mono text-[11px] font-semibold tracking-[0.14em] uppercase opacity-70 hover:opacity-100 transition-opacity"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          {/* mobile sheet */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full md:hidden"
                  aria-label="Menu"
                />
              }
            >
              <Menu className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] max-w-[300px] bg-card">
              <div className="mt-8 flex flex-col gap-1">
                {navLinks.map((l) => (
                  <button
                    key={l.href}
                    onClick={() => scrollTo(l.href)}
                    className="rounded-xl px-4 py-3 text-left font-medium hover:bg-muted transition-colors"
                  >
                    {l.label}
                  </button>
                ))}
                <Separator className="my-4" />
                <p className="px-4 text-xs font-mono tracking-widest uppercase opacity-50">
                  Theme
                </p>
                <div className="grid grid-cols-2 gap-2 px-2 mt-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition-all ${
                        theme === t.id
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card hover:bg-muted"
                      }`}
                    >
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${t.dot}`}
                      />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-[1200px] px-3 pt-[72px] sm:px-4 sm:pt-[88px] md:px-6 md:pt-[110px]">
        {/* outer border — premium per-theme via --main-gradient */}
        <div
          className="relative rounded-[20px] p-[1.5px] shadow-xl sm:rounded-[24px]"
          style={{ background: "var(--main-gradient)" }}
        >
          <div className="rounded-[18px] bg-card/90 backdrop-blur-xl sm:rounded-[22px]">
            {/* HERO */}
            <section className="grid gap-6 p-4 sm:gap-8 sm:p-6 md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:p-10 lg:p-12">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col justify-center"
              >
                <div className="inline-flex max-w-full flex-wrap items-center gap-1.5 self-start rounded-2xl border bg-card px-2 py-1.5 shadow-sm sm:gap-2 sm:rounded-full sm:flex-nowrap">
                  <span className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 shrink-0">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-card border text-primary shrink-0">
                      <GraduationCap className="h-3 w-3" />
                    </span>
                    <span className="font-mono text-[10px] font-semibold tracking-wide uppercase sm:text-[11px]">
                      CS Graduate
                    </span>
                  </span>
                  <span className="hidden text-muted-foreground sm:inline">→</span>
                  <span className="flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-primary-foreground shrink-0">
                    <Store className="h-3 w-3 shrink-0" />
                    <span className="font-mono text-[10px] font-bold tracking-wide uppercase sm:text-[11px]">
                      Hardware Business Owner
                    </span>
                  </span>
                </div>

                <h1 className="mt-6 font-heading text-[clamp(2.2rem,5vw,3.6rem)] font-normal leading-[0.9] tracking-[-0.04em]">
                  Sarowar Jahan
                  <br />
                  <span className="font-heading italic text-primary relative">
                    Sayid
                    <span className="absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-[var(--accent)] to-transparent opacity-80" />
                  </span>
                </h1>

                <p className="mt-5 max-w-[62ch] text-[15px] leading-7 text-muted-foreground md:text-[17px]">
                  Computer Science graduate turned entrepreneur, managing{" "}
                  <strong className="font-semibold text-foreground">
                    Shahin Machinery and Hardware Store
                  </strong>{" "}
                  in Mymensingh — your trusted supplier for machinery, cycle
                  parts, and general hardware.
                </p>

                <div className="mt-4 inline-flex max-w-full flex-wrap items-center gap-1.5 self-start rounded-2xl border bg-card px-3 py-1.5 text-sm shadow-sm sm:flex-nowrap sm:gap-2 sm:rounded-full">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="font-medium shrink-0">Bangladesh</span>
                  <span className="hidden h-1 w-1 rounded-full bg-muted-foreground/40 sm:block" />
                  <span className="min-w-0 break-words text-xs text-muted-foreground sm:truncate">
                    B.O.C More, Ray Bazar, Atharabari
                  </span>
                </div>



                <div className="mt-6 flex gap-3">
                  {[
                    {
                      href: "https://facebook.com/sayid2kx",
                      label: "Facebook",
                      icon: (
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      ),
                    },
                    {
                      href: "https://x.com/sayid2kx",
                      label: "X",
                      icon: (
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                        </svg>
                      ),
                    },
                    {
                      href: "mailto:sayid2kx@gmail.com",
                      label: "Email",
                      icon: <Mail className="h-4 w-4" />,
                    },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      onMouseEnter={() => isFlux && setCursorHover(true)}
                      onMouseLeave={() => isFlux && setCursorHover(false)}
                      className="grid h-10 w-10 place-items-center rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center justify-center px-4 sm:px-0"
                style={{ perspective: isFlux ? 800 : undefined }}
              >
                <motion.div
                  className="relative"
                  onMouseMove={onHeroMove}
                  onMouseLeave={onHeroLeave}
                  style={isFlux ? { rotateX: hX, rotateY: hY, transformStyle: "preserve-3d" } : undefined}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                >
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-[var(--accent)]/20 via-transparent to-[var(--accent)]/10 blur-2xl" />
                  {isFlux && (
                    <>
                      <motion.div
                        aria-hidden
                        className="absolute -inset-6 rounded-full border border-violet-500/10 hidden md:block"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                        style={{ borderStyle: "dashed" }}
                      />
                      <div className="absolute -inset-10 bg-gradient-to-br from-violet-600/8 via-transparent to-cyan-500/8 blur-2xl rounded-full pointer-events-none" />
                    </>
                  )}
                  <div className="relative h-[240px] w-[240px] overflow-hidden rounded-full border bg-card p-1.5 shadow-2xl max-w-[80vw] sm:h-[280px] sm:w-[280px] md:h-[340px] md:w-[340px]">
                    <div className="h-full w-full overflow-hidden rounded-full border-4 border-card">
                      <Image
                        src="/assets/Sayid.jpg"
                        alt="Sarowar Jahan Sayid"
                        width={800}
                        height={800}
                        priority
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </div>
                  </div>
                  <motion.div
                    animate={isFlux ? { y: [0, -6, 0] } : undefined}
                    transition={isFlux ? { duration: 3.2, repeat: Infinity, ease: "easeInOut" } : undefined}
                    className="absolute -bottom-2 -right-2 grid h-12 w-12 place-items-center rounded-2xl border bg-card shadow-lg sm:h-14 sm:w-14"
                    style={isFlux ? { transform: "translateZ(28px)" } : undefined}
                  >
                    <Store className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                  </motion.div>
                </motion.div>
              </motion.div>
            </section>

            {/* LEARNING SIMULATION — centered, no text */}
            <section
              id="simulation"
              aria-label="Learning simulation"
              className="flex justify-center px-4 pb-6 sm:px-6 sm:pb-8 md:px-10"
            >
              <div className="w-full max-w-[880px]">
                <LearningSimulation theme={theme} />
              </div>
            </section>

            {/* ABOUT */}
            <section id="about" className="scroll-mt-24 px-4 pb-6 sm:px-6 sm:pb-8 md:px-10">
              <Card className="rounded-[20px] border shadow-sm sm:rounded-[24px]">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <h2 className="font-heading text-[clamp(1.6rem,3vw,2.2rem)] tracking-tight">
                    About
                  </h2>
                  <Separator className="my-6" />
                  <div className="grid gap-4 sm:gap-6 md:grid-cols-[1.6fr_0.9fr]">
                    <motion.div
                      whileHover={isFlux ? { y: -4 } : undefined}
                      transition={{ type: "spring", stiffness: 240, damping: 18 }}
                      className="rounded-2xl border bg-card p-4 sm:p-6 shadow-sm"
                      onMouseEnter={() => isFlux && setCursorHover(true)}
                      onMouseLeave={() => isFlux && setCursorHover(false)}
                    >
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--accent)]/15 border text-primary">
                        <Lightbulb className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 font-heading text-xl">
                        Technology Mindset, Business Focus
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        I studied Computer Science and now apply that practical,
                        problem-solving mindset to Shahin Machinery and Hardware
                        Store. My current focus is serving local customers with
                        reliable machinery, cycle parts, and general hardware
                        supplies.
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Badge className="rounded-full">Computer Science</Badge>
                        <Badge variant="secondary" className="rounded-full">
                          Entrepreneur
                        </Badge>
                        <Badge variant="outline" className="rounded-full">
                          Mymensingh
                        </Badge>
                      </div>
                    </motion.div>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <Card className="grid place-items-center p-4 text-center rounded-2xl sm:p-6">
                        <div className="text-2xl font-bold tracking-tight text-primary sm:text-4xl">
                          3+
                        </div>
                        <div className="mt-1 font-mono text-[10px] font-semibold tracking-widest uppercase opacity-60">
                          Product Areas
                        </div>
                      </Card>
                      <Card className="grid place-items-center p-4 text-center rounded-2xl sm:p-6">
                        <div className="text-2xl font-bold tracking-tight sm:text-4xl">
                          2026
                        </div>
                        <div className="mt-1 font-mono text-[10px] font-semibold tracking-widest uppercase opacity-60">
                          Business Focus
                        </div>
                      </Card>
                      <Card className="col-span-2 p-5 rounded-2xl">
                        <div className="font-mono text-xs tracking-widest uppercase opacity-60">
                          Shahin Machinery
                        </div>
                        <div className="mt-1 text-sm font-medium">
                          Family business · Since establishment
                        </div>
                        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: "85%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                            className="h-full rounded-full bg-primary"
                          />
                        </div>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* GALLERY */}
            <section id="gallery" className="scroll-mt-24 px-4 pb-6 sm:px-6 sm:pb-8 md:px-10">
              <Card className="rounded-[20px] border shadow-sm overflow-hidden sm:rounded-[24px]">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex items-baseline justify-between gap-4 flex-wrap">
                    <h2 className="font-heading text-[clamp(1.6rem,3vw,2.2rem)] tracking-tight">
                      Life In Frames
                    </h2>
                    {isFlux && (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest uppercase opacity-60">
                        <span className="hidden sm:inline">Drag</span> ↔ <span className="sm:hidden">Swipe</span> to explore
                      </span>
                    )}
                  </div>
                  <Separator className="my-6" />
                  {isFlux ? (
                    <div className="relative -mx-4 sm:-mx-2">
                      {/* edge fades */}
                      <div
                        className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-card to-transparent z-10 hidden sm:block transition-opacity"
                        style={{ opacity: canScrollLeft ? 1 : 0 }}
                      />
                      <div
                        className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-card to-transparent z-10 hidden sm:block transition-opacity"
                        style={{ opacity: canScrollRight ? 1 : 0 }}
                      />
                      {/* arrow controls — desktop */}
                      <div className="hidden sm:flex absolute -top-10 right-2 gap-1.5 z-10">
                        <button
                          onClick={() => fluxScroll(-1)}
                          onMouseEnter={() => setCursorHover(true)}
                          onMouseLeave={() => setCursorHover(false)}
                          aria-label="Scroll left"
                          className="grid h-8 w-8 place-items-center rounded-full border bg-card shadow-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          disabled={!canScrollLeft}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => fluxScroll(1)}
                          onMouseEnter={() => setCursorHover(true)}
                          onMouseLeave={() => setCursorHover(false)}
                          aria-label="Scroll right"
                          className="grid h-8 w-8 place-items-center rounded-full border bg-card shadow-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors disabled:opacity-30 disabled:pointer-events-none"
                          disabled={!canScrollRight}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                      <div
                        ref={carouselRef}
                        onMouseDown={onFluxDown}
                        onMouseMove={onFluxMove}
                        onMouseLeave={onFluxUp}
                        onMouseUp={onFluxUp}
                        className="flux-carousel flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4 sm:px-2 pb-3 pt-1 -mb-1"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                      >
                        {gallery.map((item, i) => (
                          <motion.button
                            key={item.src}
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ delay: i * 0.045, ease: [0.16, 1, 0.3, 1] }}
                            whileHover={{ y: -6, scale: 1.015 }}
                            onHoverStart={() => setCursorHover(true)}
                            onHoverEnd={() => setCursorHover(false)}
                            onClick={() => setLightbox(item.src)}
                            className="flux-carousel__card group relative aspect-[4/4.85] overflow-hidden rounded-2xl border bg-card text-left shadow-sm hover:shadow-xl hover:shadow-violet-600/10 transition-all shrink-0 snap-start select-none"
                            style={{ touchAction: "pan-y" }}
                          >
                            <img
                              src={item.src}
                              alt={(galleryCaptions[theme] ?? galleryCaptions.garden)[i] ?? item.label}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                              draggable={false}
                            />
                            {/* top number + subtle grain */}
                            <span className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-foreground text-background font-mono text-[10px] font-bold shadow-md">
                              0{i + 1}
                            </span>
                            {/* hover sheen */}
                            <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-violet-600/10 via-transparent to-transparent" />
                            <span
                              className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-3 py-2.5 backdrop-blur-md"
                              style={{
                                background: "var(--gallery-caption-bg)",
                                color: "var(--gallery-caption-fg)",
                                borderTop: "1px solid var(--gallery-caption-border)",
                              }}
                            >
                              <span className="font-mono text-xs font-semibold tracking-wider uppercase truncate">
                                {(galleryCaptions[theme] ?? galleryCaptions.garden)[i] ?? item.label}
                              </span>
                              <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-black text-xs opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0 translate-x-1">
                                ↗
                              </span>
                            </span>
                          </motion.button>
                        ))}
                      </div>
                      <p className="mt-2 text-center font-mono text-[11px] tracking-widest uppercase opacity-40 sm:hidden">
                        Swipe to explore → {gallery.length} frames
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {gallery.map((item, i) => (
                        <motion.button
                          key={item.src}
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => setLightbox(item.src)}
                          className="group relative aspect-square overflow-hidden rounded-2xl border bg-card text-left shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                        >
                          <img
                            src={item.src}
                            alt={(galleryCaptions[theme] ?? galleryCaptions.garden)[i] ?? item.label}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <span className="absolute left-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-foreground text-background font-mono text-[10px] font-bold">
                            0{i + 1}
                          </span>
                          <span
                            className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-3 py-2.5 backdrop-blur"
                            style={{
                              background: "var(--gallery-caption-bg)",
                              color: "var(--gallery-caption-fg)",
                              borderTop: "1px solid var(--gallery-caption-border)",
                            }}
                          >
                            <span className="font-mono text-xs font-semibold tracking-wider uppercase truncate">
                              {(galleryCaptions[theme] ?? galleryCaptions.garden)[i] ?? item.label}
                            </span>
                            <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-black text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                              ↗
                            </span>
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* JOURNEY */}
            <section id="journey" className="scroll-mt-24 px-4 pb-6 sm:px-6 sm:pb-8 md:px-10">
              <Card className="rounded-[20px] border shadow-sm sm:rounded-[24px]">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <h2 className="font-heading text-[clamp(1.6rem,3vw,2.2rem)] tracking-tight">
                    My Journey
                  </h2>
                  <Separator className="my-6" />
                  <div className="mx-auto max-w-[820px] space-y-0">
                    {[
                      {
                        year: "2020 — 2025",
                        title: "Computer Science Student",
                        desc: "Pursued B.Sc in Computer Science at Netrokona University, building a strong foundation in programming, algorithms, and problem-solving.",
                        icon: GraduationCap,
                        tags: ["Programming", "Algorithms", "Web Dev"],
                        current: false,
                      },
                      {
                        year: "2025",
                        title: "Learning Web Development",
                        desc: "Self-studied modern web development with React, Node.js, Next.js, and MongoDB — building projects and sharpening full-stack skills before shifting paths.",
                        icon: FileText,
                        tags: ["React", "Node.js", "Next.js", "MongoDB"],
                        current: false,
                      },
                      {
                        year: "Jan 2026 — Present",
                        title: "Hardware Business Owner",
                        desc: "Stepped in to help my father's business, Shahin Machinery and Hardware Store. Managing operations, inventory, and customer relations while applying a problem-solving mindset to grow the family business.",
                        icon: Store,
                        tags: [
                          "Business Management",
                          "Inventory",
                          "Customer Relations",
                        ],
                        current: true,
                      },
                    ].map((step, idx) => (
                      <div key={step.title} className="flex gap-3 sm:gap-4 md:gap-6">
                        <div className="flex flex-col items-center">
                          <motion.div
                            whileInView={isFlux ? { scale: [0.9, 1.08, 1] } : undefined}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.08 }}
                            className={`grid h-10 w-10 place-items-center rounded-full border shadow-sm shrink-0 sm:h-12 sm:w-12 ${
                              step.current
                                ? "bg-primary text-primary-foreground border-primary scale-105"
                                : "bg-card text-primary"
                            }`}
                          >
                            <step.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                          </motion.div>
                          {idx !== 2 && (
                            <div className="mt-2 w-px flex-1 bg-gradient-to-b from-[var(--accent)]/40 to-[var(--accent)]/10 min-h-[40px]" />
                          )}
                        </div>
                        <motion.div
                          initial={isFlux ? { opacity: 0, x: 10 } : false}
                          whileInView={isFlux ? { opacity: 1, x: 0 } : undefined}
                          viewport={{ once: true, margin: "-30px" }}
                          transition={{ duration: 0.5, delay: idx * 0.07 }}
                          className="flex-1 mb-4 sm:mb-6"
                        >
                          <Card
                            onMouseEnter={() => isFlux && setCursorHover(true)}
                            onMouseLeave={() => isFlux && setCursorHover(false)}
                            className={`rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-md ${
                              step.current
                                ? "border-[var(--accent)]/30 shadow-md"
                                : ""
                            }`}
                          >
                            <CardContent className="p-4 sm:p-5">
                              <Badge
                                variant={step.current ? "default" : "secondary"}
                                className="rounded-full font-mono text-[11px]"
                              >
                                {step.year}
                              </Badge>
                              <h3 className="mt-3 font-heading text-lg leading-tight">
                                {step.title}
                              </h3>
                              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                {step.desc}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {step.tags.map((t) => (
                                  <Badge
                                    key={t}
                                    variant={
                                      idx === 2 && t === "Business Management"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="rounded-full font-mono text-[11px]"
                                  >
                                    {t}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* EDUCATION */}
            <section id="education" className="scroll-mt-24 px-4 pb-6 sm:px-6 sm:pb-8 md:px-10">
              <Card className="rounded-[20px] border shadow-sm sm:rounded-[24px]">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <h2 className="font-heading text-[clamp(1.6rem,3vw,2.2rem)] tracking-tight">
                    Education
                  </h2>
                  <Separator className="my-6" />
                  <div className="mx-auto grid max-w-[900px] gap-4">
                    {[
                      {
                        school: "Netrokona University",
                        degree: "B.Sc, Computer Science (Jan 2020 - Sep 2025)",
                        tag: "B.Sc, Computer Science",
                        years: "Jan 2020 - Sep 2025",
                      },
                      {
                        school: "Advanced Residential Model College, Mymensingh",
                        degree: "H.S.C, Science (2017 - 2019)",
                        tag: "H.S.C, Science",
                        years: "2017 - 2019",
                        grade: "Grade: 4.50",
                      },
                      {
                        school: "Atharabari M.C High School",
                        degree: "S.S.C, Science (2012 - 2017)",
                        tag: "S.S.C, Science",
                        years: "2012 - 2017",
                        grade: "Grade: 4.73",
                      },
                    ].map((e) => (
                      <motion.div
                        key={e.school}
                        initial={isFlux ? { opacity: 0, y: 10 } : false}
                        whileInView={isFlux ? { opacity: 1, y: 0 } : undefined}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45 }}
                      >
                        <Card
                          onMouseEnter={() => isFlux && setCursorHover(true)}
                          onMouseLeave={() => isFlux && setCursorHover(false)}
                          className="rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                        >
                          <div className="flex gap-3 sm:gap-4">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent)]/15 text-primary border shrink-0 sm:h-12 sm:w-12">
                              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-heading text-[15px] leading-tight break-words sm:text-base md:text-lg">
                                {e.school}
                              </h3>
                              <p className="mt-1 break-words text-xs leading-5 text-muted-foreground sm:text-sm">
                                {e.degree}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <Badge className="rounded-full">{e.tag}</Badge>
                                <Badge variant="secondary" className="rounded-full">
                                  {e.years}
                                </Badge>
                                {e.grade && (
                                  <Badge variant="outline" className="rounded-full">
                                    {e.grade}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* STORE */}
            <section id="store" className="scroll-mt-24 px-4 pb-6 sm:px-6 sm:pb-8 md:px-10">
              <Card className="rounded-[20px] border shadow-sm sm:rounded-[24px]">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-heading text-[clamp(1.6rem,3vw,2.2rem)] tracking-tight">
                      Our Store
                    </h2>
                    <Badge className="self-start rounded-full gap-1 sm:self-auto">
                      <Store className="h-3 w-3" /> Shahin Machinery
                    </Badge>
                  </div>
                  <Separator className="my-6" />
                  <div className="mx-auto grid max-w-[900px] gap-4">
                    {[
                      {
                        icon: Wrench,
                        title: "Industrial Machinery",
                        desc: "Heavy-duty machinery for construction, agriculture, and industrial applications. We provide reliable equipment from trusted brands.",
                        tags: [
                          "Power Tools",
                          "Construction Equipment",
                          "Agricultural Machinery",
                          "Industrial Parts",
                        ],
                      },
                      {
                        icon: Bike,
                        title: "Cycle Parts & Accessories",
                        desc: "Complete range of bicycle components, spare parts, and accessories for all types of cycles. From commuter bikes to professional equipment.",
                        tags: [
                          "Spare Parts",
                          "Accessories",
                          "Tires & Tubes",
                          "Chains & Gears",
                        ],
                      },
                      {
                        icon: Hammer,
                        title: "General Hardware",
                        desc: "Comprehensive hardware supplies including hand tools, fasteners, plumbing, and electrical items. One-stop shop for all your needs.",
                        tags: [
                          "Hand Tools",
                          "Fasteners",
                          "Plumbing",
                          "Electrical",
                          "Paints",
                        ],
                      },
                    ].map((f) => (
                      <motion.div
                        key={f.title}
                        initial={isFlux ? { opacity: 0, y: 8 } : false}
                        whileInView={isFlux ? { opacity: 1, y: 0 } : undefined}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                      >
                        <Card
                          onMouseEnter={() => isFlux && setCursorHover(true)}
                          onMouseLeave={() => isFlux && setCursorHover(false)}
                          className="rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                        >
                          <div className="flex gap-3 sm:gap-4">
                            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent)]/15 text-primary border shrink-0 sm:h-12 sm:w-12">
                              <f.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-heading text-base sm:text-lg">
                                {f.title}
                              </h3>
                              <p className="mt-1 text-sm leading-6 text-muted-foreground break-words">
                                {f.desc}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {f.tags.map((t) => (
                                  <Badge
                                    key={t}
                                    variant={
                                      t === "Power Tools" ||
                                      t === "Spare Parts" ||
                                      t === "Hand Tools"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="rounded-full font-mono text-[11px]"
                                  >
                                    {t}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* CONTACT */}
            <section id="contact" className="scroll-mt-24 px-4 pb-6 sm:px-6 sm:pb-8 md:px-10">
              <Card className="rounded-[20px] border shadow-sm sm:rounded-[24px]">
                <CardContent className="p-4 sm:p-6 md:p-8">
                  <h2 className="font-heading text-[clamp(1.6rem,3vw,2.2rem)] tracking-tight">
                    Get In Touch
                  </h2>
                  <Separator className="my-6" />
                  <Card className="rounded-2xl border shadow-sm">
                    <CardContent className="p-4 sm:p-6 md:p-8">
                      <div className="text-center">
                        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-muted border">
                          <Store className="h-7 w-7" />
                        </div>
                        <h3 className="mt-3 font-heading text-xl">
                          Shahin Machinery & Hardware Store
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Visit us or reach out — we’re here everyday
                        </p>
                      </div>

                      <div className="mt-6 grid gap-3 sm:gap-4 md:grid-cols-3">
                        <div className="flex gap-3 rounded-2xl border bg-muted/40 p-4 min-w-0">
                          <div className="grid h-9 w-9 place-items-center rounded-xl border bg-card shrink-0">
                            <MapPin className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-mono text-[10px] font-bold tracking-widest uppercase text-primary">
                              Address
                            </div>
                            <div className="mt-1 text-sm font-medium leading-6">
                              B.O.C More, Ray Bazar
                              <br />
                              Atharabari, Ishwargonj, Mymensingh
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 rounded-2xl border bg-muted/40 p-4 min-w-0">
                          <div className="grid h-9 w-9 place-items-center rounded-xl border bg-card shrink-0">
                            <Mail className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-mono text-[10px] font-bold tracking-widest uppercase text-primary">
                              Email
                            </div>
                            <a
                              href="mailto:sayid2kx@gmail.com"
                              onMouseEnter={() => isFlux && setCursorHover(true)}
                              onMouseLeave={() => isFlux && setCursorHover(false)}
                              className="mt-1 block break-all text-sm font-semibold hover:text-primary transition-colors"
                            >
                              sayid2kx@gmail.com
                            </a>
                          </div>
                        </div>
                        <div className="flex gap-3 rounded-2xl border bg-muted/40 p-4 min-w-0">
                          <div className="grid h-9 w-9 place-items-center rounded-xl border bg-card shrink-0">
                            <Clock className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-mono text-[10px] font-bold tracking-widest uppercase text-primary">
                              Business Hours
                            </div>
                            <div className="mt-1 text-sm font-medium">
                              Everyday, 9:30 AM - 11:30 PM
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap justify-center gap-3">
                        {isFlux ? (
                          <Magnetic>
                            <a
                              href="mailto:sayid2kx@gmail.com"
                              onMouseEnter={() => setCursorHover(true)}
                              onMouseLeave={() => setCursorHover(false)}
                              className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-violet-600/15"
                            >
                              <Mail className="h-4 w-4" /> Email Sayid
                            </a>
                          </Magnetic>
                        ) : (
                          <a
                            href="mailto:sayid2kx@gmail.com"
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                          >
                            <Mail className="h-4 w-4" /> Email Sayid
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </section>

            <div className="h-6" />
          </div>
        </div>
      </main>

      {/* footer — premium per theme, taller */}
      <footer
        className="mt-8 border-t text-white"
        style={{ background: "var(--footer-bg)" }}
      >
        <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 sm:py-12 md:py-16 lg:py-20">
          <div className="grid gap-10 md:grid-cols-[1.6fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-white/15">
                  <img
                    src="/assets/Sayid.jpg"
                    alt="Sayid"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="font-heading text-lg tracking-tight">
                  Sarowar Jahan Sayid
                </span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
                Computer Science graduate turned entrepreneur, managing Shahin
                Machinery and Hardware Store in Mymensingh — trusted supplier
                for machinery, cycle parts and general hardware.
              </p>
              <div className="mt-6 flex gap-3">
                <a
                  href="https://facebook.com/sayid2kx"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  onMouseEnter={() => isFlux && setCursorHover(true)}
                  onMouseLeave={() => isFlux && setCursorHover(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white hover:text-black"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/sayid2kx"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  onMouseEnter={() => isFlux && setCursorHover(true)}
                  onMouseLeave={() => isFlux && setCursorHover(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white hover:text-black"
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.153h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </a>
                <a
                  href="mailto:sayid2kx@gmail.com"
                  aria-label="Email"
                  onMouseEnter={() => isFlux && setCursorHover(true)}
                  onMouseLeave={() => isFlux && setCursorHover(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white hover:text-black"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-mono text-xs tracking-widest uppercase text-white/60">
                Visit
              </h4>
              <div className="mt-4 space-y-3 text-sm leading-6 text-white/75">
                <p>
                  B.O.C More, Ray Bazar
                  <br />
                  Atharabari, Ishwargonj
                  <br />
                  Mymensingh, Bangladesh
                </p>
                <a
                  href="mailto:sayid2kx@gmail.com"
                  className="inline-flex items-center gap-2 font-medium text-white hover:text-white/80 transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" /> sayid2kx@gmail.com
                </a>
                <p className="font-mono text-xs tracking-wide text-white/60">
                  Everyday, 9:30 AM - 11:30 PM
                </p>
              </div>
            </div>
          </div>
          <Separator className="my-10 bg-white/10" />
          <div className="flex flex-col items-center justify-between gap-3 text-center md:flex-row">
            <span className="font-mono text-xs tracking-wide text-white/60">
              © {year} Sarowar Jahan Sayid · Mymensingh, Bangladesh
            </span>
            <span className="font-mono text-xs tracking-wide text-white/40">
              Shahin Machinery & Hardware Store
            </span>
          </div>
        </div>
      </footer>

      {/* theme dock - desktop only */}
      <div className="fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 items-center gap-1.5 rounded-full border bg-card/90 px-2 py-1.5 shadow-xl backdrop-blur-xl md:flex max-w-[95vw] overflow-x-auto">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            onMouseEnter={() => isFlux && setCursorHover(true)}
            onMouseLeave={() => isFlux && setCursorHover(false)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              theme === t.id
                ? "bg-primary text-primary-foreground shadow"
                : "hover:bg-muted"
            }`}
            aria-pressed={theme === t.id}
          >
            <span className={`h-2 w-2 rounded-full ${t.dot}`} />
            {t.label}
          </button>
        ))}
      </div>

      {/* scroll to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            onMouseEnter={() => isFlux && setCursorHover(true)}
            onMouseLeave={() => isFlux && setCursorHover(false)}
            className="fixed bottom-4 right-4 z-40 grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors sm:bottom-6 sm:right-6"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* lightbox — resolution-aware, perfectly fitted */}
      <Dialog open={!!lightbox} onOpenChange={() => setLightbox(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-w-none w-auto bg-transparent border-0 shadow-none p-0 flex items-center justify-center overflow-visible [&>button]:hidden"
        >
          <DialogTitle className="sr-only">Gallery preview</DialogTitle>
          {/* dark backdrop is handled by DialogOverlay; this wrapper centers perfectly */}
          <div className="relative flex max-h-[92vh] max-w-[92vw] items-center justify-center p-4">
            <button
              onClick={() => setLightbox(null)}
              className="absolute -right-2 -top-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-black shadow-xl border border-black/10 hover:scale-105 transition-transform md:-right-3 md:-top-3"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>
            {lightbox && (
              <img
                src={lightbox}
                alt="Gallery preview"
                className="h-auto w-auto max-h-[85vh] max-w-[92vw] md:max-h-[88vh] object-contain rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.45)] border border-white/10 bg-white"
                style={{ imageRendering: "auto" }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
