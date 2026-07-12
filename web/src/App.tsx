import { HashRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { HomePage } from "./pages/HomePage";
import { EnHomePage } from "./pages/EnHomePage";
import { PricingPage } from "./pages/PricingPage";
import { DocsPage } from "./pages/DocsPage";
import { SkillsPage } from "./pages/SkillsPage";
import { EnterprisePage } from "./pages/EnterprisePage";
import { CodeSearchPage } from "./pages/CodeSearchPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SearchModal } from "./components/SearchModal";
import { ErrorBoundary } from "./components/ErrorBoundary";

function AppShell() {
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      } else if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [searchOpen]);
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<HomePage onSearchOpen={() => setSearchOpen(true)} />} />
        <Route path="/en" element={<EnHomePage onSearchOpen={() => setSearchOpen(true)} />} />
        <Route path="/pricing" element={<PricingPage onSearchOpen={() => setSearchOpen(true)} />} />
        <Route path="/docs" element={<DocsPage onSearchOpen={() => setSearchOpen(true)} />} />
        <Route path="/skills" element={<SkillsPage onSearchOpen={() => setSearchOpen(true)} />} />
        <Route path="/enterprise" element={<EnterprisePage onSearchOpen={() => setSearchOpen(true)} />} />
        <Route path="/code-search" element={<CodeSearchPage onSearchOpen={() => setSearchOpen(true)} />} />
        <Route path="*" element={<NotFoundPage onSearchOpen={() => setSearchOpen(true)} />} />
      </Routes>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </ErrorBoundary>
  );
}

function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  );
}

export default App;