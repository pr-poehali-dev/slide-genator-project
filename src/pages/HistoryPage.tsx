import Icon from "@/components/ui/icon";
import { Presentation, STYLE_LABELS, STYLE_COLORS } from "@/types";
import { exportToPptx } from "@/lib/exportPptx";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface HistoryPageProps {
  history: Presentation[];
}

export default function HistoryPage({ history }: HistoryPageProps) {
  const { toast } = useToast();
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (pres: Presentation) => {
    setExporting(pres.id);
    try {
      await exportToPptx(pres);
      toast({ title: "Готово! 🎉", description: `«${pres.title}» скачана в PPTX` });
    } catch {
      toast({ title: "Ошибка", description: "Не удалось экспортировать", variant: "destructive" });
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="font-montserrat text-4xl font-black gradient-text mb-2">История</h1>
          <p className="text-white/50">Все созданные презентации в этой сессии</p>
        </div>

        {history.length === 0 ? (
          <div className="glass rounded-3xl p-16 text-center">
            <div className="text-6xl mb-6">📭</div>
            <h2 className="font-montserrat text-2xl font-bold text-white mb-3">Пока пусто</h2>
            <p className="text-white/50 text-lg">Создай свою первую презентацию в генераторе</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((pres) => {
              const colors = STYLE_COLORS[pres.style];
              return (
                <div
                  key={pres.id}
                  className="glass card-hover rounded-2xl p-6 flex items-center justify-between gap-4 flex-wrap"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: `linear-gradient(135deg, ${colors.bg}, ${colors.accent}33)`, border: `2px solid ${colors.accent}44` }}
                    >
                      {pres.slides[0]?.emoji || "🎯"}
                    </div>
                    <div>
                      <h3 className="font-montserrat font-bold text-white text-lg line-clamp-1">{pres.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-sm text-white/50">
                        <span className="flex items-center gap-1">
                          <Icon name="Layers" size={12} />
                          {pres.slides.length} слайдов
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{ background: `${colors.accent}22`, color: colors.accent }}
                        >
                          {STYLE_LABELS[pres.style]}
                        </span>
                        <span className="flex items-center gap-1">
                          <Icon name="Clock" size={12} />
                          {pres.createdAt.toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleExport(pres)}
                    disabled={exporting === pres.id}
                    className="btn-gradient text-white font-medium px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-50 shrink-0"
                  >
                    {exporting === pres.id ? (
                      <><Icon name="Loader2" size={14} className="animate-spin" />Экспорт...</>
                    ) : (
                      <><Icon name="Download" size={14} />Скачать PPTX</>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
