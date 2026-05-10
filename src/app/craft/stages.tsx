"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";

export function HeroGlyph() {
  return (
    <svg viewBox="0 0 400 400" className={styles.heroGlyph} aria-hidden="true">
      <defs>
        <pattern
          id="paperStripes"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="6"
            stroke="rgba(28,19,13,.07)"
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id="goldGrad" cx="50%" cy="40%">
          <stop offset="0%" stopColor="#f6c66a" />
          <stop offset="60%" stopColor="#b48953" />
          <stop offset="100%" stopColor="#7a5a36" />
        </radialGradient>
      </defs>
      <circle
        cx="200"
        cy="200"
        r="180"
        fill="url(#paperStripes)"
        opacity="0.6"
      />
      <circle
        cx="200"
        cy="200"
        r="180"
        fill="none"
        stroke="rgba(28,19,13,.18)"
        strokeDasharray="1 3"
      />
      <path
        d="M 60 60 Q 200 150 340 60"
        fill="none"
        stroke="#1c130d"
        strokeWidth="0.8"
      />
      {Array.from({ length: 24 }).map((_, i) => {
        const t = i / 23;
        const x = 60 + 280 * t;
        const y = 60 + Math.sin(t * Math.PI) * 90;
        return <circle key={i} cx={x} cy={y} r="2.2" fill="#b48953" />;
      })}
      <path
        d="M 200 165 C 240 165 255 205 255 240 C 255 280 230 300 200 300 C 170 300 145 280 145 240 C 145 205 160 165 200 165 Z"
        fill="url(#goldGrad)"
        stroke="#7a5a36"
        strokeWidth="0.6"
      />
      <ellipse cx="200" cy="235" rx="22" ry="38" fill="#1c130d" opacity=".18" />
      <circle cx="200" cy="225" r="9" fill="#f6f0e0" opacity=".55" />
      <circle cx="200" cy="225" r="3" fill="#fff" opacity=".7" />
      <circle
        cx="200"
        cy="155"
        r="7"
        fill="none"
        stroke="#7a5a36"
        strokeWidth="1.6"
      />
      <text
        x="200"
        y="370"
        textAnchor="middle"
        fontFamily="var(--font-dm-sans), sans-serif"
        fontSize="9"
        letterSpacing="3"
        fill="rgba(28,19,13,.5)"
      >
        EST · MMXIV · QALA CHOWK
      </text>
    </svg>
  );
}

