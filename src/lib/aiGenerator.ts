import { Slide, PresentationStyle } from "@/types";

const STYLE_PROMPTS: Record<PresentationStyle, string> = {
  corporate: "деловой корпоративный стиль, официальный тон",
  creative: "творческий яркий стиль, вовлекающий нарратив",
  minimal: "минималистичный стиль, краткие тезисы",
  dark: "современный тёмный тех-стиль, броские заявления",
  gradient: "яркий градиентный современный стиль",
  nature: "природный органичный стиль, спокойный тон",
};

const SLIDE_EMOJIS = ["📌", "💡", "🎯", "📊", "🚀", "✅", "🔑", "📈", "💼", "🌟", "🔥", "⚡", "🎨", "🛠️", "📣"];

function getRandomEmoji(): string {
  return SLIDE_EMOJIS[Math.floor(Math.random() * SLIDE_EMOJIS.length)];
}

function parseSlides(text: string, count: number): Slide[] {
  const slides: Slide[] = [];
  const lines = text.split("\n").filter(l => l.trim());

  let currentSlide: Partial<Slide> | null = null;
  let contentLines: string[] = [];

  for (const line of lines) {
    const titleMatch =
      line.match(/^#{1,3}\s+(.+)$/) ||
      line.match(/^\*\*(.+)\*\*\s*$/) ||
      line.match(/^СЛАЙД\s*\d*[:\-\s]+(.+)$/i) ||
      line.match(/^Слайд\s*\d+[:\-\s]+(.+)$/i);

    if (titleMatch && titleMatch[1]) {
      if (currentSlide && currentSlide.title) {
        slides.push({
          id: crypto.randomUUID(),
          title: currentSlide.title,
          content: contentLines.join("\n").trim() || "• Ключевой тезис слайда",
          emoji: getRandomEmoji(),
          layout: slides.length === 0 ? "title" : "content",
        });
        contentLines = [];
      }
      currentSlide = { title: titleMatch[1].replace(/\*\*/g, "").trim() };
    } else if (currentSlide) {
      if (line.trim() && !line.match(/^---+$/)) {
        const clean = line.trim()
          .replace(/^\*\s+/, "• ")
          .replace(/^-\s+/, "• ")
          .replace(/^\d+\.\s+/, "• ");
        contentLines.push(clean);
      }
    }
  }

  if (currentSlide && currentSlide.title) {
    slides.push({
      id: crypto.randomUUID(),
      title: currentSlide.title,
      content: contentLines.join("\n").trim() || "• Ключевой тезис слайда",
      emoji: getRandomEmoji(),
      layout: slides.length === 0 ? "title" : "content",
    });
  }

  if (slides.length === 0) return generateFallbackSlides(count);
  return slides.slice(0, count);
}

function generateFallbackSlides(count: number): Slide[] {
  const titles = ["Введение", "Ключевые моменты", "Анализ", "Решение", "Результаты",
    "Преимущества", "Процесс", "Команда", "Перспективы", "Заключение"];
  return Array.from({ length: count }, (_, i) => ({
    id: crypto.randomUUID(),
    title: titles[i % titles.length],
    content: "• Ключевой тезис слайда\n• Дополнительная информация\n• Вывод или призыв к действию",
    emoji: getRandomEmoji(),
    layout: (i === 0 ? "title" : "content") as "title" | "content",
  }));
}

export async function generatePresentation(
  topic: string,
  slideCount: number,
  style: PresentationStyle
): Promise<Slide[]> {
  const styleHint = STYLE_PROMPTS[style];

  const prompt = `Создай презентацию на тему "${topic}" в стиле: ${styleHint}.
Ровно ${slideCount} слайдов на русском языке.
Формат строго такой (## перед каждым заголовком):

## Заголовок первого слайда
• Пункт 1
• Пункт 2
• Пункт 3

## Заголовок второго слайда
• Пункт 1
• Пункт 2
• Пункт 3

Каждый слайд: 1 заголовок + 3-5 пунктов. Никаких лишних слов кроме слайдов.`;

  try {
    // POST — чтобы не упираться в лимит длины URL
    const res = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        model: "openai",
        seed: Date.now(),
        private: true,
      }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    const parsed = parseSlides(text, slideCount);
    if (parsed.length < slideCount) {
      const extra = generateFallbackSlides(slideCount - parsed.length);
      return [...parsed, ...extra];
    }
    return parsed;
  } catch (e) {
    console.error("AI generation failed:", e);
    return generateFallbackSlides(slideCount);
  }
}
