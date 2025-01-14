import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "./components/Layout/Navbar";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Index from "./pages/Index";
import CreateQuiz from "./pages/CreateQuiz";
import EditQuiz from "./pages/EditQuiz";
import MyQuizzes from "./pages/MyQuizzes";
import QuizDetails from "./pages/QuizDetails";
import SolveQuiz from "./pages/SolveQuiz";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreateQuiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit/:id"
                element={
                  <ProtectedRoute>
                    <EditQuiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-quizzes"
                element={
                  <ProtectedRoute>
                    <MyQuizzes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/quiz/:id"
                element={
                  <ProtectedRoute>
                    <QuizDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/solve"
                element={
                  <ProtectedRoute>
                    <SolveQuiz />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;