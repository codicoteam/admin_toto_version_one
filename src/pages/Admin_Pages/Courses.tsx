import { useState, useEffect } from "react";
import { Search, Plus, Menu, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CourseCard from "@/components/CourseCard";

const AddCourseDialog = ({ open, onOpenChange, onCourseAdded }) => {
  const [courseData, setCourseData] = useState({
    title: "",
    category: "",
    lessons: "",
    duration: "",
    description: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCourseData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (value) => {
    setCourseData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create new course with unique ID
    const newCourse = {
      id: `course-${Date.now()}`,
      ...courseData,
      topics: [],
    };

    // Pass to parent component
    onCourseAdded(newCourse);

    // Reset form and close dialog
    setCourseData({
      title: "",
      category: "",
      lessons: "",
      duration: "",
      description: "",
    });
    onOpenChange(false);
  };

  return (
    <DialogContent className="sm:max-w-[500px] mx-4 max-w-full">
      <DialogHeader>
        <DialogTitle>Add New Course</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Course Title</Label>
          <Input
            id="title"
            value={courseData.title}
            onChange={handleChange}
            placeholder="Enter course title"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            onValueChange={handleCategoryChange}
            value={courseData.category}
            required
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="o-level">O' Level</SelectItem>
              <SelectItem value="a-level">A' Level</SelectItem>
              <SelectItem value="tertiary">Tertiary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="lessons">Number of Lessons</Label>
            <Input
              id="lessons"
              type="number"
              value={courseData.lessons}
              onChange={handleChange}
              placeholder="10"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="duration">Duration (hours)</Label>
            <Input
              id="duration"
              value={courseData.duration}
              onChange={handleChange}
              placeholder="5h"
              required
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={courseData.description}
            onChange={handleChange}
            placeholder="Course description..."
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="thumbnail">Course Thumbnail</Label>
          <Input id="thumbnail" type="file" />
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            Create Course
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

const AdminCourses = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [courses, setCourses] = useState([
    {
      id: "1",
      title: "Mathematics",
      category: "o-level",
      lessons: 10,
      duration: "2h",
      topics: [
        {
          id: "t1-1",
          name: "Algebra",
          description: "Basic algebraic expressions",
          duration: "30",
        },
        {
          id: "t1-2",
          name: "Geometry",
          description: "Angles and shapes",
          duration: "45",
        },
      ],
    },
    {
      id: "2",
      title: "Biology",
      category: "o-level",
      lessons: 12,
      duration: "3h",
      topics: [
        {
          id: "t2-1",
          name: "Cell Structure",
          description: "Understanding cell components",
          duration: "40",
        },
        {
          id: "t2-2",
          name: "Photosynthesis",
          description: "How plants make food",
          duration: "35",
        },
      ],
    },
    {
      id: "3",
      title: "Physics",
      category: "a-level",
      lessons: 15,
      duration: "4h",
      topics: [
        {
          id: "t3-1",
          name: "Mechanics",
          description: "Forces and motion",
          duration: "50",
        },
        {
          id: "t3-2",
          name: "Electricity",
          description: "Current and voltage",
          duration: "60",
        },
      ],
    },
    {
      id: "4",
      title: "Chemistry",
      category: "a-level",
      lessons: 14,
      duration: "4h",
      topics: [
        {
          id: "t4-1",
          name: "Atomic Structure",
          description: "Atoms and elements",
          duration: "45",
        },
      ],
    },
    {
      id: "5",
      title: "Computer Science",
      category: "tertiary",
      lessons: 20,
      duration: "5h",
      topics: [
        {
          id: "t5-1",
          name: "Programming Basics",
          description: "Introduction to coding",
          duration: "90",
        },
      ],
    },
    {
      id: "6",
      title: "Business Studies",
      category: "tertiary",
      lessons: 16,
      duration: "3h",
      topics: [
        {
          id: "t6-1",
          name: "Marketing",
          description: "Principles of marketing",
          duration: "60",
        },
      ],
    },
  ]);

  // Add course handler
  const handleCourseAdded = (newCourse) => {
    setCourses([...courses, newCourse]);
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

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Tabs based on the design with categories
  const tabs = [
    { id: "all", label: "All" },
    { id: "popular", label: "Popular Courses" },
    { id: "o-level", label: "O' Level" },
    { id: "a-level", label: "A' Level" },
    { id: "tertiary", label: "Tertiary" },
  ];

  // Filter courses based on active tab
  const filteredCourses =
    activeTab === "all"
      ? courses
      : activeTab === "popular"
      ? courses.slice(0, 3) // Just for demo, showing first 3 as "popular"
      : courses.filter((course) => course.category === activeTab);

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
        <div className="p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 mt-10 md:mt-0">
            <h1 className="text-2xl font-bold text-blue-900">COURSES</h1>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
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

              {/* Add Course Button */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-900 hover:bg-blue-800 w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" /> Add Course
                  </Button>
                </DialogTrigger>
                <AddCourseDialog
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                  onCourseAdded={handleCourseAdded}
                />
              </Dialog>
            </div>
          </div>

          {/* Tabs - Scrollable on mobile */}
          <div className="mb-8 overflow-x-auto pb-2">
            <ul className="flex space-x-6 border-b border-gray-200 whitespace-nowrap min-w-max md:min-w-0">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    className={`py-2 ${
                      activeTab === tab.id
                        ? "text-blue-900 font-medium border-b-2 border-blue-900"
                        : "text-gray-600"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                category={course.category}
                lessons={course.lessons}
                duration={course.duration}
                topics={course.topics}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
