
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Apps from "./pages/Apps";
import Restaurant from "./pages/Restaurant";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import References from "./pages/References";
import Booking from "./pages/Booking";
import NotFound from "./pages/NotFound";
import AIOrb from "./components/AIOrb";
import AgenticModeOverlay from "./components/AgenticModeOverlay";
import { useAgenticMode } from "./hooks/useAgenticMode";

const queryClient = new QueryClient();

// Navigation event listener component
const NavigationEventListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigationEvent = (event: CustomEvent) => {
      const { path } = event.detail;
      navigate(path);
    };

    window.addEventListener('navigate', handleNavigationEvent as EventListener);
    return () => {
      window.removeEventListener('navigate', handleNavigationEvent as EventListener);
    };
  }, [navigate]);

  return null;
};

// Global AI state management
const AIGlobalState = () => {
  useEffect(() => {
    // Check if AI was focused before navigation
    const wasFocused = sessionStorage.getItem('ai-orb-focused') === 'true';
    
    if (wasFocused) {
      // Restore focus to AI orb after page load
      setTimeout(() => {
        const aiButton = document.getElementById('ai-orb-button');
        if (aiButton) {
          // Trigger focus state in keyboard navigation
          window.dispatchEvent(new CustomEvent('focus-ai-orb'));
        }
      }, 100);
    }

    // Listen for AI focus changes
    const handleAIFocus = () => {
      sessionStorage.setItem('ai-orb-focused', 'true');
    };

    const handleAIBlur = () => {
      sessionStorage.setItem('ai-orb-focused', 'false');
    };

    window.addEventListener('ai-orb-focus', handleAIFocus);
    window.addEventListener('ai-orb-blur', handleAIBlur);
    
    return () => {
      window.removeEventListener('ai-orb-focus', handleAIFocus);
      window.removeEventListener('ai-orb-blur', handleAIBlur);
    };
  }, []);

  return null;
};

const App = () => {
  const agenticMode = useAgenticMode();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <NavigationEventListener />
          <AIGlobalState />
          <main className="min-h-screen bg-black">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/apps" element={<Apps />} />
              <Route path="/restaurant" element={<Restaurant />} />
              <Route path="/services" element={<Services />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/references" element={<References />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            

            {/* Agentic Mode Overlay */}
            <AgenticModeOverlay
              isOpen={agenticMode.isOpen}
              onClose={agenticMode.closeAgenticMode}
              task={agenticMode.task}
              contentType={agenticMode.contentType}
            />
          </main>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
