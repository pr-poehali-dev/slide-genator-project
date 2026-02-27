export interface Slide {
  id: string;
  title: string;
  content: string;
  emoji?: string;
  bgColor?: string;
  textColor?: string;
  layout?: "title" | "content" | "two-col" | "quote";
}

export interface Presentation {
  id: string;
  title: string;
  topic: string;
  style: PresentationStyle;
  slides: Slide[];
  createdAt: Date;
}

export type PresentationStyle =
  | "corporate"
  | "creative"
  | "minimal"
  | "dark"
  | "gradient"
  | "nature";

export const STYLE_LABELS: Record<PresentationStyle, string> = {
  corporate: "Корпоративный",
  creative: "Творческий",
  minimal: "Минимализм",
  dark: "Тёмный",
  gradient: "Градиент",
  nature: "Природа",
};

export const STYLE_COLORS: Record<PresentationStyle, { bg: string; accent: string; text: string }> = {
  corporate: { bg: "#1e3a5f", accent: "#2563eb", text: "#ffffff" },
  creative: { bg: "#7c3aed", accent: "#f59e0b", text: "#ffffff" },
  minimal: { bg: "#f8fafc", accent: "#0f172a", text: "#0f172a" },
  dark: { bg: "#0f172a", accent: "#a855f7", text: "#f1f5f9" },
  gradient: { bg: "#1e1b4b", accent: "#ec4899", text: "#ffffff" },
  nature: { bg: "#14532d", accent: "#22c55e", text: "#ffffff" },
};
