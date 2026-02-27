import Icon from "@/components/ui/icon";

interface HomePageProps {
  onStart: () => void;
}

const features = [
  {
    icon: "Brain",
    title: "ИИ без ключей",
    desc: "Используем бесплатный Pollinations AI — никаких регистраций и API-ключей",
    color: "from-purple-500/20 to-purple-500/5",
    accent: "text-neon-purple",
  },
  {
    icon: "Layers",
    title: "До 20 слайдов",
    desc: "Выбирай количество слайдов и стиль под свою задачу",
    color: "from-cyan-500/20 to-cyan-500/5",
    accent: "text-neon-cyan",
  },
  {
    icon: "Edit3",
    title: "Редактор слайдов",
    desc: "Дорабатывай содержимое прямо в браузере без лишних инструментов",
    color: "from-pink-500/20 to-pink-500/5",
    accent: "text-neon-pink",
  },
  {
    icon: "Download",
    title: "Экспорт в PPTX",
    desc: "Скачивай готовую презентацию в формате PowerPoint одним кликом",
    color: "from-green-500/20 to-green-500/5",
    accent: "text-neon-green",
  },
];

const styles = [
  { name: "Корпоративный", emoji: "🏢", color: "#2563eb" },
  { name: "Творческий", emoji: "🎨", color: "#7c3aed" },
  { name: "Минимализм", emoji: "⬜", color: "#64748b" },
  { name: "Тёмный", emoji: "🌙", color: "#a855f7" },
  { name: "Градиент", emoji: "🌈", color: "#ec4899" },
  { name: "Природа", emoji: "🌿", color: "#22c55e" },
];

export default function HomePage({ onStart }: HomePageProps) {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="dot-pattern absolute inset-0 opacity-40" />

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-pulse-slow"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.2) 0%, transparent 70%)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full animate-pulse-slow"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)", animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)" }} />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 animate-slide-up">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-neon-cyan mb-8">
            <Icon name="Sparkles" size={14} />
            <span>Бесплатно • Без регистрации • ИИ-генерация</span>
          </div>

          <h1 className="font-montserrat text-6xl md:text-8xl font-black mb-6 leading-none">
            <span className="gradient-text">Презентации</span>
            <br />
            <span className="text-white">за секунды</span>
          </h1>

          <p className="text-white/60 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Опиши тему — ИИ создаст структуру, контент и оформление.
            Отредактируй и скачай в&nbsp;PowerPoint.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onStart}
              className="btn-gradient text-white font-semibold px-10 py-4 rounded-2xl text-lg flex items-center gap-3 justify-center"
            >
              <Icon name="Wand2" size={20} />
              Создать презентацию
            </button>
            <button className="glass text-white/80 font-medium px-10 py-4 rounded-2xl text-lg hover:bg-white/10 transition-all flex items-center gap-3 justify-center">
              <Icon name="PlayCircle" size={20} />
              Смотреть пример
            </button>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8 text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <Icon name="CheckCircle" size={16} className="text-neon-green" />
              <span>5 000+ презентаций</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="CheckCircle" size={16} className="text-neon-green" />
              <span>6 стилей оформления</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="CheckCircle" size={16} className="text-neon-green" />
              <span>Экспорт PPTX за 1 клик</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-bounce">
          <span className="text-xs">Прокрути вниз</span>
          <Icon name="ChevronDown" size={16} />
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-montserrat text-4xl md:text-5xl font-bold text-white mb-4">
            Всё что нужно
          </h2>
          <p className="text-white/50 text-lg">в одном инструменте</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className={`glass card-hover rounded-2xl p-8 bg-gradient-to-br ${f.color}`}>
              <div className={`w-12 h-12 rounded-xl glass flex items-center justify-center mb-5 ${f.accent}`}>
                <Icon name={f.icon} size={24} />
              </div>
              <h3 className="font-montserrat font-bold text-xl text-white mb-3">{f.title}</h3>
              <p className="text-white/60 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Styles showcase */}
      <section className="py-24 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-montserrat text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-warm">6 стилей</span>
            <span className="text-white"> на выбор</span>
          </h2>
          <p className="text-white/50 text-lg">Под любую задачу и аудиторию</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {styles.map((s) => (
            <div
              key={s.name}
              className="glass card-hover rounded-2xl p-6 text-center cursor-pointer group"
            >
              <div
                className="w-full h-20 rounded-xl mb-4 flex items-center justify-center text-4xl"
                style={{ background: `linear-gradient(135deg, ${s.color}33, ${s.color}11)`, border: `1px solid ${s.color}44` }}
              >
                {s.emoji}
              </div>
              <span className="text-white/80 font-medium group-hover:text-white transition-colors">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center glass rounded-3xl p-16" style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(34,211,238,0.08))", border: "1px solid rgba(168,85,247,0.3)" }}>
          <div className="text-6xl mb-6">🚀</div>
          <h2 className="font-montserrat text-4xl font-bold text-white mb-4">
            Готов начать?
          </h2>
          <p className="text-white/60 text-lg mb-8">
            Создай первую презентацию прямо сейчас — это займёт меньше минуты
          </p>
          <button
            onClick={onStart}
            className="btn-gradient text-white font-semibold px-12 py-4 rounded-2xl text-lg flex items-center gap-3 mx-auto"
          >
            <Icon name="Wand2" size={20} />
            Создать презентацию
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-white/30 text-sm border-t border-white/5">
        <p>SlideAI — генератор презентаций на базе Pollinations AI</p>
      </footer>
    </div>
  );
}
