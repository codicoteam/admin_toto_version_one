import { useState } from "react";
import {
  Search,
  Bell,
  ChevronRight,
  BarChart2,
  CreditCard,
  Book,
  MessageSquare,
  Users,
  Settings,
  Home,
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("DASHBOARD");

  // Sample data - in a real application, you would fetch this from your backend
  const stats = {
    students: 100,
    courses: 12,
    topStudents: [
      "John Doe",
      "Jane Smith",
      "Robert Johnson",
      "Emily Wilson",
      "Michael Brown",
    ],
    topCourses: [
      "Web Development",
      "Data Science",
      "UI/UX Design",
      "Mobile App Development",
      "Machine Learning",
    ],
    notifications: [
      "New student registered",
      "Course completion: Web Development",
      "Payment received: $299",
    ],
  };

  const navItems = [
    { name: "DASHBOARD", icon: <Home size={20} /> },
    { name: "COURSES", icon: <Book size={20} /> },
    { name: "STUDENTS", icon: <Users size={20} /> },
    { name: "CHAT", icon: <MessageSquare size={20} /> },
    { name: "LIBRARY", icon: <Book size={20} /> },
    { name: "PAYMENTS", icon: <CreditCard size={20} /> },
    { name: "ANALYTICS", icon: <BarChart2 size={20} /> },
    { name: "SETTINGS", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-48 bg-white shadow-lg flex flex-col">
        <div className="p-4 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="bg-yellow-400 h-16 w-24 rounded-b-full relative overflow-hidden">
              <div className="absolute bg-blue-900 h-10 w-10 rounded-full left-2 top-6"></div>
              <div className="absolute bg-blue-900 h-10 w-10 rounded-full right-2 top-6"></div>
            </div>
            <span className="text-blue-900 font-bold text-2xl mt-2">TOTO</span>
            <span className="text-gray-500 text-xs">ACADEMY</span>
          </div>
        </div>

        <div className="flex-1 mt-6">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`w-full py-3 px-4 flex items-center text-sm font-medium ${
                activeTab === item.name
                  ? "bg-blue-900 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              } mb-2`}
              onClick={() => setActiveTab(item.name)}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-900">DASHBOARD</h1>

          <div className="flex items-center">
            <div className="relative mr-2">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg bg-purple-100 w-64"
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
            <button className="bg-white p-2 rounded-full shadow">
              <Bell size={20} />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-200 p-6 rounded-lg">
            <h2 className="text-4xl font-bold text-center">{stats.students}</h2>
            <p className="text-center text-gray-600">Students</p>
          </div>
          <div className="bg-gray-200 p-6 rounded-lg">
            <h2 className="text-4xl font-bold text-center">{stats.courses}</h2>
            <p className="text-center text-gray-600">Courses</p>
          </div>
          <div className="bg-blue-200 p-6 rounded-lg">
            <h2 className="text-4xl font-bold text-center">87%</h2>
            <p className="text-center text-gray-600">Completion</p>
          </div>
          <div className="bg-blue-200 p-6 rounded-lg">
            <h2 className="text-4xl font-bold text-center">$12k</h2>
            <p className="text-center text-gray-600">Revenue</p>
          </div>
        </div>

        {/* Top Lists Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-200 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">TOP STUDENTS</h2>
            <div className="space-y-2">
              {stats.topStudents.map((student, index) => (
                <div key={`student-${index}`} className="flex items-center">
                  <span className="mr-2 font-bold">{index + 1}.</span>
                  <span className="font-medium">STUDENT NAME</span>
                  <span className="text-sm text-gray-600 ml-2">
                    ({student})
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-200 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">TOP ENROLLED COURSES</h2>
            <div className="space-y-2">
              {stats.topCourses.map((course, index) => (
                <div key={`course-${index}`} className="flex items-center">
                  <span className="mr-2 font-bold">{index + 1}.</span>
                  <span className="font-medium">COURSE</span>
                  <span className="text-sm text-gray-600 ml-2">({course})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-200 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">NOTIFICATIONS</h2>
            <div className="space-y-2">
              {stats.notifications.map((notification, index) => (
                <div
                  key={`notification-${index}`}
                  className="flex items-center"
                >
                  <div className="h-2 w-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>{notification}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-200 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">RECENT ACTIVITIES</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>New course added</span>
                <ChevronRight size={16} />
              </div>
              <div className="flex justify-between items-center">
                <span>Student progress updated</span>
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
          <div className="bg-blue-200 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">QUICK ACTIONS</h2>
            <div className="space-y-2">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded">
                Add New Course
              </button>
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded">
                Enroll Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
