import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  ChevronDown,
  User,
  Menu,
  X,
  Search,
  Phone,
  Mail,
  School,
  Book,
  Home,
  Users,
  AlertCircle,
  Trash,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import logo from "@/assets/logo2.png";
import Sidebar from "@/components/Sidebar";
import StudentService from "../../services/Admin_Service/Student_service";

// Dropdown component for reusability
const Dropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        className="w-full flex items-center justify-between border border-gray-300 rounded px-4 py-2 bg-white"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span>{value || placeholder}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-10">
          {options.map((option, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Student Detail Modal Component
const StudentDetailModal = ({ student, isOpen, onClose }) => {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-blue-900 flex items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full mr-4 flex items-center justify-center">
              <User className="h-8 w-8 text-blue-900" />
            </div>
            Student Profile
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6">
          {/* Left Column - Personal Info */}
          <div className="col-span-1 bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-700 mb-4">
              Personal Information
            </h3>
            <div className="space-y-5">
              <div className="flex items-start">
                <User className="h-5 w-5 text-blue-900 mt-1 mr-3" />
                <div>
                  <p className="font-semibold text-base">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    ID: {student.studentId || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-900 mt-1 mr-3" />
                <div>
                  <p className="text-base">{student.email || "N/A"}</p>
                  <p className="text-sm text-gray-500">Email</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-blue-900 mt-1 mr-3" />
                <div>
                  <p className="text-base">{student.phone_number || "N/A"}</p>
                  <p className="text-sm text-gray-500">Phone</p>
                </div>
              </div>

              <div className="flex items-start">
                <Home className="h-5 w-5 text-blue-900 mt-1 mr-3" />
                <div>
                  <p className="text-base">{student.address || "N/A"}</p>
                  <p className="text-sm text-gray-500">Address</p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Academic Info */}
          <div className="col-span-1 bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-700 mb-4">
              Academic Information
            </h3>
            <div className="space-y-5">
              <div className="flex items-start">
                <School className="h-5 w-5 text-blue-900 mt-1 mr-3" />
                <div>
                  <p className="text-base">{student.school || "N/A"}</p>
                  <p className="text-sm text-gray-500">School</p>
                </div>
              </div>

              <div className="flex items-start">
                <Book className="h-5 w-5 text-blue-900 mt-1 mr-3" />
                <div>
                  <p className="text-base">{student.level || "N/A"}</p>
                  <p className="text-sm text-gray-500">Level</p>
                </div>
              </div>

              <div className="flex items-start">
                <Book className="h-5 w-5 text-blue-900 mt-1 mr-3" />
                <div>
                  <div className="text-base">
                    {Array.isArray(student.subjects) &&
                    student.subjects.length > 0
                      ? student.subjects.join(", ")
                      : "No subjects listed"}
                  </div>
                  <p className="text-sm text-gray-500">Subjects</p>
                </div>
              </div>

              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-900 mt-1 mr-3" />
                <div>
                  <p className="text-base font-medium">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        student.subscription_status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {(student.subscription_status || "N/A").toUpperCase()}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">Subscription Status</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Performance & Next of Kin */}
          <div className="col-span-1 bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-700 mb-4">
              Additional Information
            </h3>
            <div className="space-y-5">
              <div className="flex items-start">
                <Users className="h-5 w-5 text-blue-900 mt-1 mr-3" />
                <div>
                  <p className="text-base">
                    {student.next_of_kin_full_name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Next of Kin</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-5 w-5 text-blue-900 mt-1 mr-3" />
                <div>
                  <p className="text-base">
                    {student.next_of_kin_phone_number || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Next of Kin Phone</p>
                </div>
              </div>

              {student.overallMark !== undefined && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">Overall Mark</span>
                    <span className="text-sm font-semibold">
                      {student.overallMark}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-900 h-3 rounded-full"
                      style={{ width: `${student.overallMark}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {student.attendance !== undefined && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">Attendance</span>
                    <span className="text-sm font-semibold">
                      {student.attendance}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${student.attendance}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-6">
          <Button
            className="bg-blue-900 hover:bg-blue-800 text-base px-6 py-2"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Delete Confirmation Dialog Component
const DeleteConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  student, 
  onConfirm 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-blue-600 flex items-center">
            <Trash className="h-5 w-5 mr-2" />
            Delete Student
          </DialogTitle>
          <DialogDescription className="pt-4 text-black">
            Are you sure you want to delete this student?
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="font-medium text-gray-800">
            {student?.firstName} {student?.lastName}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            ID: {student?.studentId || "N/A"}
          </div>
          <div className="text-sm text-gray-600">
            Level: {student?.level || "N/A"}
          </div>
        </div>
        
        <p className="text-red-500 text-sm mt-2">
          This action cannot be undone. All student data will be permanently removed.
        </p>
        
        <DialogFooter className="pt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 ml-2"
          >
            Yes, Delete Student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const StudentDashboard = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [examData, setExamData] = useState([]);
  const [studentLevelData, setStudentLevelData] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [studentProfiles, setStudentProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [adminName, setAdminName] = useState("Admin User");

  // State for student details modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for delete confirmation
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Available options for dropdowns
  const yearOptions = ["2022", "2023", "2024", "2025", "All years"];
  const levelOptions = ["All Levels", "O Level", "A Level", "Form 1", "Form 2", "Form 3", "Form 4"];

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle opening student details modal
  const handleViewStudentDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  // Handle opening delete confirmation dialog
  const handleOpenDeleteDialog = (student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  // Handle closing delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  // Handle actual student deletion
  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    
    setIsDeleting(true);
    try {
      await StudentService.deleteStudent(studentToDelete._id);
      
      // Remove deleted student from state
      setStudents(prevStudents => 
        prevStudents.filter(student => student._id !== studentToDelete._id)
      );
      
      // Close dialog and show success message
      handleCloseDeleteDialog();
      console.log("Student deleted successfully");
    } catch (error) {
      console.error("Failed to delete student:", error);
      alert(`Failed to delete student: ${error.message || "Please try again"}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Fetch all students on component mount
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await StudentService.getAllStudents();
        if (response && Array.isArray(response.data)) {
          setStudents(response.data);
          processStudentData(response.data);
        } else {
          throw new Error("Invalid student data received");
        }
      } catch (err) {
        setError(err.message || "Error fetching students");
        console.error("Error fetching students:", err);
        setStudents([]);
        setFilteredStudents([]);
        setExamData([
          { name: "No Data", "O' Level": 0, "A' Level": 0, Tertiary: 0 },
        ]);
        setStudentLevelData([]);
        setStudentProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchAdminName = async () => {
      try {
        // Admin name fetching logic here
      } catch (err) {
        console.error("Error fetching admin info:", err);
      }
    };

    fetchStudents();
    fetchAdminName();
  }, []);

  // Process student data to extract relevant statistics
  const processStudentData = (data) => {
    if (!data || data.length === 0) {
      setTotalStudents(0);
      setStudentLevelData([]);
      setExamData([
        { name: "No Data", "O' Level": 0, "A' Level": 0, Tertiary: 0 },
      ]);
      setStudentProfiles([
        {
          name: "N/A",
          level: "N/A",
          metric: "N/A",
          metricLabel: "Overall Pass Rate",
          type: "marks",
        },
        {
          name: "N/A",
          level: "N/A",
          metric: "N/A",
          metricLabel: "Overall Attendance",
          type: "attendance",
        },
        {
          name: "N/A",
          level: "N/A",
          metric: "N/A",
          metricLabel: "Improvement",
          type: "marks-improved",
        },
        {
          name: "N/A",
          level: "N/A",
          metric: "N/A",
          metricLabel: "Improvement",
          type: "attendance-improved",
        },
      ]);
      return;
    }

    setTotalStudents(data.length);

    const levelCounts = data.reduce((acc, student) => {
      const level = student.level || "Unknown";
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});

    const levelData = Object.keys(levelCounts).map((level) => ({
      level,
      count: levelCounts[level],
    }));
    setStudentLevelData(levelData);

    const examResults = {};

    data.forEach((student) => {
      const year = student.academicYear || "Unknown";
      const level = student.level || "Unknown";

      if (!examResults[year]) {
        examResults[year] = {
          "O' Level": 0,
          "A' Level": 0,
          Tertiary: 0,
          count: {},
        };
      }

      if (!examResults[year].count[level]) {
        examResults[year].count[level] = 0;
      }

      examResults[year][level] =
        (examResults[year][level] || 0) + (student.overallMark || 0);
      examResults[year].count[level]++;
    });

    const formattedExamData = Object.keys(examResults).map((year) => {
      const result = { name: `Year ${year}` };

      Object.keys(examResults[year]).forEach((level) => {
        if (level !== "count") {
          const count = examResults[year].count[level] || 1;
          result[level] = Math.round(examResults[year][level] / count);
        }
      });

      return result;
    });

    setExamData(
      formattedExamData.length > 0
        ? formattedExamData
        : [{ name: "No Data", "O' Level": 0, "A' Level": 0, Tertiary: 0 }]
    );

    const topStudents = {
      marks: getTopStudent(data, "overallMark"),
      attendance: getTopStudent(data, "attendance"),
      marksImproved: getTopStudent(data, "improvement"),
      attendanceImproved: getTopStudent(data, "attendanceImprovement"),
    };

    const profiles = [
      {
        name: formatStudentName(topStudents.marks),
        level: topStudents.marks?.level || "N/A",
        metric: topStudents.marks
          ? `${topStudents.marks.overallMark || 0}%`
          : "N/A",
        metricLabel: "Overall Pass Rate",
        type: "marks",
      },
      {
        name: formatStudentName(topStudents.attendance),
        level: topStudents.attendance?.level || "N/A",
        metric: topStudents.attendance
          ? `${topStudents.attendance.attendance || 0}%`
          : "N/A",
        metricLabel: "Overall Attendance",
        type: "attendance",
      },
      {
        name: formatStudentName(topStudents.marksImproved),
        level: topStudents.marksImproved?.level || "N/A",
        metric: topStudents.marksImproved
          ? `${topStudents.marksImproved.improvement || 0}%`
          : "N/A",
        metricLabel: "Improvement",
        type: "marks-improved",
      },
      {
        name: formatStudentName(topStudents.attendanceImproved),
        level: topStudents.attendanceImproved?.level || "N/A",
        metric: topStudents.attendanceImproved
          ? `${topStudents.attendanceImproved.attendanceImprovement || 0}%`
          : "N/A",
        metricLabel: "Improvement",
        type: "attendance-improved",
      },
    ];

    setStudentProfiles(profiles);
  };

  const getTopStudent = (data, metricField) => {
    if (!data || data.length === 0) return null;

    const validStudents = data.filter(
      (student) => student && typeof student[metricField] === "number"
    );

    if (validStudents.length === 0) return null;

    return [...validStudents].sort(
      (a, b) => (b[metricField] || 0) - (a[metricField] || 0)
    )[0];
  };

  const formatStudentName = (student) => {
    if (!student) return "N/A";
    const firstName = student.firstName || "";
    const lastName = student.lastName || "";
    return `${firstName} ${lastName}`.trim();
  };

  // Filter students based on selected year and level
  useEffect(() => {
    if (!students || students.length === 0) {
      setFilteredStudents([]);
      return;
    }

    let filtered = [...students];

    if (selectedYear && selectedYear !== "All years") {
      filtered = filtered.filter(
        (student) => student.academicYear === selectedYear
      );
    }

    if (selectedLevel && selectedLevel !== "All Levels") {
      filtered = filtered.filter((student) => student.level === selectedLevel);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (student) =>
          (student.firstName || "").toLowerCase().includes(query) ||
          (student.lastName || "").toLowerCase().includes(query) ||
          (student.studentId || "").toLowerCase().includes(query)
      );
    }

    setFilteredStudents(filtered);
  }, [selectedYear, selectedLevel, students, searchQuery]);

  const calculateAverageAttendance = () => {
    if (!students || students.length === 0) return 0;

    const studentsWithAttendance = students.filter(
      (student) => student && typeof student.attendance === "number"
    );

    if (studentsWithAttendance.length === 0) return 0;

    const totalAttendance = studentsWithAttendance.reduce(
      (sum, student) => sum + (student.attendance || 0),
      0
    );
    return Math.round(totalAttendance / studentsWithAttendance.length);
  };

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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-900 text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        {sidebarOpen && !isLargeScreen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
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
      <div className="flex-1 w-full">
        <div className="w-full min-h-screen p-4 md:p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0 mt-10 md:mt-0">
            <h1 className="text-2xl font-bold text-blue-900">STUDENTS</h1>

            {/* Search Bar */}
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-xl text-gray-400">+</span>
              </button>
            </div>

            {/* Admin Profile */}
            {/* <div className="bg-blue-900 text-white rounded-md py-2 px-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span className="font-medium">{adminName}</span>
            </div> */}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading student data...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64 text-red-500">
              <p>Error: {error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Section - Filters and Student Count */}
              <div className="col-span-1 lg:col-span-5 space-y-6">
                <div className="mb-4 flex flex-col sm:flex-row gap-4">
                  {/* Year Dropdown */}
            

                  {/* Level Dropdown */}
                  <div className="w-full sm:w-1/2">
                    <Dropdown
                      options={levelOptions}
                      value={selectedLevel}
                      onChange={setSelectedLevel}
                      placeholder="Select Level"
                    />
                  </div>
                </div>

                {/* Student Count Card */}
                <div className="bg-white p-6 rounded-md shadow-sm">
                  <h3 className="text-lg font-medium mb-6">Student Count</h3>

                  <div className="flex flex-col sm:flex-row mb-8 gap-4 sm:gap-0">
                    <div className="flex-1">
                      <div className="text-4xl font-bold text-blue-900">
                        {totalStudents.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Student Count</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-4xl font-bold text-blue-900">
                        {calculateAverageAttendance()}%
                      </div>
                      <div className="text-sm text-gray-600">
                        Student Attendance
                      </div>
                    </div>
                  </div>

                  {/* Student Level Breakdown */}
                  <div className="space-y-3">
                    {studentLevelData.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-20 text-xs">{item.level}</div>
                        <div className="flex-1 relative h-6">
                          <div
                            className={`absolute top-0 left-0 h-full ${
                              index === 0
                                ? "bg-blue-900"
                                : index === 1
                                ? "bg-yellow-400"
                                : "bg-blue-300"
                            }`}
                            style={{
                              width: `${
                                totalStudents > 0
                                  ? (item.count / totalStudents) * 100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="w-12 text-xs text-right">
                          {item.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Examination Results */}
                {/* <div className="bg-white p-6 rounded-md shadow-sm">
                  <h3 className="text-lg font-medium mb-4">
                    Examination Results
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-900 mr-1"></div>
                      <span className="text-xs">O' Level</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-yellow-400 mr-1"></div>
                      <span className="text-xs">A' Level</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-300 mr-1"></div>
                      <span className="text-xs">Tertiary</span>
                    </div>
                  </div>

                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={examData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis hide={true} />
                        <Bar dataKey="O' Level" fill="#102C57" barSize={15} />
                        <Bar dataKey="A' Level" fill="#FFC107" barSize={15} />
                        <Bar dataKey="Tertiary" fill="#90CAF9" barSize={15} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div> */}
              </div>

              {/* Right Section - Student Profile Cards */}
              <div className="col-span-1 lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Student Cards
                  {studentProfiles.map((student, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-md shadow-sm"
                    >
                      <div className="mb-2 text-sm font-medium">
                        {index === 0
                          ? "Best in Marks"
                          : index === 1
                          ? "Best in Attendance"
                          : index === 2
                          ? "Most Improved in Marks"
                          : "Most Improved in Attendance"}
                      </div>

                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {student.name}
                          </div>
                          <div className="text-sm font-medium">
                            {student.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {student.level}
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="text-xl font-bold text-blue-900">
                            {student.metric}
                          </div>
                          <div className="text-xs text-gray-600">
                            {student.metricLabel}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))} */}
                </div>

                {/* Students Table */}
                <div className="bg-white p-6 rounded-md shadow-sm">
                  <h3 className="text-lg font-medium mb-4">Students</h3>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-spacing-y-2 border-separate">
                        <thead className="sticky top-0 bg-white z-10">
                          <tr>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                              Name
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                              ID
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                              Level
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                              School
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                              Status
                            </th>
                            <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.length > 0 ? (
                            filteredStudents.map((student, index) => (
                              <tr key={index}>
                                <td className="px-2 py-3 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 flex-shrink-0"></div>
                                    <div>
                                      <div className="text-sm font-medium">
                                        {student.firstName} {student.lastName}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {student.email}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-2 py-3 whitespace-nowrap text-sm">
                                  {student.studentId || "N/A"}
                                </td>
                                <td className="px-2 py-3 whitespace-nowrap text-sm">
                                  {student.level || "N/A"}
                                </td>
                                <td className="px-2 py-3 whitespace-nowrap text-sm">
                                  {student.school || "N/A"}
                                </td>
                                <td className="px-2 py-3 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      student.subscription_status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {(
                                      student.subscription_status || "N/A"
                                    ).toUpperCase()}
                                  </span>
                                </td>
                                <td className="px-2 py-3 whitespace-nowrap text-sm">
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-blue-900 border-blue-900 hover:bg-blue-50"
                                      onClick={() =>
                                        handleViewStudentDetails(student)
                                      }
                                    >
                                      View
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="text-white hover:bg-red-700"
                                      onClick={() => handleOpenDeleteDialog(student)}
                                      disabled={isDeleting}
                                    >
                                      <Trash className="h-4 w-4 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={6}
                                className="px-2 py-4 text-center text-gray-500"
                              >
                                No students found matching your criteria
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        student={studentToDelete}
        onConfirm={handleDeleteStudent}
      />
    </div>
  );
};

export default StudentDashboard;