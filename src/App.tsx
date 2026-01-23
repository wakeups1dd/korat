import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { URLProvider } from "@/contexts/URLContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Helper component to handle root redirection based on auth status
// We can't use useAuth directly in App because it's outside AuthProvider
// But we can use it in a child of AuthProvider
const RootRedirectHandler = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (location.pathname === "/" && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <URLProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/landing" element={<Index />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <RootRedirectHandler />
          </BrowserRouter>
        </TooltipProvider>
      </URLProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
