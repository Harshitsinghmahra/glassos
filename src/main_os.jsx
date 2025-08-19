import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AppWindow,
  NotebookPen,
  Music2,
  Image as ImageIcon,
  Calculator as CalcIcon,
  Settings as SettingsIcon,
  Info,
  Wifi,
  BatteryFull,
  Volume2,
  Search,
  X,
  Minus,
  Maximize2,
  Paintbrush,
  Moon,
  Sun,
  Check,
} from "lucide-react";

/**
 * GlassOS — a single-file, cute "web operating system" UI
 * Technologies: React + TailwindCSS + Framer Motion + lucide-react
 * Features:
 *  - Desktop with glass icons
 *  - Taskbar with Start, pinned apps, clock, quick toggles
 *  - Draggable, minimizable, maximizable windows (Framer Motion drag)
 *  - Simple apps: Notes, Music, Gallery, Calculator, Settings, About
 *  - Light/Dark theme toggle
 *  - Wallpaper chooser (with glass blur overlay)
 *  - Subtle animations and depth (z-index focus)
 */

// --- Helpers ---------------------------------------------------------------
const wallpapers = [
  {
    name: "Aurora",
    url:
      "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1920&auto=format&fit=crop",
  },
  {
    name: "Glass Wave",
    url:
      "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1920&auto=format&fit=crop",
  },
  {
    name: "Pastel City",
    url:
      "https://images.unsplash.com/photo-1520857014576-2c4f4c972b57?q=80&w=1920&auto=format&fit=crop",
  },
  {
    name: "Gradient Mesh",
    url:
      "https://images.unsplash.com/photo-1549880338-3281d14b2c6b?q=80&w=1920&auto=format&fit=crop",
  },
];

const appCatalog = {
  notes: { id: "notes", title: "Notes", icon: NotebookPen },
  music: { id: "music", title: "Music", icon: Music2 },
  gallery: { id: "gallery", title: "Gallery", icon: ImageIcon },
  calculator: { id: "calculator", title: "Calculator", icon: CalcIcon },
  settings: { id: "settings", title: "Settings", icon: SettingsIcon },
  about: { id: "about", title: "About GlassOS", icon: Info },
};

const defaultApps = ["notes", "music", "gallery", "calculator", "settings", "about"];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// --- Core Windowing --------------------------------------------------------
let idCounter = 1;
const newId = () => `${Date.now()}-${idCounter++}`;

function useZStack() {
  const [zOrder, setZOrder] = useState([]); // array of ids, last = top

  const bringToFront = (id) => {
    setZOrder((prev) => {
      const arr = prev.filter((x) => x !== id);
      arr.push(id);
      return arr;
    });
  };

  const topIndex = (id) => zOrder.indexOf(id);

  return { zOrder, bringToFront, topIndex };
}

