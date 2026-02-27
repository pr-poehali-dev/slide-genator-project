import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Presentation, PresentationStyle, STYLE_LABELS, Slide } from "@/types";
import { generatePresentation } from "@/lib/aiGenerator";
import { exportToPptx } from "@/lib/exportPptx";
import { useToast } from "@/hooks/use-toast";
import SlideEditor from "@/components/SlideEditor";

interface GeneratorPageProps {
  onSave: (pres: Presentation) => void;
}

const STYLES: { id: PresentationStyle; emoji: string; accent: string }[] = [
  { id: "corporate", emoji: "🏢", accent: "#2563eb" },
  { id: "creative", emoji: "🎨", accent: "#7c3aed" },
  { id: "minimal", emoji: "⬜", accent: "#64748b" },
  { id: "dark", emoji: "🌙", accent: "#a855f7" },
  { id: "gradient", emoji: "🌈", accent: "#ec4899" },
  { id: "nature", emoji: "🌿", accent: "#22c55e" },
];

const SLIDE_COUNTS = [3, 5, 7, 10, 15, 20];

type Step = "form" | "generating" | "editor";

export default function GeneratorPage({ onSave }: GeneratorPageProps) {
  const [step, setStep] = useState<Step>("form");
  const [topic, setTopic] = useState("");
  const [slideCount, setSlideCount] = useState(7);
  const [style, setStyle] = useState<PresentationStyle>("gradient");
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [progress, setProgress] = useState(0);
  const [exporting, setExporting] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({ title: "Укажи тему", description: "Напиши о чём должна быть презентация", variant: "destructive" });
      return;
    }
    setStep("generating");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 12, 90));
    }, 400);

    try {
      const slides = await generatePresentation(topic, slideCount, style);
      clearInterval(interval);
      setProgress(100);

      const pres: Presentation = {
        id: crypto.randomUUID(),
        title: slides[0]?.title || topic,
        topic,
        style,
        slides,
        createdAt: new Date(),
      };
      setPresentation(pres);
      onSave(pres);

      setTimeout(() => setStep("editor"), 500);
    } catch {
      clearInterval(interval);
      setStep("form");
      toast({ title: "Ошибка генерации", description: "Попробуй ещё раз", variant: "destructive" });
    }
  };

  const handleExport = async () => {
    if (!presentation) return;
    setExporting(true);
    try {
      await exportToPptx(presentation);
      toast({ title: "Готово! 🎉", description: "Презентация скачана в формате PPTX" });
    } catch {
      toast({ title: "Ошибка экспорта", description: "Попробуй ещё раз", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const handleUpdateSlide = (id: string, updated: Partial<Slide>) => {
    if (!presentation) return;
    setPresentation({
      ...presentation,
      slides: presentation.slides.map(s => s.id === id ? { ...s, ...updated } : s),
    });
  };

  const handleAddSlide = () => {
    if (!presentation) return;
    const newSlide: Slide = {
      id: crypto.randomUUID(),
      title: "Новый слайд",
      content: "• Добавь свой контент здесь",
      emoji: "✨",
      layout: "content",
    };
    setPresentation({ ...presentation, slides: [...presentation.slides, newSlide] });
  };

  const handleDeleteSlide = (id: string) => {
    if (!presentation || presentation.slides.length <= 1) return;
    setPresentation({
      ...presentation,
      slides: presentation.slides.filter(s => s.id !== id),
    });
  };

  if (step === "generating") {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="w-32 h-32 rounded-full border-2 border-neon-purple/20 animate-spin-slow absolute inset-0"
              style={{ borderTopColor: "var(--neon-purple)" }} />
            <div className="w-24 h-24 rounded-full border-2 border-neon-cyan/20 animate-spin-slow absolute inset-4"
              style={{ borderTopColor: "var(--neon-cyan)", animationDirection: "reverse", animationDuration: "4s" }} />
            <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
              🧠
            </div>
          </div>
          <h2 className="font-montserrat text-2xl font-bold text-white mb-3">Генерирую презентацию...</h2>
          <p className="text-white/50 mb-8">ИИ создаёт контент по теме: <span className="text-neon-cyan">«{topic}»</span></p>
          <div className="glass rounded-full h-3 overflow-hidden">
            <div
              className="h-full btn-gradient rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/40 text-sm mt-3">{Math.round(progress)}%</p>
        </div>
      </div>
    );
  }

  if (step === "editor" && presentation) {
    return (
      <div className="pt-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <button
                onClick={() => { setStep("form"); setPresentation(null); }}
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm mb-2"
              >
                <Icon name="ArrowLeft" size={14} />
                Создать новую
              </button>
              <h1 className="font-montserrat text-2xl font-bold gradient-text">{presentation.title}</h1>
              <p className="text-white/50 text-sm mt-1">{presentation.slides.length} слайдов • {STYLE_LABELS[style]}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleAddSlide}
                className="glass text-white/80 font-medium px-4 py-2.5 rounded-xl text-sm hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Icon name="Plus" size={16} />
                Добавить слайд
              </button>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="btn-gradient text-white font-semibold px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {exporting ? (
                  <><Icon name="Loader2" size={16} className="animate-spin" />Экспорт...</>
                ) : (
                  <><Icon name="Download" size={16} />Скачать PPTX</>
                )}
              </button>
            </div>
          </div>

          {/* Slides grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {presentation.slides.map((slide, index) => (
              <SlideEditor
                key={slide.id}
                slide={slide}
                index={index}
                style={presentation.style}
                onUpdate={(updated) => handleUpdateSlide(slide.id, updated)}
                onDelete={() => handleDeleteSlide(slide.id)}
                canDelete={presentation.slides.length > 1}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Form step
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="font-montserrat text-4xl font-black gradient-text mb-3">Новая презентация</h1>
          <p className="text-white/50">Опиши тему — ИИ всё создаст за тебя</p>
        </div>

        <div className="space-y-8">
          {/* Topic */}
          <div className="glass rounded-2xl p-6">
            <label className="block text-white/80 font-medium mb-3 flex items-center gap-2">
              <Icon name="FileText" size={16} className="text-neon-purple" />
              Тема презентации
            </label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="Например: Маркетинговая стратегия компании на 2025 год"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 resize-none h-28 focus:outline-none focus:border-neon-purple/50 transition-colors"
              onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) handleGenerate(); }}
            />
            <p className="text-white/30 text-xs mt-2">Ctrl+Enter для генерации</p>
          </div>

          {/* Slide count */}
          <div className="glass rounded-2xl p-6">
            <label className="block text-white/80 font-medium mb-4 flex items-center gap-2">
              <Icon name="Layers" size={16} className="text-neon-cyan" />
              Количество слайдов
            </label>
            <div className="flex gap-3 flex-wrap">
              {SLIDE_COUNTS.map(count => (
                <button
                  key={count}
                  onClick={() => setSlideCount(count)}
                  className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                    slideCount === count
                      ? "btn-gradient text-white neon-glow-purple"
                      : "glass text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="glass rounded-2xl p-6">
            <label className="block text-white/80 font-medium mb-4 flex items-center gap-2">
              <Icon name="Palette" size={16} className="text-neon-pink" />
              Стиль оформления
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {STYLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`p-4 rounded-xl text-center transition-all ${
                    style === s.id
                      ? "glass-strong border-2"
                      : "glass hover:bg-white/10 border border-transparent"
                  }`}
                  style={style === s.id ? { borderColor: s.accent, boxShadow: `0 0 20px ${s.accent}33` } : {}}
                >
                  <div className="text-2xl mb-2">{s.emoji}</div>
                  <span className="text-sm font-medium text-white/80">{STYLE_LABELS[s.id]}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full btn-gradient text-white font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-3"
          >
            <Icon name="Wand2" size={22} />
            Создать презентацию
          </button>
        </div>
      </div>
    </div>
  );
}
