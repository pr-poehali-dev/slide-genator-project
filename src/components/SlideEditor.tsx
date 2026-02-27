import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Slide, PresentationStyle, STYLE_COLORS } from "@/types";

interface SlideEditorProps {
  slide: Slide;
  index: number;
  style: PresentationStyle;
  onUpdate: (updated: Partial<Slide>) => void;
  onDelete: () => void;
  canDelete: boolean;
}

const EMOJIS = ["📌", "💡", "🎯", "📊", "🚀", "✅", "🔑", "📈", "💼", "🌟", "🔥", "⚡", "🎨", "🛠️", "📣", "✨", "🏆", "💎", "🌍", "🔮"];

export default function SlideEditor({ slide, index, style, onUpdate, onDelete, canDelete }: SlideEditorProps) {
  const [editing, setEditing] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [localTitle, setLocalTitle] = useState(slide.title);
  const [localContent, setLocalContent] = useState(slide.content);

  const colors = STYLE_COLORS[style];

  const handleSave = () => {
    onUpdate({ title: localTitle, content: localContent });
    setEditing(false);
  };

  const handleCancel = () => {
    setLocalTitle(slide.title);
    setLocalContent(slide.content);
    setEditing(false);
  };

  return (
    <div
      className="slide-card rounded-2xl overflow-hidden group animate-fade-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Preview */}
      <div
        className="relative h-48 p-6 flex flex-col justify-between"
        style={{
          background: `linear-gradient(135deg, ${colors.bg}, ${colors.bg}dd)`,
          borderBottom: `3px solid ${colors.accent}`,
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-2xl hover:scale-110 transition-transform relative"
            >
              {slide.emoji}
            </button>
            {showEmojiPicker && (
              <div className="absolute top-16 left-4 z-10 glass-strong rounded-xl p-3 flex flex-wrap gap-1 w-52">
                {EMOJIS.map(e => (
                  <button
                    key={e}
                    onClick={() => { onUpdate({ emoji: e }); setShowEmojiPicker(false); }}
                    className="text-xl hover:scale-110 transition-transform p-1 rounded hover:bg-white/10"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${colors.accent}33`, color: colors.accent }}
            >
              #{index + 1}
            </span>
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/70 hover:text-white"
            >
              <Icon name="Edit2" size={14} />
            </button>
            {canDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors text-white/70 hover:text-red-400"
              >
                <Icon name="Trash2" size={14} />
              </button>
            )}
          </div>
        </div>

        <div>
          <h3
            className="font-montserrat font-bold text-lg leading-tight line-clamp-2"
            style={{ color: colors.text }}
          >
            {slide.title}
          </h3>
          <p
            className="text-sm mt-1 line-clamp-2 opacity-70"
            style={{ color: colors.text }}
          >
            {slide.content.split("\n")[0]?.replace(/^[•\-*]\s*/, "") || ""}
          </p>
        </div>
      </div>

      {/* Edit mode */}
      {editing && (
        <div className="p-4 bg-black/20 animate-fade-in">
          <input
            value={localTitle}
            onChange={e => setLocalTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm mb-3 focus:outline-none focus:border-neon-purple/50"
            placeholder="Заголовок слайда"
          />
          <textarea
            value={localContent}
            onChange={e => setLocalContent(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm h-28 resize-none focus:outline-none focus:border-neon-purple/50 scrollbar-thin"
            placeholder="Контент слайда (каждый пункт с новой строки)"
          />
          <div className="flex gap-2 mt-3 justify-end">
            <button
              onClick={handleCancel}
              className="px-4 py-1.5 rounded-lg text-white/60 hover:text-white text-sm transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              className="btn-gradient text-white px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1"
            >
              <Icon name="Check" size={14} />
              Сохранить
            </button>
          </div>
        </div>
      )}

      {/* Content preview (collapsed) */}
      {!editing && (
        <div className="p-4">
          <div className="space-y-1">
            {slide.content.split("\n").filter(l => l.trim()).slice(0, 3).map((line, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-white/60">
                <span className="text-neon-purple mt-0.5 shrink-0">•</span>
                <span className="line-clamp-1">{line.replace(/^[•\-*]\s*/, "")}</span>
              </div>
            ))}
            {slide.content.split("\n").filter(l => l.trim()).length > 3 && (
              <p className="text-white/30 text-xs pl-4">
                +{slide.content.split("\n").filter(l => l.trim()).length - 3} ещё
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
