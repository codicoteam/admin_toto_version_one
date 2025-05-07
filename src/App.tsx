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
import Dashboard from "./pages/dashboard/Dashboard";
import Courses from "./pages/dashboard/Courses";
import Lesson from "./pages/dashboard/Lesson";
import QA from "./pages/dashboard/QA";
import Wallet from "./pages/dashboard/Wallet";
import Layout from "./pages/dashboard/components/Layout";
import NotFound from "./pages/NotFound";
import Forgot_password from "./pages/auth/Forgot_Password";
import Auth_Layout from "./pages/auth/authLayout";
import Sms_Password_Reset from "./pages/auth/Sms_Password_Reset";
import Email_Password_Reset from "./pages/auth/Email_Password_Reset";
import Homepage from "./pages/welcome/Homepage";
import WelcomeLayout from "./pages/welcome/WelcomeLayout";
import About from "./pages/welcome/About";
import Contact from "./pages/welcome/Contact";
import CoursesHome from "./pages/welcome/CoursesHome";
import Pricing from "./pages/welcome/Pricing";
import Course from "./pages/dashboard/Course";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<WelcomeLayout />}>
              <Route path="/welcome" element={<Homepage />} />
              <Route path="/welcome/courses" element={<CoursesHome />} />
              <Route path="/welcome/about" element={<About />} />
              <Route path="/welcome/contact" element={<Contact />} />
              <Route path="/welcome/pricing" element={<Pricing />} />
            </Route>
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
              <Route path="/" index element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<Course />} />
              <Route path="/courses/:id/topic/:topicID" element={<Lesson />} />
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
