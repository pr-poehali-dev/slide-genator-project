import Icon from "@/components/ui/icon";

const steps = [
  {
    num: "01",
    icon: "FileText",
    title: "Введи тему",
    desc: "Напиши тему своей презентации — можно коротко или развёрнуто. Чем точнее описание, тем лучше результат.",
    tip: "Пример: «Стратегия развития интернет-магазина на 2025 год»",
    color: "#a855f7",
  },
  {
    num: "02",
    icon: "Sliders",
    title: "Настрой параметры",
    desc: "Выбери количество слайдов (от 3 до 20) и стиль оформления под твою аудиторию и задачу.",
    tip: "Для деловых встреч — «Корпоративный», для творческих проектов — «Творческий» или «Градиент»",
    color: "#22d3ee",
  },
  {
    num: "03",
    icon: "Wand2",
    title: "Сгенерируй контент",
    desc: "Нажми «Создать презентацию». ИИ Pollinations AI бесплатно создаст структуру и контент всех слайдов.",
    tip: "Генерация занимает 10-30 секунд в зависимости от нагрузки",
    color: "#ec4899",
  },
  {
    num: "04",
    icon: "Edit3",
    title: "Отредактируй слайды",
    desc: "Наведи на любой слайд — появятся кнопки редактирования. Измени заголовок, контент или эмодзи.",
    tip: "Можно добавлять новые слайды и удалять ненужные",
    color: "#10b981",
  },
  {
    num: "05",
    icon: "Download",
    title: "Скачай PPTX",
    desc: "Нажми «Скачать PPTX» — файл загрузится на компьютер. Открой в PowerPoint или Google Slides.",
    tip: "Файл полностью совместим с Microsoft PowerPoint и Google Slides",
    color: "#f59e0b",
  },
];

const faq = [
  {
    q: "Это действительно бесплатно?",
    a: "Да, 100%. Мы используем Pollinations AI — бесплатный публичный API без ключей и регистрации.",
  },
  {
    q: "Файл можно открыть в PowerPoint?",
    a: "Да, формат .pptx полностью совместим с Microsoft PowerPoint 2010 и новее, а также с Google Slides.",
  },
  {
    q: "Сохраняются ли мои презентации?",
    a: "Презентации хранятся в памяти браузера во время сессии. При обновлении страницы история очищается.",
  },
  {
    q: "Можно добавить картинки в слайды?",
    a: "В текущей версии поддерживается текстовый контент с эмодзи. Поддержка изображений — в следующем обновлении.",
  },
];

export default function InstructionPage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-montserrat text-5xl font-black gradient-text mb-4">Инструкция</h1>
          <p className="text-white/50 text-lg max-w-lg mx-auto">
            Создай профессиональную презентацию за 5 простых шагов
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6 mb-20">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="glass card-hover rounded-2xl p-6 flex gap-6 items-start animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s`, borderLeft: `3px solid ${step.color}` }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 font-montserrat font-black text-lg"
                style={{ background: `${step.color}22`, color: step.color, border: `2px solid ${step.color}44` }}
              >
                {step.num}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Icon name={step.icon} size={18} style={{ color: step.color }} />
                  <h3 className="font-montserrat font-bold text-xl text-white">{step.title}</h3>
                </div>
                <p className="text-white/70 leading-relaxed mb-3">{step.desc}</p>
                <div
                  className="flex items-start gap-2 rounded-xl px-4 py-2.5 text-sm"
                  style={{ background: `${step.color}11`, border: `1px solid ${step.color}22` }}
                >
                  <Icon name="Lightbulb" size={14} style={{ color: step.color, marginTop: 2 }} />
                  <span style={{ color: `${step.color}cc` }}>{step.tip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div>
          <h2 className="font-montserrat text-3xl font-bold text-white mb-8 text-center">
            Частые вопросы
          </h2>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-6 animate-fade-in"
                style={{ animationDelay: `${0.5 + i * 0.1}s` }}
              >
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="text-neon-purple">?</span>
                  {item.q}
                </h4>
                <p className="text-white/60 leading-relaxed pl-5">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center glass rounded-2xl p-10" style={{ border: "1px solid rgba(168,85,247,0.2)" }}>
          <div className="text-4xl mb-4">✨</div>
          <h3 className="font-montserrat text-2xl font-bold text-white mb-3">Всё понятно?</h3>
          <p className="text-white/50 mb-6">Создай свою первую презентацию прямо сейчас</p>
        </div>
      </div>
    </div>
  );
}