export function StageSketch() {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio > 0.5) setRevealed(true);
      },
      { threshold: [0.5] },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      className={`${styles.stageArt} ${revealed ? styles.sketchOn : ""}`}
      ref={ref}
      onClick={() => setRevealed(true)}
    >
      <div className={`${styles.artCorner} ${styles.tl}`} />
      <div className={`${styles.artCorner} ${styles.tr}`} />
      <div className={`${styles.artCorner} ${styles.bl}`} />
      <div className={`${styles.artCorner} ${styles.br}`} />
      <div className={styles.artFrame} />
      <svg
        viewBox="0 0 400 500"
        className={styles.sketchSvg}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern
            id="grid1"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(28,19,13,.05)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="400" height="500" fill="url(#grid1)" />
        <line
          className={styles.ghost}
          x1="200"
          y1="40"
          x2="200"
          y2="460"
          strokeWidth="0.6"
        />
        <line
          className={styles.ghost}
          x1="80"
          y1="250"
          x2="320"
          y2="250"
          strokeWidth="0.6"
        />
        <circle
          className={styles.ghost}
          cx="200"
          cy="250"
          r="120"
          strokeWidth="0.6"
        />
        <path
          className={styles.reveal}
          style={{ "--len": 800 } as React.CSSProperties}
          strokeWidth="1.5"
          d="M 200 130 C 270 130 300 200 300 270 C 300 340 260 380 200 380 C 140 380 100 340 100 270 C 100 200 130 130 200 130 Z"
        />
        <path
          className={styles.reveal}
          style={
            { "--len": 400, transitionDelay: ".4s" } as React.CSSProperties
          }
          strokeWidth="0.8"
          d="M 200 150 L 160 250 L 200 380 L 240 250 Z"
        />
        <line
          className={styles.reveal}
          style={
            { "--len": 200, transitionDelay: ".7s" } as React.CSSProperties
          }
          strokeWidth="0.8"
          x1="160"
          y1="250"
          x2="240"
          y2="250"
        />
        <circle
          className={styles.reveal}
          style={{ "--len": 180, transitionDelay: "1s" } as React.CSSProperties}
          cx="200"
          cy="115"
          r="14"
          strokeWidth="1"
        />
        <line
          className={styles.reveal}
          style={
            { "--len": 120, transitionDelay: "1.3s" } as React.CSSProperties
          }
          strokeWidth="0.6"
          x1="300"
          y1="200"
          x2="350"
          y2="170"
        />
        <text
          x="350"
          y="166"
          fontFamily="var(--font-cormorant-garamond), serif"
          fontStyle="italic"
          fontSize="14"
          fill="rgba(28,19,13,.55)"
        >
          teardrop
        </text>
        <line
          className={styles.reveal}
          style={
            { "--len": 120, transitionDelay: "1.5s" } as React.CSSProperties
          }
          strokeWidth="0.6"
          x1="100"
          y1="320"
          x2="55"
          y2="350"
        />
        <text
          x="20"
          y="362"
          fontFamily="var(--font-cormorant-garamond), serif"
          fontStyle="italic"
          fontSize="14"
          fill="rgba(28,19,13,.55)"
        >
          22 mm
        </text>
      </svg>
      <div className={styles.artTag}>
        <span className={styles.tagDot} />
        Pencil on vellum
      </div>
    </div>
  );
}

