import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Validate from "./pages/Validate";
import Dashboard from "./pages/Dashboard";
import MainDashboard from "./pages/MainDashboard";
import IdeaAnalysis from "./pages/IdeaAnalysis";
import IdeaDetail from "./pages/IdeaDetail";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/validate" element={
              <ProtectedRoute>
                <Validate />
              </ProtectedRoute>
            } />
            {/* Main dashboard - shows all ideas */}
            <Route path="/main-dashboard" element={
              <ProtectedRoute>
                <MainDashboard />
              </ProtectedRoute>
            } />
            {/* Individual idea detail pages */}
            <Route path="/idea/:ideaId" element={
              <ProtectedRoute>
                <IdeaDetail />
              </ProtectedRoute>
            } />
            {/* New idea validation flow */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            {/* Legacy individual idea analysis pages */}
            <Route path="/dashboard/:slug" element={
              <ProtectedRoute>
                <IdeaAnalysis />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
