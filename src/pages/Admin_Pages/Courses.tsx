import { useState, useEffect } from "react";
import { Search, Plus, Menu, X, ChevronLeft, BookOpen } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CourseCard from "@/components/CourseCard";
import CourseService from "@/services/Admin_Service/Course_service";
import TopicInCourseService from "@/services/Admin_Service/Topic_InCourse_service";
import { useToast } from "@/components/ui/use-toast";

// Define interfaces for your data types
interface Topic {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  description?: string;
  courseId?: string;
  subject_id?: string;
  order?: number;
}

interface Course {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  subjectName?: string;
  category?: string;
  Level?: string;
  numberOfLessons?: number;
  lessons?: number;
  duration?: string;
  description?: string;
  imageUrl?: string;
  isPopular?: boolean;
  showSubject?: boolean;
  topics?: Topic[];
}

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCourseAdded: (course: Course) => void;
}

// Topic Card Component
const TopicCard: React.FC<{ topic: Topic; index: number }> = ({
  topic,
  index,
}) => {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center mr-3">
            <BookOpen size={16} />
          </div>
          <CardTitle className="text-lg">{topic.title || topic.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm line-clamp-2">
          {topic.description || "No description available"}
        </CardDescription>
      </CardContent>
      <CardFooter className="pt-0 text-xs text-gray-500">
        Topic {index + 1}
      </CardFooter>
    </Card>
  );
};