export function StageWax() {
  const [progress, setProgress] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const lastX = useRef<number | null>(null);

  const onMove = (clientX: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const xRel = (clientX - r.left) / r.width;
    if (lastX.current !== null) {
      const dx = Math.abs(xRel - lastX.current);
      setProgress((p) => Math.min(1, p + dx * 0.9));
    }
    lastX.current = xRel;
  };

  const carve = progress;

  const shapePath = (() => {
    const c = carve;
    const lx = 90 + 30 * c;
    const rx = 310 - 30 * c;
    const ty = 110 + 20 * c;
    const by = 410 - 20 * c;
    const bow = 0.2 + 0.6 * c;
    const cy = 250;
    return `M ${lx} ${ty} Q ${lx - 10 * bow} ${cy} ${lx + (200 - lx) * 0.05} ${by} Q 200 ${by + 30 * c} ${rx - (rx - 200) * 0.05} ${by} Q ${rx + 10 * bow} ${cy} ${rx} ${ty} Q 200 ${ty - 25 * c} ${lx} ${ty} Z`;
  })();

  return (
    <div
      className={styles.stageArt}
      ref={ref}
      style={{ cursor: "ew-resize" }}
      onMouseMove={(e) => onMove(e.clientX)}
      onMouseLeave={() => {
        lastX.current = null;
      }}
      onTouchMove={(e) => {
        if (e.touches[0]) onMove(e.touches[0].clientX);
      }}
    >
      <div className={`${styles.artCorner} ${styles.tl}`} />
      <div className={`${styles.artCorner} ${styles.tr}`} />
      <div className={`${styles.artCorner} ${styles.bl}`} />
      <div className={`${styles.artCorner} ${styles.br}`} />
      <div className={styles.artFrame} />
      <svg
        viewBox="0 0 400 500"
        style={{ position: "absolute", inset: 0 }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="waxGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8d4a3" />
            <stop offset="100%" stopColor="#b8924e" />
          </linearGradient>
          <pattern
            id="waxStripes"
            width="3"
            height="3"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(35)"
          >
            <rect width="3" height="3" fill="#d6b87e" />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="3"
              stroke="#a98549"
              strokeWidth=".6"
            />
          </pattern>
          <clipPath id="waxClip">
            <path d={shapePath} />
          </clipPath>
        </defs>
        <rect
          x="90"
          y="110"
          width="220"
          height="300"
          fill="url(#waxStripes)"
          opacity={1 - carve * 0.5}
        />
        <g clipPath="url(#waxClip)">
          <rect x="0" y="0" width="400" height="500" fill="url(#waxGrad)" />
          <ellipse
            cx="170"
            cy="220"
            rx="60"
            ry="120"
            fill="#fff"
            opacity=".22"
          />
          <ellipse
            cx="240"
            cy="320"
            rx="40"
            ry="80"
            fill="#1c130d"
            opacity=".15"
          />
        </g>
        {carve > 0.05 &&
          Array.from({ length: Math.floor(carve * 14) }).map((_, i) => {
            const a = (i / 14) * Math.PI * 2;
            const r = 170 + (i % 3) * 8;
            return (
              <circle
                key={i}
                cx={200 + Math.cos(a) * r}
                cy={250 + Math.sin(a) * r * 0.7}
                r={1.2 + (i % 2) * 0.5}
                fill="#a98549"
                opacity={0.5}
              />
            );
          })}
      </svg>
      <div className={styles.waxProgress}>
        <span>Carve</span>
        <div
          className={styles.waxTrack}
          style={
            { "--p": `${Math.round(progress * 100)}%` } as React.CSSProperties
          }
        />
        <span>{Math.round(progress * 100)}%</span>
      </div>
      <div className={styles.artTag}>
        <span className={styles.tagDot} />
        Drag horizontally to carve
      </div>
    </div>
  );
}

export function StagePour() {
  const [pouring, setPouring] = useState(false);
  const [fill, setFill] = useState(0);
  const [heat, setHeat] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      setHeat((h) => {
        const target = pouring ? 1 : 0;
        return h + (target - h) * Math.min(1, dt * 3);
      });
      if (pouring) {
        setFill((f) => Math.min(1, f + dt * 0.32));
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pouring]);

  const start = () => setPouring(true);
  const stop = () => setPouring(false);

  return (
    <div
      className={styles.stageArt}
      style={{ cursor: "pointer" }}
      onMouseDown={start}
      onMouseUp={stop}
      onMouseLeave={stop}
      onTouchStart={(e) => {
        e.preventDefault();
        start();
      }}
      onTouchEnd={stop}
    >
      <div className={`${styles.artCorner} ${styles.tl}`} />
      <div className={`${styles.artCorner} ${styles.tr}`} />
      <div className={`${styles.artCorner} ${styles.bl}`} />
      <div className={`${styles.artCorner} ${styles.br}`} />
      <div className={styles.artFrame} />

      <svg
        viewBox="0 0 400 500"
        style={{ position: "absolute", inset: 0 }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="cruc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a2a1f" />
            <stop offset="100%" stopColor="#1c130d" />
          </linearGradient>
          <radialGradient id="moltenGlow">
            <stop offset="0%" stopColor="#f6c66a" />
            <stop offset="60%" stopColor="#d8b070" stopOpacity=".6" />
            <stop offset="100%" stopColor="#d8b070" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g
          style={{
            transformOrigin: "130px 100px",
            transform: pouring ? "rotate(28deg)" : "rotate(0deg)",
            transition: "transform .35s cubic-bezier(.5,0,.4,1.2)",
          }}
        >
          <path d="M 70 60 L 190 60 L 175 130 L 85 130 Z" fill="url(#cruc)" />
          <ellipse cx="130" cy="60" rx="60" ry="10" fill="#0a0604" />
          <ellipse
            cx="130"
            cy="64"
            rx="54"
            ry="6"
            fill="#f6c66a"
            opacity={pouring ? 1 : 0.7}
          />
          <ellipse cx="130" cy="64" rx="54" ry="6" fill="url(#moltenGlow)" />
          <line
            x1="190"
            y1="60"
            x2="220"
            y2="50"
            stroke="#1c130d"
            strokeWidth="2"
          />
        </g>

        {pouring && (
          <g>
            <path
              d={`M 200 110 Q 198 150 200 ${190 + fill * 180}`}
              stroke="#f6c66a"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              opacity=".95"
            />
            <path
              d={`M 200 110 Q 198 150 200 ${190 + fill * 180}`}
              stroke="#fff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              opacity=".5"
            />
          </g>
        )}

        <g>
          <rect x="120" y="370" width="160" height="80" fill="#3a2a1f" />
          <rect x="120" y="370" width="160" height="6" fill="#1c130d" />
          <defs>
            <clipPath id="moldCav">
              <path d="M 200 380 C 235 380 250 410 250 432 C 250 446 230 450 200 450 C 170 450 150 446 150 432 C 150 410 165 380 200 380 Z" />
            </clipPath>
          </defs>
          <path
            d="M 200 380 C 235 380 250 410 250 432 C 250 446 230 450 200 450 C 170 450 150 446 150 432 C 150 410 165 380 200 380 Z"
            fill="#0a0604"
          />
          <g clipPath="url(#moldCav)">
            <rect
              x="150"
              y={450 - fill * 70}
              width="100"
              height={fill * 70}
              fill="url(#moltenGlow)"
            />
            <rect
              x="150"
              y={450 - fill * 70}
              width="100"
              height={fill * 70}
              fill="#f6c66a"
              opacity=".85"
            />
            <rect
              x="150"
              y={450 - fill * 70 - 2}
              width="100"
              height="3"
              fill="#fff"
              opacity={pouring ? 0.7 : 0}
            />
          </g>
          {pouring && (
            <ellipse
              cx="200"
              cy="370"
              rx="80"
              ry="16"
              fill="url(#moltenGlow)"
              opacity=".7"
            />
          )}
        </g>
      </svg>

      <div className={styles.heatMeter}>
        <div>Crucible &middot; 1064&deg;C</div>
        <div
          className={styles.heatBar}
          style={{ "--h": `${Math.round(heat * 100)}%` } as React.CSSProperties}
        />
      </div>

      <div className={styles.artTag}>
        <span className={styles.tagDot} />
        {fill >= 1
          ? "Cast complete"
          : pouring
            ? "Pouring molten gold\u2026"
            : "Press and hold to pour"}
      </div>
    </div>
  );
}

export function StageStone() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const [placed, setPlaced] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [lit, setLit] = useState(false);
  const target = { x: 0.5, y: 0.42, r: 32 };

  const onDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (placed) return;
    setDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const c = "touches" in e ? e.touches[0] : e;
      if (!ref.current || !c) return;
      const r = ref.current.getBoundingClientRect();
      const x = c.clientX - r.left - 27;
      const y = c.clientY - r.top - 27;
      setPos({
        x: Math.max(4, Math.min(r.width - 58, x)),
        y: Math.max(4, Math.min(r.height - 58, y)),
      });
    };
    const onUp = () => {
      setDragging(false);
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const cx = pos.x + 27;
      const cy = pos.y + 27;
      const tx = target.x * r.width;
      const ty = target.y * r.height;
      const dist = Math.hypot(cx - tx, cy - ty);
      if (dist < target.r) {
        setPlaced(true);
        setPos({ x: tx - 27, y: ty - 27 });
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, pos]);

  useEffect(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = pos.x + 27;
    const cy = pos.y + 27;
    const tx = target.x * r.width;
    const ty = target.y * r.height;
    setLit(Math.hypot(cx - tx, cy - ty) < target.r + 12);
  }, [pos]);

  return (
    <div className={styles.stageArt} ref={ref}>
      <div className={`${styles.artCorner} ${styles.tl}`} />
      <div className={`${styles.artCorner} ${styles.tr}`} />
      <div className={`${styles.artCorner} ${styles.bl}`} />
      <div className={`${styles.artCorner} ${styles.br}`} />
      <div className={styles.artFrame} />

      <svg
        viewBox="0 0 400 500"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "absolute", inset: 0, zIndex: 1 }}
      >
        <defs>
          <radialGradient id="goldBezel">
            <stop offset="0%" stopColor="#f6c66a" />
            <stop offset="60%" stopColor="#b48953" />
            <stop offset="100%" stopColor="#7a5a36" />
          </radialGradient>
        </defs>
        <path
          d="M 200 120 C 270 120 300 190 300 260 C 300 330 260 370 200 370 C 140 370 100 330 100 260 C 100 190 130 120 200 120 Z"
          fill="url(#goldBezel)"
          stroke="#7a5a36"
          strokeWidth="0.8"
        />
        <ellipse
          cx="200"
          cy="200"
          rx="44"
          ry="44"
          fill="#1c130d"
          opacity=".3"
        />
        <ellipse cx="200" cy="200" rx="40" ry="40" fill="#0a0604" />
        <circle
          cx="200"
          cy="155"
          r="9"
          fill="none"
          stroke="#7a5a36"
          strokeWidth="1.6"
        />
        {[0, 1, 2, 3].map((i) => {
          const a = -Math.PI / 2 + (i * Math.PI) / 2;
          return (
            <line
              key={i}
              x1={200 + Math.cos(a) * 40}
              y1={200 + Math.sin(a) * 40}
              x2={200 + Math.cos(a) * 52}
              y2={200 + Math.sin(a) * 52}
              stroke="#7a5a36"
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {!placed && (
        <div
          className={`${styles.gemTarget} ${lit ? styles.gemTargetLit : ""}`}
          style={{
            left: `calc(${target.x * 100}% - 32px)`,
            top: `calc(${target.y * 100}% - 32px)`,
          }}
        >
          {lit ? "Set" : "Place"}
        </div>
      )}

      <div
        className={`${styles.gemPiece} ${placed ? styles.gemPlaced : ""}`}
        style={{ left: pos.x, top: pos.y }}
        onMouseDown={onDown}
        onTouchStart={onDown}
      >
        <svg viewBox="0 0 54 54" width="54" height="54">
          <defs>
            <radialGradient id="rubyG" cx="35%" cy="30%">
              <stop offset="0%" stopColor="#ff8a8a" />
              <stop offset="50%" stopColor="#c1413a" />
              <stop offset="100%" stopColor="#5a1410" />
            </radialGradient>
          </defs>
          <polygon
            points="27,3 50,20 42,48 12,48 4,20"
            fill="url(#rubyG)"
            stroke="#3a0a08"
            strokeWidth=".8"
          />
          <polygon points="27,3 50,20 27,28 4,20" fill="#fff" opacity=".18" />
          <polygon points="27,28 42,48 27,42 12,48" fill="#000" opacity=".15" />
        </svg>
      </div>

      <div className={styles.artTag}>
        <span className={styles.tagDot} />
        {placed
          ? "Stone set \u00B7 2.4 ct Burmese ruby"
          : "Drag the ruby into the bezel"}
      </div>
    </div>
  );
}

export function StageEngrave() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [traced, setTraced] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(800);

  useEffect(() => {
    if (pathRef.current) {
      setPathLen(pathRef.current.getTotalLength());
    }
  }, []);

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return;
    const c = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
    const svg = svgRef.current;
    if (!svg || !pathRef.current || !c) return;
    const rect = svg.getBoundingClientRect();
    const vx = ((c.clientX - rect.left) / rect.width) * 400;
    const vy = ((c.clientY - rect.top) / rect.height) * 500;
    const total = pathRef.current.getTotalLength();
    let best = traced * total;
    let bestDist = Infinity;
    const start = Math.max(0, best - 80);
    const end = Math.min(total, best + 80);
    for (let s = start; s <= end; s += 4) {
      const p = pathRef.current.getPointAtLength(s);
      const d = Math.hypot(p.x - vx, p.y - vy);
      if (d < bestDist) {
        bestDist = d;
        best = s;
      }
    }
    if (bestDist < 28) {
      const newProgress = best / total;
      if (newProgress > traced) {
        setTraced(newProgress);
      }
    }
  };

  return (
    <div
      className={styles.stageArt}
      style={{ cursor: drawing ? "crosshair" : "pointer" }}
    >
      <div className={`${styles.artCorner} ${styles.tl}`} />
      <div className={`${styles.artCorner} ${styles.tr}`} />
      <div className={`${styles.artCorner} ${styles.bl}`} />
      <div className={`${styles.artCorner} ${styles.br}`} />
      <div className={styles.artFrame} />
      <svg
        ref={svgRef}
        viewBox="0 0 400 500"
        style={{
          position: "absolute",
          inset: "14px",
          cursor: drawing ? "crosshair" : "pointer",
        }}
        preserveAspectRatio="xMidYMid meet"
        onMouseDown={() => setDrawing(true)}
        onMouseUp={() => setDrawing(false)}
        onMouseLeave={() => setDrawing(false)}
        onMouseMove={handleMove}
        onTouchStart={(e) => {
          e.preventDefault();
          setDrawing(true);
        }}
        onTouchEnd={() => setDrawing(false)}
        onTouchMove={(e) => {
          e.preventDefault();
          handleMove(e);
        }}
      >
        <defs>
          <linearGradient id="goldPanel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d8b070" />
            <stop offset="100%" stopColor="#a07042" />
          </linearGradient>
        </defs>
        <rect
          x="40"
          y="60"
          width="320"
          height="380"
          fill="url(#goldPanel)"
          stroke="#7a5a36"
          strokeWidth="0.8"
          rx="6"
        />
        {Array.from({ length: 120 }).map((_, i) => {
          const x = 50 + ((i * 37) % 310);
          const y = 70 + Math.floor((i * 37) / 310) * 14;
          return (
            <circle key={i} cx={x} cy={y} r="0.6" fill="#7a5a36" opacity=".4" />
          );
        })}
        <path
          className={styles.engraveGuide}
          strokeWidth="1"
          d="M 200 130 C 260 130 290 180 280 230 C 270 280 220 290 200 260 C 180 230 200 200 230 200 C 260 200 250 240 220 240 M 200 130 C 140 130 110 180 120 230 C 130 280 180 290 200 260 M 200 280 C 200 320 200 360 200 400"
        />
        <path
          ref={pathRef}
          className={styles.engraveTraced}
          strokeWidth="2"
          style={{
            strokeDasharray: pathLen,
            strokeDashoffset: pathLen * (1 - traced),
            transition: "stroke-dashoffset .12s ease-out",
          }}
          d="M 200 130 C 260 130 290 180 280 230 C 270 280 220 290 200 260 C 180 230 200 200 230 200 C 260 200 250 240 220 240"
        />
        {traced > 0.95 &&
          Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <g
                key={i}
                transform={`translate(${200 + Math.cos(a) * 60} ${230 + Math.sin(a) * 60})`}
              >
                <path
                  d="M 0 -6 L 1 -1 L 6 0 L 1 1 L 0 6 L -1 1 L -6 0 L -1 -1 Z"
                  fill="#fff"
                  opacity=".9"
                >
                  <animate
                    attributeName="opacity"
                    values=".2;1;.2"
                    dur="1.4s"
                    repeatCount="indefinite"
                    begin={`${i * 0.1}s`}
                  />
                </path>
              </g>
            );
          })}
      </svg>
      <div className={styles.artTag}>
        <span className={styles.tagDot} />
        {traced >= 0.99
          ? "Engraved \u00B7 14 hours of handwork"
          : drawing
            ? `Tracing \u00B7 ${Math.round(traced * 100)}%`
            : "Press and trace the dotted path"}
      </div>
    </div>
  );
}

