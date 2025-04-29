import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

// Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Lesson from "./pages/Lesson";
import QA from "./pages/QA";
import Wallet from "./pages/Wallet";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import Forgot_password from "./pages/auth/Forgot_Password";
import Auth_Layout from "./pages/auth/authLayout";
import Sms_Password_Reset from "./pages/auth/Sms_Password_Reset";
import Email_Password_Reset from "./pages/auth/Email_Password_Reset";
import Homepage from "./pages/Homepage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route
              element={<Auth_Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot_password" element={<Forgot_password />} />
              <Route
                path="/sms_password_reset"
                element={<Sms_Password_Reset />}
              />
              <Route
                path="/email_password_reset"
                element={<Email_Password_Reset />}
              />
            </Route>

            {/* Protect routes using PrivateRoute */}
            <Route
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/lesson/:id" element={<Lesson />} />
              <Route path="/qa" element={<QA />} />
              <Route path="/wallet" element={<Wallet />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