// AddCourseDialog Component
const AddCourseDialog: React.FC<AddCourseDialogProps> = ({
  open,
  onOpenChange,
  onCourseAdded,
}) => {
  const [courseData, setCourseData] = useState({
    title: "",
    category: "",
    lessons: "",
    duration: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setCourseData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setCourseData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
        imageUrl: "", // Default image path
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
    } catch (error: any) {
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
  const getCategoryLabel = (category: string): string => {
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

// Add Topic Dialog Component
const AddTopicDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  onTopicAdded: () => void;
}> = ({ open, onOpenChange, courseId, onTopicAdded }) => {
  const [topicData, setTopicData] = useState({
    title: "",
    description: "",
    order: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setTopicData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!topicData.title) {
        throw new Error("Topic title is required");
      }

      const apiTopicData = {
        name: topicData.title.trim(),
        title: topicData.title.trim(),
        description: topicData.description || "",
        order: parseInt(topicData.order.toString()) || 0,
        subject_id: courseId, // Using courseId as subject_id
      };

      const result = await TopicInCourseService.createTopic(apiTopicData);

      toast({
        title: "Topic created",
        description: "The topic has been added to this course.",
      });

      setTopicData({
        title: "",
        description: "",
        order: 0,
      });
      onOpenChange(false);
      onTopicAdded();
    } catch (error: any) {
      console.error("Failed to create topic:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create topic. Please try again.";

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px] mx-4 max-w-full">
      <DialogHeader>
        <DialogTitle>Add New Topic</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Topic Title</Label>
          <Input
            id="title"
            value={topicData.title}
            onChange={handleChange}
            placeholder="Enter topic title"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={topicData.description}
            onChange={handleChange}
            placeholder="Topic description..."
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            type="number"
            value={topicData.order}
            onChange={handleChange}
            placeholder="1"
          />
          <p className="text-xs text-gray-500">
            The order in which this topic appears in the course
          </p>
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
            {isSubmitting ? "Creating..." : "Add Topic"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

const AdminCourses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [topicDialogOpen, setTopicDialogOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();

  // State for viewing a specific course's topics
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [loadingTopics, setLoadingTopics] = useState<boolean>(false);

  // Fetch topics for a specific course
  const fetchTopicsForCourse = async (courseId: string): Promise<Topic[]> => {
    try {
      setLoadingTopics(true);
      // Use getTopicsBySubjectId instead of getAllTopics to filter topics by course ID
      const result = await TopicInCourseService.getTopicsByCourseId(courseId);
      console.log(`Topics for course ${courseId}:`, result);
      return result.data || [];
    } catch (err) {
      console.error(`Failed to fetch topics for course ${courseId}:`, err);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load topics for this course. Please try again.`,
      });
      return [];
    } finally {
      setLoadingTopics(false);
    }
  };

  // Function to view a specific course's topics
  const viewCourseTopics = async (course: Course) => {
    const courseId = course._id || course.id;
    if (!courseId) return;

    try {
      setSelectedCourse(course);
      // If topics are already fetched, no need to fetch again
      if (!course.topics || course.topics.length === 0) {
        const topics = await fetchTopicsForCourse(courseId);
        // Update the course in state with fetched topics
        setCourses((prev) =>
          prev.map((c) =>
            c._id === courseId || c.id === courseId ? { ...c, topics } : c
          )
        );
        // Also update the selected course
        setSelectedCourse((prev) => (prev ? { ...prev, topics } : null));
      }
    } catch (err) {
      console.error("Error viewing course topics:", err);
    }
  };

  // Fetch courses and their topics from API
  const fetchCourses = async (): Promise<void> => {
    try {
      setLoading(true);
      const result = await CourseService.getAllCourses();
      const coursesData = result.data || [];

      // Initially we don't fetch topics for all courses to improve performance
      // Topics will be fetched when a user clicks on a specific course
      setCourses(coursesData);
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
  const handleCourseAdded = async (newCourse: Course): Promise<void> => {
    setCourses([...courses, newCourse]);
  };

  // Handle topic added
  const handleTopicAdded = async () => {
    if (selectedCourse) {
      const courseId = selectedCourse._id || selectedCourse.id;
      if (!courseId) return;

      // Refresh topics for the selected course
      const topics = await fetchTopicsForCourse(courseId);

      // Update course in state
      setCourses((prev) =>
        prev.map((c) =>
          c._id === courseId || c.id === courseId ? { ...c, topics } : c
        )
      );

      // Update selected course
      setSelectedCourse((prev) => (prev ? { ...prev, topics } : null));
    }
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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Back to courses list
  const backToCourses = () => {
    setSelectedCourse(null);
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
  const mapCourseToCardProps = (course: Course) => {
    return {
      id: course._id || course.id || "",
      title:
        course.name || course.title || course.subjectName || "Untitled Course",
      category: course.Level || course.category || "Unknown Category",
      lessons: course.numberOfLessons || course.lessons || 0,
      duration: course.duration || "0h",
      topics: course.topics || [],
      imageUrl: course.imageUrl || "/default-course-image.jpg",
      showSubject: course.showSubject !== undefined ? course.showSubject : true,
      onClickView: () => viewCourseTopics(course),
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
          {selectedCourse ? (
            // Topic View for selected course
            <>
              {/* Header with back button */}
              <div className="flex items-center mb-6 mt-10 md:mt-0">
                <Button
                  variant="ghost"
                  className="mr-2 p-2"
                  onClick={backToCourses}
                >
                  <ChevronLeft size={20} />
                </Button>
                <h1 className="text-2xl font-bold text-blue-900">
                  {selectedCourse.name ||
                    selectedCourse.title ||
                    selectedCourse.subjectName ||
                    "Topics"}
                </h1>
              </div>

              {/* Add Topic Button */}
              <div className="mb-6">
                <Dialog
                  open={topicDialogOpen}
                  onOpenChange={setTopicDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="bg-blue-900 hover:bg-blue-800">
                      <Plus className="h-4 w-4 mr-2" /> Add Topic
                    </Button>
                  </DialogTrigger>
                  <AddTopicDialog
                    open={topicDialogOpen}
                    onOpenChange={setTopicDialogOpen}
                    courseId={selectedCourse._id || selectedCourse.id || ""}
                    onTopicAdded={handleTopicAdded}
                  />
                </Dialog>
              </div>

              {/* Loading State for Topics */}
              {loadingTopics && (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-900"></div>
                </div>
              )}

              {/* Topics List */}
              {!loadingTopics &&
              selectedCourse.topics &&
              selectedCourse.topics.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedCourse.topics.map((topic, index) => (
                    <TopicCard
                      key={topic._id || topic.id || index}
                      topic={topic}
                      index={index}
                    />
                  ))}
                </div>
              ) : !loadingTopics ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    No topics found for this course. Add a new topic to get
                    started.
                  </p>
                </div>
              ) : null}
            </>
          ) : (
            // Courses View
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 mt-10 md:mt-0">
                <h1 className="text-2xl font-bold text-blue-900">SUBJECTS</h1>

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
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={fetchCourses}
                  >
                    Retry
                  </Button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    No courses found. Please try a different filter or add a new
                    course.
                  </p>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-900 hover:bg-blue-800">
                        <Plus className="h-4 w-4 mr-2" /> Add New Course
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

              {/* Course Grid */}
              {!loading && !error && filteredCourses.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course._id || course.id}
                      {...mapCourseToCardProps(course)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
