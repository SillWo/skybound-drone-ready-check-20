
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StandardChecklist from "./pages/StandardChecklist";
import RiskAnalysis from "./pages/RiskAnalysis";
import User from "./pages/User";
import ReportConstructor from "./pages/ReportConstructor";
import ReportHistory from "./pages/ReportHistory";
import NotFound from "./pages/NotFound";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StandardChecklist />} />
          <Route path="/user" element={<User />} />
          <Route path="/risk-analysis" element={<RiskAnalysis />} />
          <Route path="/report" element={<ReportConstructor />} />
          <Route path="/report-history" element={<ReportHistory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
