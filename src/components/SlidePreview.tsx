import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { Presentation, STYLE_COLORS } from "@/types";

interface SlidePreviewProps {
  presentation: Presentation;
  initialIndex?: number;
  onClose: () => void;
}

export default function SlidePreview({ presentation, initialIndex = 0, onClose }: SlidePreviewProps) {
  const [current, setCurrent] = useState(initialIndex);
  const slides = presentation.slides;
  const slide = slides[current];
  const colors = STYLE_COLORS[presentation.style];

  const prev = useCallback(() => setCurrent(i => Math.max(0, i - 1)), []);
  const next = useCallback(() => setCurrent(i => Math.min(slides.length - 1, i + 1)), [slides.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onClose]);

  const isTitle = current === 0 || slide.layout === "title";
  const bulletLines = slide.content.split("\n").filter(l => l.trim());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)" }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 glass text-white/70 hover:text-white p-2.5 rounded-xl transition-all hover:bg-white/10 z-10"
      >
        <Icon name="X" size={20} />
      </button>

      {/* Slide counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full text-sm text-white/60 z-10">
        {current + 1} / {slides.length}
      </div>

      {/* Thumbnails strip */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 max-w-2xl overflow-x-auto px-4">
        {slides.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrent(i)}
            className={`shrink-0 w-14 h-9 rounded-lg overflow-hidden border-2 transition-all ${
              i === current ? "border-neon-purple scale-110" : "border-white/20 hover:border-white/50"
            }`}
            style={{ background: colors.bg }}
          >
            <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: colors.text }}>
              {s.emoji}
            </div>
          </button>
        ))}
      </div>

      {/* Prev/Next */}
      <button
        onClick={prev}
        disabled={current === 0}
        className="absolute left-4 top-1/2 -translate-y-1/2 glass text-white/70 hover:text-white p-3 rounded-xl transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed z-10"
      >
        <Icon name="ChevronLeft" size={24} />
      </button>
      <button
        onClick={next}
        disabled={current === slides.length - 1}
        className="absolute right-4 top-1/2 -translate-y-1/2 glass text-white/70 hover:text-white p-3 rounded-xl transition-all hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed z-10"
      >
        <Icon name="ChevronRight" size={24} />
      </button>

      {/* Slide */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl animate-fade-in"
        style={{
          width: "min(860px, 90vw)",
          aspectRatio: "16/9",
          background: colors.bg,
          border: `3px solid ${colors.accent}44`,
          boxShadow: `0 0 80px ${colors.accent}33`,
        }}
      >
        {isTitle ? (
          /* Title layout */
          <div className="w-full h-full flex flex-col items-center justify-center px-12 relative">
            {/* Accent line */}
            <div
              className="absolute left-0 right-0"
              style={{ top: "55%", height: 3, background: colors.accent }}
            />
            <div className="relative z-10 text-center">
              <div className="text-5xl mb-4">{slide.emoji}</div>
              <h1
                className="font-montserrat font-black leading-tight mb-4"
                style={{ fontSize: "clamp(22px, 3.5vw, 42px)", color: colors.text }}
              >
                {slide.title}
              </h1>
              {bulletLines[0] && (
                <p
                  className="text-base opacity-70 max-w-lg mx-auto"
                  style={{ color: colors.text }}
                >
                  {bulletLines[0].replace(/^[•\-*]\s*/, "")}
                </p>
              )}
            </div>
            <div
              className="absolute bottom-3 right-4 text-xs opacity-40"
              style={{ color: colors.text }}
            >
              {current + 1} / {slides.length}
            </div>
          </div>
        ) : (
          /* Content layout */
          <div className="w-full h-full flex flex-col px-8 py-6 relative">
            {/* Left bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1.5"
              style={{ background: colors.accent }}
            />
            {/* Header */}
            <div className="flex items-center gap-3 mb-3 pl-2">
              <span className="text-2xl">{slide.emoji}</span>
              <h2
                className="font-montserrat font-bold leading-tight"
                style={{ fontSize: "clamp(16px, 2.5vw, 26px)", color: colors.text }}
              >
                {slide.title}
              </h2>
            </div>
            {/* Divider */}
            <div
              className="h-px mb-4 ml-2"
              style={{ background: `${colors.accent}66` }}
            />
            {/* Bullets */}
            <div className="flex-1 space-y-2 pl-2 overflow-hidden">
              {bulletLines.map((line, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span
                    className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full"
                    style={{ background: colors.accent, marginTop: "0.45em" }}
                  />
                  <span
                    className="leading-snug"
                    style={{ fontSize: "clamp(12px, 1.6vw, 17px)", color: colors.text, opacity: 0.9 }}
                  >
                    {line.replace(/^[•\-*]\s*/, "")}
                  </span>
                </div>
              ))}
            </div>
            <div
              className="absolute bottom-3 right-4 text-xs opacity-40"
              style={{ color: colors.text }}
            >
              {current + 1} / {slides.length}
            </div>
          </div>
        )}
      </div>

      {/* Keyboard hint */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/25 text-xs flex items-center gap-2">
        <Icon name="ArrowLeft" size={10} />
        <span>стрелки для навигации</span>
        <Icon name="ArrowRight" size={10} />
      </div>
    </div>
  );
}