export function StagePolish() {
  const ref = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(0.5);
  const [drag, setDrag] = useState(false);

  const onMove = (clientX: number) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setSplit(Math.max(0.04, Math.min(0.96, (clientX - r.left) / r.width)));
  };

  return (
    <div
      className={styles.stageArt}
      ref={ref}
      style={{ cursor: "ew-resize" }}
      onMouseDown={(e) => {
        setDrag(true);
        onMove(e.clientX);
      }}
      onMouseUp={() => setDrag(false)}
      onMouseLeave={() => setDrag(false)}
      onMouseMove={(e) => {
        if (drag) onMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setDrag(true);
        if (e.touches[0]) onMove(e.touches[0].clientX);
      }}
      onTouchEnd={() => setDrag(false)}
      onTouchMove={(e) => {
        if (drag && e.touches[0]) onMove(e.touches[0].clientX);
      }}
    >
      <div className={`${styles.artCorner} ${styles.tl}`} />
      <div className={`${styles.artCorner} ${styles.tr}`} />
      <div className={`${styles.artCorner} ${styles.bl}`} />
      <div className={`${styles.artCorner} ${styles.br}`} />
      <div className={styles.artFrame} />

      {/* Rough side */}
      <svg
        viewBox="0 0 400 500"
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 ${(1 - split) * 100}% 0 0)`,
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="roughG" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#a07042" />
            <stop offset="100%" stopColor="#5a3a1f" />
          </radialGradient>
          <pattern
            id="roughTex"
            width="3"
            height="3"
            patternUnits="userSpaceOnUse"
          >
            <rect width="3" height="3" fill="#8b6038" />
            <line
              x1="0"
              y1="0"
              x2="3"
              y2="3"
              stroke="#3a2410"
              strokeWidth=".6"
            />
          </pattern>
        </defs>
        <rect width="400" height="500" fill="#2a1c12" />
        <path
          d="M 200 120 C 270 120 300 190 300 260 C 300 330 260 370 200 370 C 140 370 100 330 100 260 C 100 190 130 120 200 120 Z"
          fill="url(#roughTex)"
        />
        <path
          d="M 200 120 C 270 120 300 190 300 260 C 300 330 260 370 200 370 C 140 370 100 330 100 260 C 100 190 130 120 200 120 Z"
          fill="url(#roughG)"
          opacity=".55"
        />
        {Array.from({ length: 18 }).map((_, i) => (
          <line
            key={i}
            x1={120 + i * 9}
            y1={140 + (i % 3) * 8}
            x2={130 + i * 9}
            y2={150 + (i % 3) * 8}
            stroke="#1c130d"
            strokeWidth=".6"
            opacity=".5"
          />
        ))}
        <circle
          cx="200"
          cy="155"
          r="9"
          fill="none"
          stroke="#3a2410"
          strokeWidth="2"
        />
      </svg>

      {/* Polished side */}
      <svg
        viewBox="0 0 400 500"
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 0 0 ${split * 100}%)`,
        }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="polishedG" cx="40%" cy="30%">
            <stop offset="0%" stopColor="#fde2a3" />
            <stop offset="40%" stopColor="#d8b070" />
            <stop offset="100%" stopColor="#7a5a36" />
          </radialGradient>
        </defs>
        <rect width="400" height="500" fill="#f7f0df" />
        <ellipse
          cx="200"
          cy="430"
          rx="100"
          ry="14"
          fill="#1c130d"
          opacity=".18"
        />
        <path
          d="M 200 120 C 270 120 300 190 300 260 C 300 330 260 370 200 370 C 140 370 100 330 100 260 C 100 190 130 120 200 120 Z"
          fill="url(#polishedG)"
          stroke="#7a5a36"
          strokeWidth=".8"
        />
        <ellipse cx="180" cy="180" rx="38" ry="80" fill="#fff" opacity=".4" />
        <ellipse
          cx="220"
          cy="320"
          rx="22"
          ry="40"
          fill="#1c130d"
          opacity=".2"
        />
        <circle
          cx="200"
          cy="155"
          r="9"
          fill="none"
          stroke="#7a5a36"
          strokeWidth="1.6"
        />
        <circle cx="200" cy="230" r="24" fill="#c1413a" opacity=".85" />
        <circle cx="192" cy="222" r="6" fill="#fff" opacity=".5" />
      </svg>

      {/* Slider handle */}
      <div
        className={styles.polishHandle}
        style={{ left: `${split * 100}%` }}
      />

      <div className={styles.polishLabelL}>Rough</div>
      <div className={styles.polishLabelR}>Polished</div>

      <div className={styles.artTag}>
        <span className={styles.tagDot} />
        Drag to compare
      </div>
    </div>
  );
}

