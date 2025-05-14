import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, Menu, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import student from "@/assets/home1.png";
import StudentService from "../../services/Admin_Service/Student_service";
import CourseService from "@/services/Admin_Service/Subject_service";
import SubjectService from "@/services/Admin_Service/Subject_service";

const Admin_Dashboard = () => {
  // Set initial sidebar state based on screen size
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Student data state
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //course data
  const [course, setCourse] = useState([]);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
    // Check initial screen size
    const checkScreenSize = () => {
      const isLarge = window.innerWidth >= 768;
      setIsLargeScreen(isLarge);
      setSidebarOpen(isLarge);
    };

    // Run on initial load
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Get top performing students (assuming higher performance means higher grades)
  const topPerformingStudents = students.slice(0, 5); // Get top 5 students

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          className="absolute top-0 left-0"
        >
          <defs>
            <pattern
              id="pattern"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 0 L25 25 M25 25 L50 0 M50 0 L75 25 M75 25 L100 0"
                strokeWidth="1"
                stroke="rgba(59, 130, 246, 0.1)"
                fill="transparent"
              />
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

      {/* Sidebar - Mobile: overlay, Desktop: static */}
      <div
        className={`
        ${
          sidebarOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        } 
        transition-all duration-300 ease-in-out 
        fixed md:relative z-40 md:z-auto w-64
      `}
      >
        <Sidebar />
      </div>

      {/* Backdrop Overlay for Mobile */}
      {sidebarOpen && !isLargeScreen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 w-full relative z-10">
        <div className="w-full min-h-screen p-4 md:p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0 mt-10 md:mt-0">
            <h1 className="text-3xl font-bold text-blue-900 drop-shadow-sm">
              DASHBOARD
            </h1>

            {/* Search Bar */}
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-300 hover:shadow-md"
                placeholder="Search..."
              />
              <button className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-xl text-gray-400">+</span>
              </button>
            </div>

            {/* Admin Profile */}
            <div className="bg-blue-900 text-white rounded-lg py-2 px-4 flex items-center shadow-md hover:shadow-lg transition-shadow">
              <User className="h-5 w-5 mr-2" />
              <span className="font-medium">admin name</span>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Students Stat */}
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden border-b-4 border-blue-500">
              <CardContent className="p-0">
                <div className="flex items-stretch">
                  <div className="bg-blue-50 p-4 flex items-center justify-center w-1/3">
                    <img
                      src={student}
                      alt="Students"
                      className="h-16 w-16 md:h-20 md:w-20 object-cover rounded-md"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-center">
                    <div className="text-2xl md:text-3xl font-bold text-blue-900">
                      {loading ? "..." : students.length}
                    </div>
                    <div className="text-sm font-medium text-blue-900">
                      Students
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Courses Stat */}
            <Card className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden border-b-4 border-green-500">
              <CardContent className="p-0">
                <div className="flex items-stretch">
                  <div className="bg-green-50 p-4 flex items-center justify-center w-1/3">
                    <img
                      src={student}
                      alt="Courses"
                      className="h-16 w-16 md:h-20 md:w-20 object-cover rounded-md"
                    />
                  </div>
                  <div className="p-4 flex flex-col justify-center">
                    <div className="text-2xl md:text-3xl font-bold text-blue-900">
                      {loading ? "..." : course.length}
                    </div>
                    <div className="text-sm font-medium text-blue-900">
                      Courses
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Empty Cards - Hide on mobile to save space */}
            <Card className="hidden sm:block bg-white shadow-md hover:shadow-lg transition-shadow border-b-4 border-purple-500">
              <CardContent className="p-4"></CardContent>
            </Card>
            <Card className="hidden sm:block bg-white shadow-md hover:shadow-lg transition-shadow border-b-4 border-pink-500">
              <CardContent className="p-4"></CardContent>
            </Card>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Top Performing Students */}
            <div className="col-span-1">
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-blue-900">
                    Top Performing Students
                  </h2>
                  <a
                    href="#"
                    className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    All Students
                  </a>
                </div>

                {/* Student List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {loading ? (
                    <div className="text-center p-4">Loading students...</div>
                  ) : error ? (
                    <div className="text-center p-4 text-red-500">
                      Error: {error}
                    </div>
                  ) : topPerformingStudents.length > 0 ? (
                    topPerformingStudents.map((student) => (
                      <div
                        key={student._id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-blue-900 text-white rounded-md p-2 hover:bg-blue-800 transition-colors"
                      >
                        <div className="flex items-center mb-2 sm:mb-0">
                          <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center mr-2">
                            <User className="h-6 w-6 text-blue-900" />
                          </div>
                          <span>
                            {student.firstName} {student.lastName}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 text-xs w-full sm:w-auto"
                        >
                          View Progress
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-4">No students found</div>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Column - Overall Pass Rate */}
            <div className="col-span-1">
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h2 className="text-xl font-bold text-blue-900 mb-4">
                  Overall Pass Rate
                </h2>
                <div className="min-h-32 bg-gray-50 rounded-md flex items-center justify-center border border-gray-100">
                  {/* This would be a chart in the real implementation */}
                  <div className="text-center text-gray-500 py-8">
                    Chart Placeholder
                  </div>
                </div>
              </div>

              {/* Schedule Section */}
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h2 className="text-xl font-bold text-blue-900 mb-4">
                  Schedule
                </h2>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[...Array(10)].map((_, index) => (
                    <div
                      key={index}
                      className="flex border-b border-gray-100 pb-2 last:border-b-0"
                    >
                      <div className="font-medium text-blue-900">Date:</div>
                      <div className="ml-2 text-blue-900">Program</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Popular Courses */}
            <div className="col-span-1">
              <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-blue-900">
                    Popular Courses
                  </h2>
                  <a
                    href="#"
                    className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    All Courses
                  </a>
                </div>

                {/* Course List */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {[
                    { name: "Mathematics", topics: "30+ Topics" },
                    { name: "Biology", topics: "30+ Topics" },
                    { name: "Chemistry", topics: "30+ Topics" },
                    { name: "Physics", topics: "30+ Topics" },
                    { name: "Geography", topics: "30+ Topics" },
                  ].map((course, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-md p-2 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center mb-2 sm:mb-0">
                        <div className="h-10 w-10 bg-blue-100 rounded-md mr-3"></div>
                        <div>
                          <div className="font-medium text-blue-900">
                            {course.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {course.topics}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-white border border-blue-900 hover:bg-blue-50 text-blue-900 text-xs w-full sm:w-auto"
                      >
                        View Course
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar Widget */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-sm font-medium text-gray-700 mb-2">
                  Select date:
                </h2>
                <div className="font-medium mb-2 text-blue-900">
                  Mon, Aug 17
                </div>

                <div className="border-t border-b py-2 mb-2">
                  <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500">
                    <div>S</div>
                    <div>M</div>
                    <div>T</div>
                    <div>W</div>
                    <div>T</div>
                    <div>F</div>
                    <div>S</div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs mt-2">
                    {/* Calendar days - would be dynamically generated in real app */}
                    {Array.from({ length: 31 }, (_, i) => (
                      <div
                        key={i}
                        className={`h-6 w-6 flex items-center justify-center rounded-full mx-auto
                        ${
                          i === 16
                            ? "bg-blue-900 text-white font-bold"
                            : "hover:bg-blue-50 hover:text-blue-900 cursor-pointer"
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <button className="text-xs text-gray-500 hover:text-blue-900 transition-colors px-2 py-1 rounded">
                    Cancel
                  </button>
                  <button className="text-xs text-blue-900 hover:bg-blue-50 transition-colors px-2 py-1 rounded font-medium">
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_Dashboard;
