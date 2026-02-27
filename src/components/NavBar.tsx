import Icon from "@/components/ui/icon";

type Page = "home" | "generator" | "history" | "instruction";

interface NavBarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "generator", label: "Генератор", icon: "Sparkles" },
  { id: "history", label: "История", icon: "Clock" },
  { id: "instruction", label: "Инструкция", icon: "BookOpen" },
];

export default function NavBar({ currentPage, onNavigate }: NavBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-strong border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-lg btn-gradient flex items-center justify-center">
              <Icon name="Zap" size={16} className="text-white" />
            </div>
            <span className="font-montserrat font-800 text-lg gradient-text">
              SlideAI
            </span>
          </button>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                  ${currentPage === item.id
                    ? "glass neon-glow-purple text-neon-purple"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                <Icon name={item.icon} size={16} />
                <span className="hidden sm:block">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