export function FinalPiece() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 20;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -20;
    setTilt({ x, y });
  };

  return (
    <div
      className={styles.finalePiece}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform .15s ease-out",
          transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
        }}
      >
        <svg viewBox="0 0 400 400" style={{ width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id="finalGold" cx="40%" cy="30%">
              <stop offset="0%" stopColor="#fde2a3" />
              <stop offset="40%" stopColor="#d8b070" />
              <stop offset="100%" stopColor="#7a5a36" />
            </radialGradient>
            <radialGradient id="finalRuby" cx="35%" cy="30%">
              <stop offset="0%" stopColor="#ff8a8a" />
              <stop offset="50%" stopColor="#c1413a" />
              <stop offset="100%" stopColor="#5a1410" />
            </radialGradient>
          </defs>
          <ellipse
            cx="200"
            cy="360"
            rx="80"
            ry="12"
            fill="#1c130d"
            opacity=".2"
          />
          <path
            d="M 200 60 C 280 60 320 140 320 220 C 320 300 270 350 200 350 C 130 350 80 300 80 220 C 80 140 120 60 200 60 Z"
            fill="url(#finalGold)"
            stroke="#7a5a36"
            strokeWidth="0.8"
          />
          <ellipse
            cx="175"
            cy="140"
            rx="40"
            ry="90"
            fill="#fff"
            opacity=".35"
          />
          <ellipse
            cx="230"
            cy="280"
            rx="25"
            ry="50"
            fill="#1c130d"
            opacity=".18"
          />
          <circle
            cx="200"
            cy="190"
            r="28"
            fill="url(#finalRuby)"
            stroke="#5a1410"
            strokeWidth=".6"
          />
          <circle cx="190" cy="180" r="7" fill="#fff" opacity=".55" />
          <circle
            cx="200"
            cy="48"
            r="10"
            fill="none"
            stroke="#7a5a36"
            strokeWidth="1.8"
          />
          <path
            d="M 60 20 Q 200 80 340 20"
            fill="none"
            stroke="#7a5a36"
            strokeWidth="1"
          />
          {Array.from({ length: 16 }).map((_, i) => {
            const t = i / 15;
            const x = 60 + 280 * t;
            const y = 20 + Math.sin(t * Math.PI) * 60;
            return <circle key={i} cx={x} cy={y} r="2" fill="#b48953" />;
          })}
          <text
            x="200"
            y="390"
            textAnchor="middle"
            fontFamily="var(--font-dm-sans), sans-serif"
            fontSize="8"
            letterSpacing="2.5"
            fill="rgba(28,19,13,.5)"
          >
            QC &middot; 916 &middot; HANDCRAFTED
          </text>
        </svg>
      </div>
    </div>
  );
}