// --- Apps ------------------------------------------------------------------
function NotesApp({ value, setValue }) {
  return (
    <div className="p-4 h-full">
      <textarea
        className="w-full h-full resize-none rounded-2xl p-4 bg-white/5 dark:bg-black/20 border border-white/20 outline-none backdrop-blur placeholder-white/60 dark:placeholder-white/40"
        placeholder="Yahan likho... cute thoughts, to-do, ya shayari ✨"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

function MusicApp() {
  const playlist = [
    { title: "Night Drive", artist: "Luna", length: "3:22" },
    { title: "Glass Skies", artist: "Aero", length: "2:58" },
    { title: "Soft Neon", artist: "Kite", length: "4:05" },
  ];
  const [current, setCurrent] = useState(0);
  return (
    <div className="p-4 h-full flex flex-col gap-4">
      <div className="rounded-2xl p-4 bg-white/5 dark:bg-black/20 border border-white/20 backdrop-blur">
        <div className="text-lg font-semibold">Now Playing</div>
        <div className="opacity-80">{playlist[current].title} — {playlist[current].artist}</div>
        <div className="mt-3 flex items-center gap-2">
          <button
            className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20"
            onClick={() => setCurrent((c) => (c - 1 + playlist.length) % playlist.length)}
          >Prev</button>
          <button className="px-3 py-1 rounded-xl bg-white/10">Play</button>
          <button
            className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20"
            onClick={() => setCurrent((c) => (c + 1) % playlist.length)}
          >Next</button>
        </div>
      </div>
      <div className="rounded-2xl p-3 bg-white/5 dark:bg-black/20 border border-white/20 backdrop-blur">
        <div className="text-sm opacity-80 mb-2">Playlist</div>
        <div className="grid gap-2">
          {playlist.map((t, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "flex justify-between rounded-xl px-3 py-2 hover:bg-white/10",
                i === current && "bg-white/15"
              )}
            >
              <span>{t.title} — {t.artist}</span>
              <span className="opacity-70">{t.length}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryApp() {
  const urls = [
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600",
    "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?w=600",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600",
    "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=600",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600",
  ];
  return (
    <div className="p-4 h-full overflow-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {urls.map((u, i) => (
          <img
            key={i}
            src={u}
            className="rounded-2xl border border-white/20 shadow-lg"
            alt={`photo-${i}`}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  );
}

function CalculatorApp() {
  const [expr, setExpr] = useState("");
  const press = (v) => setExpr((e) => e + v);
  const clear = () => setExpr("");
  const back = () => setExpr((e) => e.slice(0, -1));
  const evalSafe = () => {
    try {
      // simple safe eval using Function, numeric only
      // eslint-disable-next-line no-new-func
      const val = Function(`return (${expr})`)();
      setExpr(String(val ?? ""));
    } catch {}
  };
  const keys = [
    "7","8","9","/",
    "4","5","6","*",
    "1","2","3","-",
    "0",".","(",")",
  ];
  return (
    <div className="p-4 h-full flex flex-col gap-3">
      <input
        className="w-full rounded-2xl text-right text-2xl p-4 bg-white/5 dark:bg-black/20 border border-white/20 backdrop-blur"
        value={expr}
        onChange={(e) => setExpr(e.target.value)}
      />
      <div className="grid grid-cols-4 gap-2">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => press(k)}
            className="rounded-2xl py-3 bg-white/10 hover:bg-white/20"
          >{k}</button>
        ))}
        <button onClick={back} className="rounded-2xl py-3 bg-white/10 hover:bg-white/20 col-span-2">⌫</button>
        <button onClick={clear} className="rounded-2xl py-3 bg-white/10 hover:bg-white/20">C</button>
        <button onClick={evalSafe} className="rounded-2xl py-3 bg-white/10 hover:bg-white/20">=</button>
      </div>
    </div>
  );
}

function SettingsApp({ theme, setTheme, wallpaper, setWallpaper, glass, setGlass }) {
  return (
    <div className="p-4 h-full space-y-4">
      <div className="rounded-2xl p-4 bg-white/5 dark:bg-black/20 border border-white/20 backdrop-blur space-y-2">
        <div className="font-semibold flex items-center gap-2"><Paintbrush className="w-4 h-4"/>Appearance</div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme("light")}
            className={cn("px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 flex items-center gap-2", theme==='light' && "ring-2 ring-white/60")}
          ><Sun className="w-4 h-4"/> Light</button>
          <button
            onClick={() => setTheme("dark")}
            className={cn("px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 flex items-center gap-2", theme==='dark' && "ring-2 ring-white/60")}
          ><Moon className="w-4 h-4"/> Dark</button>
        </div>
        <div className="pt-2">
          <div className="text-sm opacity-80 mb-2">Wallpaper</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {wallpapers.map((w) => (
              <button key={w.name} onClick={() => setWallpaper(w)} className={cn("rounded-2xl overflow-hidden border border-white/20 hover:border-white/40", wallpaper.name===w.name && "ring-2 ring-white/60")}> 
                <img src={w.url} alt={w.name} className="h-24 w-full object-cover"/>
                <div className="p-2 text-sm opacity-90">{w.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl p-4 bg-white/5 dark:bg-black/20 border border-white/20 backdrop-blur space-y-2">
        <div className="font-semibold">Glass Intensity</div>
        <input
          type="range"
          min={4}
          max={28}
          value={glass}
          onChange={(e) => setGlass(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-sm opacity-80">backdrop-blur-{glass}</div>
      </div>
    </div>
  );
}

function AboutApp() {
  return (
    <div className="p-6 h-full">
      <div className="text-2xl font-semibold mb-2">GlassOS</div>
      <div className="opacity-80">A cute, glassy web desktop built with React + Tailwind + Framer Motion. ✨</div>
      <ul className="mt-4 list-disc pl-5 opacity-90 space-y-1">
        <li>Draggable windows with depth</li>
        <li>Taskbar, Start panel, quick toggles</li>
        <li>Light/Dark theme, wallpapers</li>
      </ul>
      <div className="mt-6 text-sm opacity-70">Tip: Drag windows by the titlebar, use the controls to minimize / maximize / close.</div>
    </div>
  );
}

// --- Window component ------------------------------------------------------
function Window({ id, title, icon: Icon, z, bringToFront, onClose, onMinimize, onMaximize, maximized, children, glass }) {
  return (
    <motion.div
      layout
      drag
      dragMomentum={false}
      onMouseDown={() => bringToFront(id)}
      className={cn(
        "absolute rounded-3xl border shadow-2xl",
        "bg-white/10 dark:bg-black/20 border-white/20",
        `backdrop-blur-${glass}`,
      )}
      style={{ zIndex: 100 + z, width: maximized ? "calc(100vw - 2rem)" : 680 }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <div className="cursor-grab active:cursor-grabbing select-none flex items-center justify-between px-4 py-2 border-b border-white/20 rounded-t-3xl bg-gradient-to-b from-white/20 to-white/10 dark:from-black/30 dark:to-black/20">
        <div className="flex items-center gap-2 py-1">
          <Icon className="w-4 h-4"/>
          <span className="font-medium tracking-wide">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onMinimize} className="p-1 rounded-xl hover:bg-white/20" title="Minimize"><Minus className="w-4 h-4"/></button>
          <button onClick={onMaximize} className="p-1 rounded-xl hover:bg-white/20" title="Maximize"><Maximize2 className="w-4 h-4"/></button>
          <button onClick={onClose} className="p-1 rounded-xl hover:bg-white/20" title="Close"><X className="w-4 h-4"/></button>
        </div>
      </div>
      <div className="rounded-b-3xl overflow-hidden" style={{ height: maximized ? "calc(100vh - 10rem)" : 420 }}>
        {children}
      </div>
    </motion.div>
  );
}

// --- Taskbar, Start, Quick Toggles ----------------------------------------
function StartMenu({ open, setOpen, launch }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute left-4 bottom-20 w-96 p-4 rounded-3xl border border-white/20 bg-white/10 dark:bg-black/30 backdrop-blur-2xl shadow-2xl"
        >
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/10 border border-white/20">
            <Search className="w-4 h-4 opacity-80"/>
            <input placeholder="Search apps" className="bg-transparent outline-none w-full"/>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {defaultApps.map((a) => {
              const A = appCatalog[a];
              const Icon = A.icon;
              return (
                <button
                  key={a}
                  onClick={() => { launch(a); setOpen(false); }}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/20"
                >
                  <Icon className="w-6 h-6"/>
                  <span className="text-sm opacity-90 text-center leading-tight">{A.title}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QuickTray() {
  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur">
      <Wifi className="w-4 h-4"/>
      <Volume2 className="w-4 h-4"/>
      <BatteryFull className="w-4 h-4"/>
    </div>
  );
}

function Taskbar({ startOpen, setStartOpen, opened, focus, launch, toggleMinimize, theme, setTheme }) {
  const timeString = useMemo(() => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), [opened.length, focus]);
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[min(980px,92vw)] flex items-center justify-between gap-3 px-3 py-2 rounded-3xl bg-white/10 dark:bg-black/30 backdrop-blur-2xl border border-white/20 shadow-2xl">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setStartOpen((v) => !v)}
          className="px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-2"
        >
          <AppWindow className="w-4 h-4"/>
          <span className="hidden sm:inline">Start</span>
        </button>
        <div className="hidden md:flex items-center gap-2">
          {defaultApps.map((a) => {
            const A = appCatalog[a];
            const Icon = A.icon;
            const open = opened.find((w) => w.app === a && !w.closed);
            return (
              <button
                key={a}
                onClick={() => open ? toggleMinimize(open.id) : launch(a)}
                title={A.title}
                className={cn("p-2 rounded-2xl border border-white/20 bg-white/5 hover:bg-white/15", open && "ring-2 ring-white/60")}
              >
                <Icon className="w-4 h-4"/>
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center gap-2"
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4"/> : <Moon className="w-4 h-4"/>}
        </button>
        <QuickTray />
        <div className="px-3 py-1.5 rounded-2xl bg-white/10 border border-white/20">{timeString}</div>
      </div>
    </div>
  );
}

// --- Main OS ---------------------------------------------------------------
export default function GlassOS() {
  const [theme, setTheme] = useState("dark");
  const [wallpaper, setWallpaper] = useState(wallpapers[0]);
  const [glass, setGlass] = useState(16); // Tailwind backdrop-blur-N
  const { zOrder, bringToFront, topIndex } = useZStack();
  const [startOpen, setStartOpen] = useState(false);
  const [windows, setWindows] = useState([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // center spawn position with slight offset
  const basePos = useRef({ x: 80, y: 80 });
  const nextPos = () => {
    basePos.current.x = (basePos.current.x + 32) % 240;
    basePos.current.y = (basePos.current.y + 24) % 200;
    return { x: 120 + basePos.current.x, y: 120 + basePos.current.y };
  };

  const launch = (appId) => {
    const app = appCatalog[appId];
    const { x, y } = nextPos();
    const id = newId();
    setWindows((prev) => [
      ...prev,
      { id, app: appId, title: app.title, minimized: false, maximized: false, closed: false, x, y },
    ]);
    bringToFront(id);
  };

  const close = (id) => setWindows((prev) => prev.map((w) => w.id === id ? { ...w, closed: true } : w));
  const minimize = (id) => setWindows((prev) => prev.map((w) => w.id === id ? { ...w, minimized: !w.minimized } : w));
  const maximize = (id) => setWindows((prev) => prev.map((w) => w.id === id ? { ...w, maximized: !w.maximized } : w));

  const desktopIcons = ["notes", "gallery", "music", "calculator", "settings", "about"]; 

  return (
    <div className="relative w-full h-screen overflow-hidden select-none">
      {/* Wallpaper */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${wallpaper.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(1.1)",
        }}
      />
      {/* Subtle vignette and gradient overlay */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_20%,rgba(255,255,255,0.25),rgba(0,0,0,0.35))]" />

      {/* Desktop icons */}
      <div className="grid gap-4 p-6 sm:p-8 max-w-[920px]" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))" }}>
        {desktopIcons.map((a) => {
          const A = appCatalog[a];
          const Icon = A.icon;
          return (
            <button
              key={a}
              onDoubleClick={() => launch(a)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-2xl text-shadow"
              title={`${A.title} (double-click)`}
            >
              <Icon className="w-7 h-7"/>
              <span className="text-sm text-center leading-tight drop-shadow">{A.title}</span>
            </button>
          );
        })}
      </div>

      {/* Windows */}
      {windows.map((w) => {
        if (w.closed) return null;
        const A = appCatalog[w.app];
        const Icon = A.icon;
        const z = topIndex(w.id);
        return (
          <AnimatePresence key={w.id}>
            {!w.minimized && (
              <Window
                id={w.id}
                title={w.title}
                icon={Icon}
                z={z}
                bringToFront={bringToFront}
                onClose={() => close(w.id)}
                onMinimize={() => minimize(w.id)}
                onMaximize={() => maximize(w.id)}
                maximized={w.maximized}
                glass={glass}
              >
                {w.app === "notes" && (
                  <NotesApp value={notes} setValue={setNotes} />
                )}
                {w.app === "music" && <MusicApp />}
                {w.app === "gallery" && <GalleryApp />}
                {w.app === "calculator" && <CalculatorApp />}
                {w.app === "settings" && (
                  <SettingsApp
                    theme={theme}
                    setTheme={setTheme}
                    wallpaper={wallpaper}
                    setWallpaper={setWallpaper}
                    glass={glass}
                    setGlass={setGlass}
                  />
                )}
                {w.app === "about" && <AboutApp />}
              </Window>
            )}
          </AnimatePresence>
        );
      })}

      {/* Taskbar & Panels */}
      <Taskbar
        startOpen={startOpen}
        setStartOpen={setStartOpen}
        opened={windows}
        focus={zOrder[zOrder.length - 1]}
        launch={launch}
        toggleMinimize={minimize}
        theme={theme}
        setTheme={setTheme}
      />
      <StartMenu open={startOpen} setOpen={setStartOpen} launch={launch} />

      {/* Credits badge */}
      <div className="fixed top-4 right-4 px-3 py-1.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-2xl shadow">
        <span className="opacity-90 text-sm">GlassOS • made with ❤️</span>
      </div>
    </div>
  );
}

/* Tailwind tips:
 * - Ensure Tailwind has utilities for backdrop-blur-[N]. If not, you can map `glass` to classNames manually.
 * - Add `dark` mode class on <html> is handled in useEffect.
 */
