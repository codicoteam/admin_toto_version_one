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
import CourseService from "@/services/Admin_Service/Course_service";
import TopicInCourseService from "@/services/Admin_Service/Topic_InCourse_service";
import { useToast } from "@/components/ui/use-toast";

const AddCourseDialog = ({ open, onOpenChange, onCourseAdded }) => {
  const [courseData, setCourseData] = useState({
    title: "",
    category: "",
    lessons: "",
    duration: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCourseData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (value) => {
    setCourseData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!courseData.title || !courseData.category) {
        throw new Error("Course title and category are required");
      }

      // Format data for API
      const apiCourseData = {
        name: courseData.title.trim(),
        category: courseData.category,
        numberOfLessons: parseInt(courseData.lessons) || 0,
        duration: courseData.duration || "0h",
        description: courseData.description || "",
        // Properly format the enum values
        subjectName: courseData.title.trim(), // Using title as subject name
        Level: getCategoryLabel(courseData.category), // Map category to Level enum value
        showSubject: true,
        // Include any other required fields
        imageUrl: "/default-course-image.jpg", // Default image path
      };

      console.log("Sending course data to API:", apiCourseData);

      // Call API to create course
      const result = await CourseService.createCourse(apiCourseData);
      console.log("API response:", result);

      // Notify parent component about the new course
      onCourseAdded(result.data);

      // Show success message
      toast({
        title: "Course created",
        description: "The course has been created successfully.",
      });

      // Reset form and close dialog
      setCourseData({
        title: "",
        category: "",
        lessons: "",
        duration: "",
        description: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create course:", error);
      // Improved error handling to extract more specific error messages
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create course. Please try again.";

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to convert category to Level format
  const getCategoryLabel = (category) => {
    switch (category) {
      case "o-level":
        return "O Level";
      case "a-level":
        return "A Level";
      case "tertiary":
        return "Tertiary";
      default:
        return category;
    }
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
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Course"}
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
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Fetch topics for a specific course
  const fetchTopicsForCourse = async (courseId) => {
    try {
      const result = await TopicInCourseService.getAllTopics(courseId);
      return result.data || [];
    } catch (err) {
      console.error(`Failed to fetch topics for course ${courseId}:`, err);
      return [];
    }
  };

  // Fetch courses and their topics from API
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const result = await CourseService.getAllCourses();
      const coursesData = result.data || [];

      // For each course, fetch its topics
      const coursesWithTopics = await Promise.all(
        coursesData.map(async (course) => {
          const topics = await fetchTopicsForCourse(course._id || course.id);
          return { ...course, topics };
        })
      );

      setCourses(coursesWithTopics);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Failed to load courses. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load courses. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load of courses
  useEffect(() => {
    fetchCourses();
  }, []);

  // Add course handler
  const handleCourseAdded = async (newCourse) => {
    // Fetch topics for the newly added course
    const topics = await fetchTopicsForCourse(newCourse._id || newCourse.id);
    const courseWithTopics = { ...newCourse, topics };
    setCourses([...courses, courseWithTopics]);
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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Tabs based on the design with categories
  const tabs = [
    { id: "all", label: "All" },
    { id: "popular", label: "Popular Courses" },
    { id: "o-level", label: "O' Level" },
    { id: "a-level", label: "A' Level" },
    { id: "tertiary", label: "Tertiary" },
  ];

  // Filter courses based on active tab and search query
  const filteredCourses = courses.filter((course) => {
    // First filter by tab category
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "popular"
        ? course.isPopular
        : course.category === activeTab;

    // Then filter by search query if one exists
    const matchesSearch = searchQuery
      ? course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.subjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesTab && matchesSearch;
  });

  // Map API course data to the format expected by the CourseCard component
  const mapCourseToCardProps = (course) => {
    return {
      id: course._id || course.id,
      title:
        course.name || course.title || course.subjectName || "Untitled Course",
      category: course.Level || course.category || "Unknown Category",
      lessons: course.numberOfLessons || course.lessons || 0,
      duration: course.duration || "0h",
      topics: course.topics || [],
      imageUrl: course.imageUrl || "/default-course-image.jpg",
      showSubject: course.showSubject !== undefined ? course.showSubject : true,
    };
  };

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
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
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

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-900"></div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md my-4">
              <p>{error}</p>
              <Button variant="outline" className="mt-2" onClick={fetchCourses}>
                Retry
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No courses found</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-900 hover:bg-blue-800">
                    <Plus className="h-4 w-4 mr-2" /> Add Your First Course
                  </Button>
                </DialogTrigger>
                <AddCourseDialog
                  open={dialogOpen}
                  onOpenChange={setDialogOpen}
                  onCourseAdded={handleCourseAdded}
                />
              </Dialog>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && !error && filteredCourses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course._id || course.id}
                  {...mapCourseToCardProps(course)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
