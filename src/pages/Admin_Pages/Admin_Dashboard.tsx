import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, Menu, Search, User, X, TrendingUp, Users, Bookmark, GraduationCap, BarChart3, PieChart, Activity, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import Sidebar from "@/components/Sidebar";
import student from "@/assets/home1.png";
import { useNavigate } from "react-router-dom";

import StudentService from "../../services/Admin_Service/Student_service";
import CourseService from "@/services/Admin_Service/Subject_service";
import SubjectService from "@/services/Admin_Service/Subject_service";
import { Link } from "react-router-dom";
import AdminService from "../../services/Admin_Service/admin_service";

const Admin_Dashboard = () => {
  // Set initial sidebar state based on screen size
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Student data state
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  //course data
  const [course, setCourse] = useState([]);

  // Dashboard data state
  const [dashboardData, setDashboardData] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [adminData, setAdminData] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);

  // Color palette for charts
  const chartColors = ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#f3f4f6'];

  // Helper function to truncate long strings
  const truncateString = (str, maxLength = 13) => {
    if (!str) return '';
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await AdminService.getAdminDashboard();
        setDashboardData(response.data || response);
        setDashboardLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setDashboardError(err.message || "Failed to load dashboard data");
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Add this useEffect to fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const adminEmail = localStorage.getItem("adminEmail");
        if (adminEmail) {
          const response = await AdminService.getAdminByEmail(adminEmail);
          setAdminData(response.data || response);
        }
        setAdminLoading(false);
      } catch (err) {
        console.error("Error fetching admin data:", err);
        setAdminLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = () => {
    navigate("/admin_login");
  };

  // Fetch students from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await StudentService.getAllStudents();
        setStudents(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Error fetching students");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await SubjectService.getAllSubjects();
        setCourse(response.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Error fetching courses");
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Update screen size state and handle sidebar visibility
  useEffect(() => {
    const checkScreenSize = () => {
      const isLarge = window.innerWidth >= 768;
      setIsLargeScreen(isLarge);
      setSidebarOpen(isLarge);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Prepare chart data
  const getBarChartData = (chartData) => {
    if (!chartData) return [];
    return chartData.labels?.map((label, index) => ({
      name: truncateString(label),
      value: chartData.data?.[index] || 0,
      fullName: label
    })) || [];
  };

  const getPieChartData = (chartData) => {
    if (!chartData?.data) return [];
    return chartData.data.map(item => ({
      name: truncateString(item.name),
      value: item.value,
      fullName: item.name
    }));
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{payload[0].payload?.fullName || label}</p>
          <p className="text-blue-600">
            <span className="font-medium">Value: </span>
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Stats card definitions
  const statsCards = [
    {
      key: 'students',
      title: 'Total Students',
      count: dashboardData?.counts?.students || 0,
      secondary: `${dashboardData?.stats?.activeStudents || 0} active`,
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-l-blue-500'
    },
    {
      key: 'subjects',
      title: 'Subjects',
      count: dashboardData?.counts?.subjects || 0,
      secondary: `${dashboardData?.stats?.visibleSubjects || 0} visible`,
      icon: BookOpen,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      borderColor: 'border-l-green-500'
    },
    {
      key: 'exams',
      title: 'Exams',
      count: dashboardData?.counts?.exams || 0,
      secondary: `${dashboardData?.stats?.publishedExams || 0} published`,
      icon: GraduationCap,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'border-l-purple-500'
    },
    {
      key: 'books',
      title: 'Library Books',
      count: dashboardData?.counts?.books || 0,
      secondary: `${dashboardData?.stats?.visibleBooks || 0} visible`,
      icon: Bookmark,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      borderColor: 'border-l-orange-500'
    },
    {
      key: 'admins',
      title: 'Admins',
      count: dashboardData?.counts?.admins || 0,
      icon: User,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      borderColor: 'border-l-red-500'
    },
    {
      key: 'topics',
      title: 'Topics',
      count: dashboardData?.counts?.topics || 0,
      icon: Activity,
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      borderColor: 'border-l-indigo-500'
    },
    {
      key: 'recordedExams',
      title: 'Recorded Exams',
      count: dashboardData?.counts?.recordedExams || 0,
      icon: Calendar,
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      borderColor: 'border-l-teal-500'
    },
    {
      key: 'communities',
      title: 'Communities',
      count: dashboardData?.counts?.communities || 0,
      icon: Users,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      borderColor: 'border-l-amber-500'
    }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" className="absolute top-0 left-0">
          <defs>
            <pattern id="pattern" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 0 L25 25 M25 25 L50 0 M50 0 L75 25 M75 25 L100 0" strokeWidth="1" stroke="rgba(30, 58, 138, 0.1)" fill="transparent" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-900 text-white p-2 rounded-full shadow-lg hover:bg-blue-800 transition-colors"
        onClick={toggleSidebar}
      >
        {sidebarOpen && !isLargeScreen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div className={`${sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"} transition-all duration-300 ease-in-out fixed md:relative z-40 md:z-auto w-64`}>
        <Sidebar />
      </div>

      {/* Backdrop Overlay for Mobile */}
      {sidebarOpen && !isLargeScreen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={toggleSidebar} />
      )}

      {/* Main Content */}
      <div className="flex-1 w-full relative z-10">
        <div className="w-full min-h-screen p-4 md:p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0 mt-10 md:mt-0">
            <div>
              <h1 className="text-4xl font-bold text-blue-900 drop-shadow-sm">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
            </div>

            <div onClick={handleLogout} className="bg-blue-900 text-white rounded-lg py-3 px-6 flex items-center shadow-md hover:shadow-lg transition-all hover:bg-blue-800 cursor-pointer">
              <User className="h-5 w-5 mr-2" />
              <span className="font-medium">Logout</span>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardLoading ? (
              [...Array(8)].map((_, i) => (
                <Card key={i} className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : dashboardError ? (
              <Card className="col-span-full bg-red-50 border-red-200">
                <CardContent className="p-6 text-center">
                  <p className="text-red-600">Error loading dashboard data: {dashboardError}</p>
                </CardContent>
              </Card>
            ) : (
              statsCards.map((card) => (
                <Card key={card.key} className={`bg-white shadow-lg hover:shadow-xl transition-shadow border-0 border-l-4 ${card.borderColor}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                        <p className="text-3xl font-bold text-blue-900">{card.count}</p>
                        {card.secondary && (
                          <p className="text-green-600 text-sm mt-1">
                            {card.secondary}
                          </p>
                        )}
                      </div>
                      <div className={`${card.iconBg} p-3 rounded-full`}>
                        <card.icon className={`h-8 w-8 ${card.iconColor}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            {/* Bar Chart 1 */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-blue-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  {dashboardData?.charts?.barGraph1?.title || "Students by Education Level"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getBarChartData(dashboardData?.charts?.barGraph1)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Bar Chart 2 */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-blue-900 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  {dashboardData?.charts?.barGraph2?.title || "Exams by Subject"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getBarChartData(dashboardData?.charts?.barGraph2)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart 1 */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-blue-900 flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  {dashboardData?.charts?.pieChart1?.title || "Topics Distribution"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={getPieChartData(dashboardData?.charts?.pieChart1)}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {getPieChartData(dashboardData?.charts?.pieChart1).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart 2 */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-blue-900 flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  {dashboardData?.charts?.pieChart2?.title || "Library Books Distribution"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={getPieChartData(dashboardData?.charts?.pieChart2)}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {getPieChartData(dashboardData?.charts?.pieChart2).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Grid - Students and Courses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* All Students */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-blue-900 flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Recent Students
                  </div>
                  <Link to="/students" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    View All
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="text-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading students...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center p-8 text-red-500">
                      <p>Error: {error}</p>
                    </div>
                  ) : students.length > 0 ? (
                    students.slice(0, 8).map((student) => (
                      <div key={student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                        <div className="flex items-center">
                          <div className="bg-blue-900 rounded-full h-10 w-10 flex items-center justify-center mr-3">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {truncateString(`${student.firstName} ${student.lastName}`, 20)}
                            </p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          {student.educationLevel || 'N/A'}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No students found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* All Courses */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-blue-900 flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Available Subjects
                  </div>
                  <Link to="/courses" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    View All
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="text-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading courses...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center p-8 text-red-500">
                      <p>Error: {error}</p>
                    </div>
                  ) : course.length > 0 ? (
                    course.slice(0, 8).map((courseItem, index) => (
                      <div key={courseItem._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mr-3 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {truncateString(courseItem.subjectName || courseItem.name, 20)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {courseItem.topics || "Topics available"}
                            </p>
                          </div>
                        </div>
                        <Link to="/courses">
                          <Button size="sm" className="bg-blue-900 hover:bg-blue-800 text-white text-xs">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>No courses found</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_Dashboard;