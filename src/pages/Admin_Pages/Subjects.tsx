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
import SubjectCard from "@/components/SubjectCard";
import SubjectService from "@/services/Admin_Service/Subject_service";
import TopicInSubjectService from "@/services/Admin_Service/Topic_InSubject_service";
import { useToast } from "@/components/ui/use-toast";

// Define interfaces for your data types
interface Topic {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  description?: string;
  subjectId?: string;
  subject_id?: string;
  order?: number;
}

interface Subject {
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

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubjectAdded: (subject: Subject) => void;
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

// AddSubjectDialog Component
const AddSubjectDialog: React.FC<AddSubjectDialogProps> = ({
  open,
  onOpenChange,
  onSubjectAdded,
}) => {
  const [subjectData, setSubjectData] = useState({
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
    setSubjectData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setSubjectData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!subjectData.title || !subjectData.category) {
        throw new Error("Subject title and category are required");
      }

      // Format data for API
      const apiSubjectData = {
        name: subjectData.title.trim(),
        category: subjectData.category,
        numberOfLessons: parseInt(subjectData.lessons) || 0,
        duration: subjectData.duration || "0h",
        description: subjectData.description || "",
        // Properly format the enum values
        subjectName: subjectData.title.trim(), // Using title as subject name
        Level: getCategoryLabel(subjectData.category), // Map category to Level enum value
        showSubject: true,
        // Include any other required fields
        imageUrl: "", // Default image path
      };

      console.log("Sending subject data to API:", apiSubjectData);

      // Call API to create subject
      const result = await SubjectService.createSubject(apiSubjectData);
      console.log("API response:", result);

      // Notify parent component about the new subject
      onSubjectAdded(result.data);

      // Show success message
      toast({
        title: "Subject created",
        description: "The subject has been created successfully.",
      });

      // Reset form and close dialog
      setSubjectData({
        title: "",
        category: "",
        lessons: "",
        duration: "",
        description: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create subject:", error);
      // Improved error handling to extract more specific error messages
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create subject. Please try again.";

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
        <DialogTitle>Add New Subject</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Subject Title</Label>
          <Input
            id="title"
            value={subjectData.title}
            onChange={handleChange}
            placeholder="Enter subject title"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            onValueChange={handleCategoryChange}
            value={subjectData.category}
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
              value={subjectData.lessons}
              onChange={handleChange}
              placeholder="10"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="duration">Duration (hours)</Label>
            <Input
              id="duration"
              value={subjectData.duration}
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
            value={subjectData.description}
            onChange={handleChange}
            placeholder="Subject description..."
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="thumbnail">Subject Thumbnail</Label>
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
            {isSubmitting ? "Creating..." : "Create Subject"}
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
  subjectId: string;
  onTopicAdded: () => void;
}> = ({ open, onOpenChange, subjectId, onTopicAdded }) => {
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
        subject_id: subjectId, // Using subjectId as subject_id
      };

      const result = await TopicInSubjectService.createTopic(apiTopicData);

      toast({
        title: "Topic created",
        description: "The topic has been added to this subject.",
      });

      setTopicData({
        title: "",
        description: "",
        order: 0,
      });
      onOpenChange(false);
      onTopicAdded();
    } catch (error) {
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
            The order in which this topic appears in the subject
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

const AdminSubjects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [topicDialogOpen, setTopicDialogOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { toast } = useToast();

  // State for viewing a specific subject's topics
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [loadingTopics, setLoadingTopics] = useState<boolean>(false);

  // Fetch topics for a specific subject
  const fetchTopicsForSubject = async (subjectId: string): Promise<Topic[]> => {
    try {
      setLoadingTopics(true);
      // Use getTopicsBySubjectId to filter topics by subject ID
      const result = await TopicInSubjectService.getTopicsBySubjectId(
        subjectId
      );
      console.log(`Topics for subject ${subjectId}:`, result);
      return result.data || [];
    } catch (err) {
      console.error(`Failed to fetch topics for subject ${subjectId}:`, err);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load topics for this subject. Please try again.`,
      });
      return [];
    } finally {
      setLoadingTopics(false);
    }
  };

  // Function to view a specific subject's topics
  const viewSubjectTopics = async (subject: Subject) => {
    const subjectId = subject._id || subject.id;
    if (!subjectId) return;

    try {
      setSelectedSubject(subject);
      // If topics are already fetched, no need to fetch again
      if (!subject.topics || subject.topics.length === 0) {
        const topics = await fetchTopicsForSubject(subjectId);
        // Update the subject in state with fetched topics
        setSubjects((prev) =>
          prev.map((s) =>
            s._id === subjectId || s.id === subjectId ? { ...s, topics } : s
          )
        );
        // Also update the selected subject
        setSelectedSubject((prev) => (prev ? { ...prev, topics } : null));
      }
    } catch (err) {
      console.error("Error viewing subject topics:", err);
    }
  };

  // Fetch subjects and their topics from API
  const fetchSubjects = async (): Promise<void> => {
    try {
      setLoading(true);
      const result = await SubjectService.getAllSubjects();
      const subjectsData = result.data || [];

      // Initially we don't fetch topics for all subjects to improve performance
      // Topics will be fetched when a user clicks on a specific subject
      setSubjects(subjectsData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
      setError("Failed to load subjects. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load subjects. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load of subjects
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Add subject handler
  const handleSubjectAdded = async (newSubject: Subject): Promise<void> => {
    setSubjects([...subjects, newSubject]);
  };

  // Handle topic added
  const handleTopicAdded = async () => {
    if (selectedSubject) {
      const subjectId = selectedSubject._id || selectedSubject.id;
      if (!subjectId) return;

      // Refresh topics for the selected subject
      const topics = await fetchTopicsForSubject(subjectId);

      // Update subject in state
      setSubjects((prev) =>
        prev.map((s) =>
          s._id === subjectId || s.id === subjectId ? { ...s, topics } : s
        )
      );

      // Update selected subject
      setSelectedSubject((prev) => (prev ? { ...prev, topics } : null));
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

  // Back to subjects list
  const backToSubjects = () => {
    setSelectedSubject(null);
  };

  // Tabs based on the design with categories
  const tabs = [
    { id: "all", label: "All" },
    { id: "popular", label: "Popular Subjects" },
    { id: "o-level", label: "O' Level" },
    { id: "a-level", label: "A' Level" },
    { id: "tertiary", label: "Tertiary" },
  ];

  // Filter subjects based on active tab and search query
  const filteredSubjects = subjects.filter((subject) => {
    // First filter by tab category
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "popular"
        ? subject.isPopular
        : subject.category === activeTab;

    // Then filter by search query if one exists
    const matchesSearch = searchQuery
      ? subject.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.subjectName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        subject.description?.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesTab && matchesSearch;
  });

  // Map API subject data to the format expected by the SubjectCard component
  const mapSubjectToCardProps = (subject: Subject) => {
    return {
      id: subject._id || subject.id || "",
      title:
        subject.name ||
        subject.title ||
        subject.subjectName ||
        "Untitled Subject",
      category: subject.Level || subject.category || "Unknown Category",
      lessons: subject.numberOfLessons || subject.lessons || 0,
      duration: subject.duration || "0h",
      topics: subject.topics || [],
      imageUrl: subject.imageUrl || "/default-subject-image.jpg",
      showSubject:
        subject.showSubject !== undefined ? subject.showSubject : true,
      onClickView: () => viewSubjectTopics(subject),
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
          {selectedSubject ? (
            // Topic View for selected subject
            <>
              {/* Header with back button */}
              <div className="flex items-center mb-6 mt-10 md:mt-0">
                <Button
                  variant="ghost"
                  className="mr-2 p-2"
                  onClick={backToSubjects}
                >
                  <ChevronLeft size={20} />
                </Button>
                <h1 className="text-2xl font-bold text-blue-900">
                  {selectedSubject.name ||
                    selectedSubject.title ||
                    selectedSubject.subjectName ||
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
                    subjectId={selectedSubject._id || selectedSubject.id || ""}
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
              selectedSubject.topics &&
              selectedSubject.topics.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedSubject.topics.map((topic, index) => (
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
                    No topics found for this subject. Add a new topic to get
                    started.
                  </p>
                </div>
              ) : null}
            </>
          ) : (
            // Subjects View
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

                  {/* Add Subject Button */}
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-900 hover:bg-blue-800 w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" /> Add Subject
                      </Button>
                    </DialogTrigger>
                    <AddSubjectDialog
                      open={dialogOpen}
                      onOpenChange={setDialogOpen}
                      onSubjectAdded={handleSubjectAdded}
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
                    onClick={fetchSubjects}
                  >
                    Retry
                  </Button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && filteredSubjects.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    No subjects found. Please try a different filter or add a
                    new subject.
                  </p>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-900 hover:bg-blue-800">
                        <Plus className="h-4 w-4 mr-2" /> Add New Subject
                      </Button>
                    </DialogTrigger>
                    <AddSubjectDialog
                      open={dialogOpen}
                      onOpenChange={setDialogOpen}
                      onSubjectAdded={handleSubjectAdded}
                    />
                  </Dialog>
                </div>
              )}

              {/* Subject Grid */}
              {!loading && !error && filteredSubjects.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSubjects.map((subject) => (
                    <SubjectCard
                      key={subject._id || subject.id}
                      {...mapSubjectToCardProps(subject)}
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

export default AdminSubjects;
