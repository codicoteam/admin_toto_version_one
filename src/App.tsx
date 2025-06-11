import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

// Pages

import Register from "./pages/auth/user/Login";
// import Dashboard from "./pages/Dashboard";
// import Courses from "./pages/Courses";
// import Lesson from "./pages/Lesson";
// import QA from "./pages/QA";
// import Wallet from "./pages/Wallet";
// import Layout from "./components/Layout";
// import NotFound from "./pages/NotFound";
// import Courses from "./pages/Courses";
// import Lesson from "./pages/Lesson";
// import QA from "./pages/QA";
// import Wallet from "./pages/Wallet";
// import Layout from "./components/Layout";
// import Admin_Dashboard from "./pages/Admin_Pages/Admin_Dashboard";
// import Admin_login from "./pages/auth/Admin/Login";
// import AdminSubjects from "./pages/Admin_Pages/Subjects";
// import Homepage from "./pages/User_Pages/Hompage";
import Aboutpage from "./pages/User_Pages/Aboutpage";
import StudentDashboard from "./pages/Admin_Pages/Student";
import ChatApp from "./pages/Admin_Pages/Chat";
import ReserourceUpload from "./pages/Admin_Pages/Upload";
import Library from "./pages/Admin_Pages/Library";
import SettingsPage from "./pages/Admin_Pages/Settings";
import CourseDetailPage from "./pages/Admin_Pages/Course_Details";

import Navrbar from "./components/Navbar";
// import Admin_Register from "./pages/auth/Admin/Register";
// import Email_Password_Reset from "./pages/auth/user/Email_Password_Reset";
import Forgot_password from "./pages/auth/user/Forgot_Password";
//  import Sms_Password_Reset from "./pages/auth/user/Sms_Password_Reset";
 import Email_Password_Reset from "./pages/auth/user/Email_Password_Reset";
import Admin_Dashboard from "./pages/Admin_Pages/Admin_Dashboard";
import Admin_Register from "./pages/auth/Admin/Register";
import Admin_login from "./pages/auth/Admin/Login";
import AdminCourses from "./pages/Admin_Pages/Subjects";
 import Login from "./pages/auth/user/Login";
// import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Courses from "./pages/dashboard/Courses";
import Lesson from "./pages/dashboard/Lesson";
import QA from "./pages/dashboard/QA";
import Wallet from "./pages/dashboard/Wallet";
import Layout from "./pages/dashboard/components/Layout";
// import NotFound from "./pages/NotFound";
// import Forgot_password from "./pages/auth/Forgot_Password";
import Auth_Layout from "./pages/auth/authLayout";
// import Sms_Password_Reset from "./pages/auth/Sms_Password_Reset";
// import Email_Password_Reset from "./pages/auth/Email_Password_Reset";
import Homepage from "./pages/welcome/Homepage";
import WelcomeLayout from "./pages/welcome/WelcomeLayout";
import About from "./pages/welcome/About";
import Contact from "./pages/welcome/Contact";
import CoursesHome from "./pages/welcome/CoursesHome";
import Pricing from "./pages/welcome/Pricing";
import Course from "./pages/dashboard/Course";
import Profile from "./pages/dashboard/user/Profile";
import Settings from "./pages/dashboard/user/Settings";
import Chat from "./pages/dashboard/Chat";
import Community from "./pages/dashboard/Community";

import Sms_Password_Reset from "./pages/auth/user/Sms_Password_Reset";

import NotFound from "./pages/NotFound";

import ReserourceWalle from "./pages/Walle";
import AdminSubjects from "./pages/Admin_Pages/Subjects";
import CreateNewContent from "./pages/Admin_Pages/CreateNewContent";
import EditContent from "./pages/Admin_Pages/editContent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
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

            <Route path="/reserourceupload" element={<ReserourceUpload />} />
            <Route path="/reserourcewalle" element={<ReserourceWalle />} />
            <Route path="/admin_dashboard" element={<Admin_Dashboard />} />
            <Route path="/students_dashboard" element={<StudentDashboard />} />
            <Route path="/chat" element={<ChatApp />} />
            <Route path="/library" element={<Library />} />
            <Route path="/reserourceupload" element={<ReserourceUpload />} />
            <Route path="/settingspage" element={<SettingsPage />} />
            <Route path="/admin/courses/:id" element={<CourseDetailPage />} />
              <Route path="courses/topics/:topicId/content/new" element={<CreateNewContent />} />
              <Route 
        path="/admin_dashboard/courses/topics/:topicId/content/edit/:contentId" 
        element={<EditContent />} 
      />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/courses" element={<AdminSubjects />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/aboutpage" element={<Aboutpage />} />

            <Route path="/navbar" element={<Navrbar />} />
            <Route path="/courses" element={<AdminCourses />} />
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
              <Route path="/" element={<Admin_Dashboard />} />
              <Route path="/user_courses" element={<Courses />} />
              <Route path="/lesson/:id" element={<Lesson />} />
              <Route path="/" index element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:id" element={<Community />} />
              <Route path="/courses/:id" element={<Course />} />
              <Route path="/courses/:id/topic/:topicID" element={<Lesson />} />
              <Route path="/qa" element={<QA />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/user/settings" element={<Settings />} />
              <Route path="/lessonaddtext" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
