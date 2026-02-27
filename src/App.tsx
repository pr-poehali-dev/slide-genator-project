import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/HomePage";
import GeneratorPage from "@/pages/GeneratorPage";
import HistoryPage from "@/pages/HistoryPage";
import InstructionPage from "@/pages/InstructionPage";
import NavBar from "@/components/NavBar";
import { Presentation } from "@/types";

export default function App() {
  const [page, setPage] = useState<"home" | "generator" | "history" | "instruction">("home");
  const [history, setHistory] = useState<Presentation[]>([]);

  const addToHistory = (pres: Presentation) => {
    setHistory(prev => [pres, ...prev]);
  };

  return (
    <div className="min-h-screen font-golos">
      <NavBar currentPage={page} onNavigate={setPage} />
      <main>
        {page === "home" && <HomePage onStart={() => setPage("generator")} />}
        {page === "generator" && <GeneratorPage onSave={addToHistory} />}
        {page === "history" && <HistoryPage history={history} />}
        {page === "instruction" && <InstructionPage />}
      </main>
      <Toaster />
    </div>
  );
}
