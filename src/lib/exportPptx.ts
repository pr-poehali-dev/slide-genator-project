import pptxgen from "pptxgenjs";
import { Presentation, STYLE_COLORS } from "@/types";

export async function exportToPptx(presentation: Presentation): Promise<void> {
  const pptx = new pptxgen();
  const colors = STYLE_COLORS[presentation.style];

  pptx.layout = "LAYOUT_WIDE";
  pptx.title = presentation.title;
  pptx.author = "SlideAI";

  presentation.slides.forEach((slide, index) => {
    const pSlide = pptx.addSlide();

    const bg = colors.bg.replace("#", "");
    pSlide.background = { color: bg };

    const isTitle = index === 0 || slide.layout === "title";

    if (isTitle) {
      // Title slide
      pSlide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: "100%", h: "100%",
        fill: { color: bg },
      });

      // Accent line
      const accent = colors.accent.replace("#", "");
      pSlide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 2.5, w: "100%", h: 0.05,
        fill: { color: accent },
        line: { color: accent, width: 0 },
      });

      pSlide.addText(slide.emoji || "🎯", {
        x: 3.5, y: 0.8, w: 6.5, h: 1,
        fontSize: 40, align: "center",
      });

      pSlide.addText(slide.title, {
        x: 0.5, y: 1.8, w: 12, h: 1.5,
        fontSize: 36, bold: true, color: colors.text.replace("#", ""),
        align: "center", fontFace: "Arial",
      });

      if (slide.content) {
        pSlide.addText(slide.content.split("\n")[0] || "", {
          x: 1, y: 3.4, w: 11, h: 1,
          fontSize: 18, color: colors.text.replace("#", "") + "CC",
          align: "center", fontFace: "Arial",
        });
      }

      pSlide.addText(`${index + 1} / ${presentation.slides.length}`, {
        x: 0, y: 5.1, w: "100%", h: 0.4,
        fontSize: 10, color: colors.text.replace("#", "") + "66",
        align: "right", fontFace: "Arial",
      });
    } else {
      // Content slide
      const accent = colors.accent.replace("#", "");

      pSlide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 0.1, h: "100%",
        fill: { color: accent },
        line: { color: accent, width: 0 },
      });

      pSlide.addText(slide.emoji || "", {
        x: 0.3, y: 0.3, w: 0.8, h: 0.6,
        fontSize: 20,
      });

      pSlide.addText(slide.title, {
        x: 0.3, y: 0.7, w: 12.2, h: 0.8,
        fontSize: 26, bold: true, color: colors.text.replace("#", ""),
        fontFace: "Arial",
      });

      pSlide.addShape(pptx.ShapeType.rect, {
        x: 0.3, y: 1.55, w: 12.2, h: 0.03,
        fill: { color: accent + "44" },
        line: { color: accent + "44", width: 0 },
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
            x: 0.5, y: 1.8, w: 12, h: 3.5,
            fontSize: 16, color: colors.text.replace("#", "") + "DD",
            fontFace: "Arial", lineSpacingMultiple: 1.5,
          }
        );
      }

      pSlide.addText(`${index + 1} / ${presentation.slides.length}`, {
        x: 0, y: 5.1, w: "100%", h: 0.4,
        fontSize: 10, color: colors.text.replace("#", "") + "66",
        align: "right", fontFace: "Arial",
      });
    }
  });

  const filename = `${presentation.title.replace(/[^а-яёa-z0-9\s]/gi, "").replace(/\s+/g, "_") || "presentation"}.pptx`;
  await pptx.writeFile({ fileName: filename });
}