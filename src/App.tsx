import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import "bootstrap/dist/css/bootstrap.min.css";

// Pages
import Login from "./pages/auth/user/Register";
import Register from "./pages/auth/user/Login";
// import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Lesson from "./pages/Lesson";
import QA from "./pages/QA";
import Wallet from "./pages/Wallet";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import Forgot_password from "./pages/auth/user/Forgot_Password";
import Sms_Password_Reset from "./pages/auth/user/Sms_Password_Reset";
import Email_Password_Reset from "./pages/auth/user/Email_Password_Reset";
import Admin_Dashboard from "./pages/Admin_Pages/Admin_Dashboard";
import Admin_Register from "./pages/auth/Admin/Register";
import Admin_login from "./pages/auth/Admin/Login";
import AdminCourses from "./pages/Admin_Pages/Courses";
import Homepage from "./pages/User_Pages/Hompage";
import Aboutpage from "./pages/User_Pages/Aboutpage";
import StudentDashboard from "./pages/Admin_Pages/Student";
import ChatApp from "./pages/Admin_Pages/Chat";
import ReserourceUpload from "./pages/Admin_Pages/Upload";
import Library from "./pages/Admin_Pages/Library";

import Navrbar from "./components/Navbar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          {" "}
          {/* Move AuthProvider inside BrowserRouter */}
          <Routes>
            <Route path="/admin_register" element={<Admin_Register />} />
            <Route path="/admin_login" element={<Admin_login />} />
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
            <Route path="/admin_dashboard" element={<Admin_Dashboard />} />
            <Route path="/students_dashboard" element={<StudentDashboard />} />
            <Route path="/chat" element={<ChatApp />} />
            <Route path="/library" element={<Library />} />
            <Route path="/reserourceupload" element={<ReserourceUpload />} />

            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/courses" element={<AdminCourses />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/aboutpage" element={<Aboutpage />} />

            <Route path="/navbar" element={<Navrbar />} />

            {/* Protect routes using PrivateRoute */}
            <Route
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route path="/" element={<Admin_Dashboard />} />
              <Route path="/user_courses" element={<Courses />} />
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
