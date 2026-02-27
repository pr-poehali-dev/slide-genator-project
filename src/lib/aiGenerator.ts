import { Slide, PresentationStyle } from "@/types";

const STYLE_PROMPTS: Record<PresentationStyle, string> = {
  corporate: "professional corporate business style, formal tone, structured content",
  creative: "creative colorful energetic style, engaging storytelling, dynamic content",
  minimal: "minimalist clean style, concise bullet points, whitespace focused",
  dark: "sleek dark modern tech style, bold statements, impactful data",
  gradient: "vibrant gradient modern style, trendy design language, bold typography",
  nature: "natural organic style, eco-friendly tone, calm and balanced content",
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
    const titleMatch = line.match(/^#+\s+(.+)$/) ||
      line.match(/^\*\*(.+)\*\*$/) ||
      line.match(/^SLIDE\s*\d*[:\-\s]+(.+)$/i) ||
      line.match(/^\d+\.\s+(.+)$/);

    if (titleMatch && titleMatch[1]) {
      if (currentSlide && currentSlide.title) {
        slides.push({
          id: crypto.randomUUID(),
          title: currentSlide.title,
          content: contentLines.join("\n").trim() || "Контент слайда",
          emoji: getRandomEmoji(),
          layout: slides.length === 0 ? "title" : "content",
        });
        contentLines = [];
      }
      currentSlide = { title: titleMatch[1].replace(/\*\*/g, "").trim() };
    } else if (currentSlide) {
      if (line.trim() && !line.match(/^---+$/)) {
        contentLines.push(line.trim().replace(/^\*\s+/, "• ").replace(/^-\s+/, "• "));
      }
    }
  }

  if (currentSlide && currentSlide.title) {
    slides.push({
      id: crypto.randomUUID(),
      title: currentSlide.title,
      content: contentLines.join("\n").trim() || "Контент слайда",
      emoji: getRandomEmoji(),
      layout: slides.length === 0 ? "title" : "content",
    });
  }

  if (slides.length === 0) {
    return generateFallbackSlides(count);
  }

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
    layout: i === 0 ? "title" : "content",
  }));
}

export async function generatePresentation(
  topic: string,
  slideCount: number,
  style: PresentationStyle
): Promise<Slide[]> {
  const styleHint = STYLE_PROMPTS[style];
  const prompt = `Create a ${slideCount}-slide presentation about "${topic}". Style: ${styleHint}.

Format EXACTLY like this (use ## for slide titles):
## Slide title here
Content bullet 1
Content bullet 2
Content bullet 3

## Next slide title
Content here

Generate exactly ${slideCount} slides. Write in Russian language. Each slide: 1 clear title + 3-5 content points.`;

  const encodedPrompt = encodeURIComponent(prompt);
  const url = `https://text.pollinations.ai/${encodedPrompt}?model=openai&seed=${Date.now()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("API error");
    const text = await res.text();
    const parsed = parseSlides(text, slideCount);
    if (parsed.length < slideCount) {
      const extra = generateFallbackSlides(slideCount - parsed.length);
      return [...parsed, ...extra];
    }
    return parsed;
  } catch {
    return generateFallbackSlides(slideCount);
  }
}
