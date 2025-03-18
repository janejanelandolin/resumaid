
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ResumeProvider } from "./contexts/ResumeContext";

// Pages
import HomePage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import AnalysisPage from "./pages/AnalysisPage";
import PaymentPage from "./pages/PaymentPage";
import SuccessPage from "./pages/SuccessPage";
import EditResumePage from "./pages/EditResumePage";
import TemplateSelectionPage from "./pages/TemplateSelectionPage";
import DebugPage from "./pages/DebugPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ResumeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/edit-resume" element={<EditResumePage />} />
            <Route path="/templates" element={<TemplateSelectionPage />} />
            <Route path="/debug" element={<DebugPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ResumeProvider>
  </QueryClientProvider>
);

export default App;
