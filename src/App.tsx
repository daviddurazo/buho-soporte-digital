
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import DashboardPage from "./pages/DashboardPage";
import AuthPage from "./pages/AuthPage";
import NewTicketPage from "./pages/NewTicketPage";
import TicketsPage from "./pages/TicketsPage";
import UsersPage from "./pages/UsersPage";
import ConfigPage from "./pages/ConfigPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";
import { useState } from "react";
import AssignedTicketsPage from "./pages/AssignedTicketsPage";
import SchedulePage from "./pages/SchedulePage";
import ProfilePage from "./pages/ProfilePage";
import UserSettingsPage from "./pages/UserSettingsPage";
import Index from "./pages/Index";

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/tickets/new" element={<NewTicketPage />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/tickets/assigned" element={<AssignedTicketsPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/config" element={<ConfigPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<UserSettingsPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
