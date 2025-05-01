import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, User, Menu, X, Search } from "lucide-react";
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
import logo from "@/assets/logo2.png";
import Sidebar from "@/components/Sidebar";

// Mock data for examination results chart
const examData = [
  { name: "Year 1", "O' Level": 75, "A' Level": 85, Tertiary: 65 },
  { name: "Year 2", "O' Level": 85, "A' Level": 80, Tertiary: 70 },
  { name: "Year 3", "O' Level": 80, "A' Level": 90, Tertiary: 75 },
  { name: "Year 4", "O' Level": 90, "A' Level": 85, Tertiary: 80 },
];

// Mock data for student count by level
const studentLevelData = [
  { level: "O' Level", count: 570 },
  { level: "A' Level", count: 280 },
  { level: "Tertiary", count: 150 },
];

// Student profile data for the cards
const studentProfiles = [
  {
    name: "Student Name",
    level: "Level",
    metric: "89%",
    metricLabel: "Overall Pass Rate",
    type: "marks",
  },
  {
    name: "Student Name",
    level: "Level",
    metric: "92%",
    metricLabel: "Overall Attendance",
    type: "attendance",
  },
  {
    name: "Student Name",
    level: "Level",
    metric: "10%",
    metricLabel: "Improvement",
    type: "marks-improved",
  },
  {
    name: "Student Name",
    level: "Level",
    metric: "22%",
    metricLabel: "Improvement",
    type: "attendance-improved",
  },
];

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

const StudentDashboard = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Available options for dropdowns
  const yearOptions = ["2022", "2023", "2024", "2025"];
  const levelOptions = ["O' Level", "A' Level", "Tertiary", "All Levels"];

  // Calculate total student count
  const totalStudents = studentLevelData.reduce(
    (acc, curr) => acc + curr.count,
    0
  );

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-900 text-white p-2 rounded-md"
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
              />
              <button className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-xl text-gray-400">+</span>
              </button>
            </div>

            {/* Admin Profile */}
            <div className="bg-blue-900 text-white rounded-md py-2 px-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span className="font-medium">admin name</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Section - Filters and Student Count */}
            <div className="col-span-1 lg:col-span-5 space-y-6">
              <div className="mb-4 flex flex-col sm:flex-row gap-4">
                {/* Year Dropdown */}
                <div className="w-full sm:w-1/2">
                  <Dropdown
                    options={yearOptions}
                    value={selectedYear}
                    onChange={setSelectedYear}
                    placeholder="Select Year"
                  />
                </div>

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
                    <div className="text-4xl font-bold text-blue-900">90%</div>
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
                            width: `${(item.count / totalStudents) * 100}%`,
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
              <div className="bg-white p-6 rounded-md shadow-sm">
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
              </div>
            </div>

            {/* Right Section - Student Profile Cards */}
            <div className="col-span-1 lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Student Cards */}
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
                        <div className="text-xs text-gray-500">
                          {student.level}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-xl font-bold ${
                            index === 2 || index === 3
                              ? "flex items-center"
                              : ""
                          }`}
                        >
                          {index === 2 || index === 3 ? (
                            <>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-green-500 mr-1"
                              >
                                <path d="M5 15l7-7 7 7"></path>
                              </svg>
                            </>
                          ) : null}
                          {student.metric}
                        </div>
                        <div className="text-xs text-gray-500">
                          {student.metricLabel}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Student Details Card */}
              <div className="bg-white p-6 rounded-md shadow-sm">
                <h3 className="text-lg font-medium mb-4">Student Details</h3>
                {selectedYear && selectedLevel ? (
                  <div className="p-4 border border-gray-200 rounded">
                    <p className="text-sm mb-2">
                      <span className="font-medium">Selected Filters:</span>
                    </p>
                    <p className="text-sm">Academic Year: {selectedYear}</p>
                    <p className="text-sm">Education Level: {selectedLevel}</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 p-4">
                    Please select a year and level to view student details
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
