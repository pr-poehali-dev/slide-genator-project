import pptxgen from "pptxgenjs";
import { Presentation, STYLE_COLORS } from "@/types";

function hex6(color: string): string {
  return color.replace("#", "").slice(0, 6).toUpperCase();
}

export async function exportToPptx(presentation: Presentation): Promise<void> {
  const pptx = new pptxgen();
  const colors = STYLE_COLORS[presentation.style];
  const bg = hex6(colors.bg);
  const accent = hex6(colors.accent);
  const textColor = hex6(colors.text);

  // Lighter text for subtitles — mix with white manually
  const textMuted = colors.text === "#ffffff" ? "AAAAAA" : "555555";

  pptx.layout = "LAYOUT_WIDE";
  pptx.title = presentation.title;
  pptx.author = "SlideAI";

  presentation.slides.forEach((slide, index) => {
    const pSlide = pptx.addSlide();
    pSlide.background = { color: bg };

    const isTitle = index === 0 || slide.layout === "title";

    if (isTitle) {
      // Accent line across middle
      pSlide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 2.6, w: "100%", h: 0.06,
        fill: { color: accent },
        line: { color: accent, width: 0 },
      });

      pSlide.addText(slide.emoji || "🎯", {
        x: 3.5, y: 0.5, w: 6.5, h: 1,
        fontSize: 36, align: "center",
      });

      pSlide.addText(slide.title, {
        x: 0.5, y: 1.4, w: 12.5, h: 1.4,
        fontSize: 34, bold: true, color: textColor,
        align: "center", fontFace: "Arial",
      });

      const firstLine = slide.content.split("\n")[0]?.replace(/^[•\-*]\s*/, "") || "";
      if (firstLine) {
        pSlide.addText(firstLine, {
          x: 1, y: 3.0, w: 11.5, h: 0.9,
          fontSize: 17, color: textMuted,
          align: "center", fontFace: "Arial",
        });
      }

      pSlide.addText(`${index + 1} / ${presentation.slides.length}`, {
        x: 0.3, y: 5.1, w: 13, h: 0.4,
        fontSize: 9, color: textMuted,
        align: "right", fontFace: "Arial",
      });
    } else {
      // Side accent bar
      pSlide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 0.12, h: "100%",
        fill: { color: accent },
        line: { color: accent, width: 0 },
      });

      pSlide.addText(slide.emoji || "", {
        x: 0.3, y: 0.25, w: 0.8, h: 0.6,
        fontSize: 20,
      });

      pSlide.addText(slide.title, {
        x: 0.3, y: 0.65, w: 12.8, h: 0.85,
        fontSize: 26, bold: true, color: textColor,
        fontFace: "Arial",
      });

      // Divider line
      pSlide.addShape(pptx.ShapeType.rect, {
        x: 0.3, y: 1.55, w: 12.8, h: 0.04,
        fill: { color: accent },
        line: { color: accent, width: 0 },
      });

      const bulletLines = slide.content
        .split("\n")
        .filter(l => l.trim())
        .map(l => l.replace(/^[•\-*]\s*/, "").trim())
        .filter(Boolean);

      if (bulletLines.length > 0) {
        pSlide.addText(
          bulletLines.map(l => ({ text: l, options: { bullet: { type: "bullet" } } })),
          {
            x: 0.5, y: 1.75, w: 12.6, h: 3.5,
            fontSize: 16, color: textColor,
            fontFace: "Arial", lineSpacingMultiple: 1.6,
          }
        );
      }

      pSlide.addText(`${index + 1} / ${presentation.slides.length}`, {
        x: 0.3, y: 5.1, w: 13, h: 0.4,
        fontSize: 9, color: textMuted,
        align: "right", fontFace: "Arial",
      });
    }
  });

  const filename = `${presentation.title.replace(/[^а-яёa-z0-9\s]/gi, "").replace(/\s+/g, "_") || "presentation"}.pptx`;
  await pptx.writeFile({ fileName: filename });
}
