import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Menu,
  X,
  ChevronLeft,
  BookOpen,
  Download,
  Eye,
  Trash2,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import TopicContentService from "@/services/Admin_Service/Topic_Content_service";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import Topic from "@/components/Interfaces/Topic_Interface";
import Subject from "@/components/Interfaces/Subject_Interface";
import ViewTopicContentDialog from "@/components/Dialogs/View_Content";
import TopicCard from "@/components/TopicCard";
import ViewTopicDialog from "@/components/Dialogs/View_topic";
import EditTopicDialog from "@/components/Dialogs/Edit_topic";
import DeleteTopicDialog from "@/components/Dialogs/Delet_topic";
import AddTopicDialog from "@/components/Dialogs/Add_topic";
import { supabase } from "@/helper/SupabaseClient";
import AddSubjectDialog from "@/components/Dialogs/Add__Subject";
import DeleteSubjectDialog from "@/components/Dialogs/Delete_Subject";
import EditSubjectDialog from "@/components/Dialogs/Edit_Subject";

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
  const [viewingTopic, setViewingTopic] = useState<Topic | null>(null);
  const [viewTopicDialogOpen, setViewTopicDialogOpen] =
    useState<boolean>(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [editTopicDialogOpen, setEditTopicDialogOpen] =
    useState<boolean>(false);
  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);
  const [deletingTopicTitle, setDeletingTopicTitle] = useState<string>("");
  const [deleteTopicDialogOpen, setDeleteTopicDialogOpen] =
    useState<boolean>(false);
  const [viewingContentTopic, setViewingContentTopic] = useState<Topic | null>(
    null
  );
  const [viewContentDialogOpen, setViewContentDialogOpen] =
    useState<boolean>(false);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State for subject deletion
  const [deletingSubjectId, setDeletingSubjectId] = useState<string | null>(
    null
  );
  const [deletingSubjectTitle, setDeletingSubjectTitle] = useState<string>("");
  const [deleteSubjectDialogOpen, setDeleteSubjectDialogOpen] =
    useState<boolean>(false);

  //editi subject
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editSubjectDialogOpen, setEditSubjectDialogOpen] =
    useState<boolean>(false);

  // State for viewing a specific subject's topics
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [loadingTopics, setLoadingTopics] = useState<boolean>(false);

  // Get unique levels from subjects
  const getUniqueLevels = (subjects: Subject[]): string[] => {
    const levels = subjects
      .map((subject) => subject.Level)
      .filter((level): level is string => !!level); // Filter out undefined/null/empty
    return Array.from(new Set(levels)); // Remove duplicates
  };

  // Generate tabs based on unique levels
  const generateTabs = (subjects: Subject[]) => {
    const uniqueLevels = getUniqueLevels(subjects);
    const baseTabs = [{ id: "all", label: "All" }];
    const levelTabs = uniqueLevels.map((level) => ({
      id: level,
      label: level,
    }));
    return [...baseTabs, ...levelTabs];
  };

  // Add these handler functions in your AdminSubjects component
  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setEditSubjectDialogOpen(true);
  };

  const handleSubjectUpdated = async (updatedSubject: Subject) => {
    // Create a more robust update that preserves existing subject data
    setSubjects((prevSubjects) =>
      prevSubjects.map((subject) => {
        // Check if this is the subject being updated
        const isTargetSubject =
          (subject._id &&
            updatedSubject._id &&
            subject._id === updatedSubject._id) ||
          (subject.id &&
            updatedSubject.id &&
            subject.id === updatedSubject.id) ||
          // Fallback comparison using multiple possible ID fields
          subject._id === updatedSubject.id ||
          subject.id === updatedSubject._id;

        if (isTargetSubject) {
          // Only update the target subject, preserving topics and other existing data
          return {
            ...subject, // Keep existing data (including topics)
            ...updatedSubject, // Apply updates
            // Ensure topics are preserved if they exist in the original subject
            topics: updatedSubject.topics || subject.topics,
            // Preserve the correct ID structure
            _id: subject._id || updatedSubject._id,
            id: subject.id || updatedSubject.id,
          };
        }

        // Return other subjects unchanged
        return subject;
      })
    );

    // Only update selectedSubject if it's the one being updated
    if (selectedSubject) {
      const isSelectedSubject =
        (selectedSubject._id &&
          updatedSubject._id &&
          selectedSubject._id === updatedSubject._id) ||
        (selectedSubject.id &&
          updatedSubject.id &&
          selectedSubject.id === updatedSubject.id) ||
        selectedSubject._id === updatedSubject.id ||
        selectedSubject.id === updatedSubject._id;

      if (isSelectedSubject) {
        setSelectedSubject({
          ...selectedSubject,
          ...updatedSubject,
          // Preserve topics from the selected subject
          topics: updatedSubject.topics || selectedSubject.topics,
          _id: selectedSubject._id || updatedSubject._id,
          id: selectedSubject.id || updatedSubject.id,
        });
      }
    }
  };

  // Handler for viewing a topic's content
  const handleViewContent = (topic: Topic) => {
    setViewingContentTopic(topic);
    setViewContentDialogOpen(true);
  };

  // Handler for viewing a topic's details
  const handleViewTopic = (topic: Topic) => {
    setViewingTopic(topic);
    setViewTopicDialogOpen(true);
  };

  // Handler for editing a topic
  const handleEditTopic = (topic: Topic) => {
    setEditingTopic(topic);
    setEditTopicDialogOpen(true);
  };

  // Handler for deleting a topic
  const handleDeleteTopic = (topicId: string) => {
    // Find topic by ID to get the title
    const topic = selectedSubject?.topics?.find(
      (t) => t._id === topicId || t.id === topicId
    );

    if (topic) {
      setDeletingTopicId(topicId);
      setDeletingTopicTitle(topic.title || topic.name || "this topic");
      setDeleteTopicDialogOpen(true);
    }
  };

  // Handler for deleting a subject
  const handleDeleteSubject = (subjectId: string) => {
    // Find subject by ID to get the title
    const subject = subjects.find(
      (s) => s._id === subjectId || s.id === subjectId
    );

    if (subject) {
      setDeletingSubjectId(subjectId);
      setDeletingSubjectTitle(
        subject.name || subject.title || subject.subjectName || "this subject"
      );
      setDeleteSubjectDialogOpen(true);
    }
  };

  // Handler for when a subject is deleted
  const handleSubjectDeleted = async () => {
    // Refresh the subjects list
    await fetchSubjects();
  };

  // Handler for when a topic is updated
  const handleTopicUpdated = async () => {
    if (selectedSubject) {
      const subjectId = selectedSubject._id || selectedSubject.id;
      if (!subjectId) return;

      // Refresh topics for the selected subject
      const topics = await fetchTopicsForSubject(subjectId);

      // Update subjects in state
      setSubjects((prev) =>
        prev.map((s) =>
          s._id === subjectId || s.id === subjectId ? { ...s, topics } : s
        )
      );

      // Update selected subject
      setSelectedSubject((prev) => (prev ? { ...prev, topics } : null));
    }
  };

  // Handler for when a topic is deleted
  const handleTopicDeleted = async () => {
    // Reuse the same function as for topic updates
    await handleTopicUpdated();
  };

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
      const t = toast({
        variant: "destructive",
        title: "Oops! Couldn’t Load Topics",
        description: "We couldn’t load the topics for this subject right now. Please try again.",
        duration: 8000,
        action: (
          <Button
            variant="secondary"
            className="bg-white text-red-600 hover:bg-red-100"
            onClick={() => t.dismiss()} // dismiss the toast safely
          >
            Dismiss
          </Button>
        ),
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
      const t = toast({
        variant: "destructive",
        title: "Oops! Couldn’t Load Subjects",
        description: "We couldn’t load the subjects right now. Please try again.",
        duration: 8000,
        action: (
          <Button
            variant="secondary"
            className="bg-white text-red-600 hover:bg-red-100"
            onClick={() => t.dismiss()} // dismiss the toast safely
          >
            Dismiss
          </Button>
        ),
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

  // Filter subjects based on active tab and search query
  const filteredSubjects = subjects.filter((subject) => {
    // Filter by tab category
    let matchesTab = false;

    if (activeTab === "all") {
      matchesTab = true;
    } else {
      // Filter by Level field (exact match)
      matchesTab = subject.Level === activeTab;
    }

    // Filter by search query (only check fields that exist in your model)
    const matchesSearch =
      !searchQuery ||
      (subject.subjectName &&
        subject.subjectName.toLowerCase().includes(searchQuery.toLowerCase()));

    // Filter by showSubject field
    const isVisible = subject.showSubject === true;

    return matchesTab && matchesSearch && isVisible;
  });

  // Map API subject data to the format expected by the SubjectCard component
  const mapSubjectToCardProps = (subject: Subject) => {
    const subjectId = subject._id || subject.id || "";

    return {
      id: subjectId,
      title: subject.subjectName || "Untitled Subject", // Use subjectName from model
      category: subject.Level || "Unknown Level", // Use Level from model
      lessons: subject.numberOfLessons || subject.lessons || 0,
      duration: subject.duration || "0h",
      topics: subject.topics || [],
      imageUrl:
        subject.imageUrl ||
        "https://media.istockphoto.com/id/1500285927/photo/young-woman-a-university-student-studying-online.jpg?s=612x612&w=0&k=20&c=yvFDnYMNEJ6WEDYrAaOOLXv-Jhtv6ViBRXSzJhL9S_k=",
      showSubject: subject.showSubject,
      onClickView: () => viewSubjectTopics(subject),
      onClickDelete: () => handleDeleteSubject(subjectId),
      onUpdate: () => handleEditSubject(subject),
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
        ${sidebarOpen
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
                      onViewTopic={handleViewTopic}
                      onEditTopic={handleEditTopic}
                      onDeleteTopic={handleDeleteTopic}
                      onViewContent={handleViewContent}
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

              {/* View Topic Dialog */}
              <Dialog
                open={viewTopicDialogOpen}
                onOpenChange={setViewTopicDialogOpen}
              >
                <ViewTopicDialog
                  open={viewTopicDialogOpen}
                  onOpenChange={setViewTopicDialogOpen}
                  topic={viewingTopic}
                />
              </Dialog>

              {/* Edit Topic Dialog */}
              <Dialog
                open={editTopicDialogOpen}
                onOpenChange={setEditTopicDialogOpen}
              >
                <EditTopicDialog
                  open={editTopicDialogOpen}
                  onOpenChange={setEditTopicDialogOpen}
                  topic={editingTopic}
                  onTopicUpdated={handleTopicUpdated}
                />
              </Dialog>
              {/* Delete Topic Confirmation Dialog */}
              <Dialog
                open={deleteTopicDialogOpen}
                onOpenChange={setDeleteTopicDialogOpen}
              >
                <DeleteTopicDialog
                  open={deleteTopicDialogOpen}
                  onOpenChange={setDeleteTopicDialogOpen}
                  topicId={deletingTopicId}
                  topicTitle={deletingTopicTitle}
                  onTopicDeleted={handleTopicDeleted}
                />
              </Dialog>
              {/* View Topic Content Dialog */}
              <Dialog
                open={viewContentDialogOpen}
                onOpenChange={setViewContentDialogOpen}
              >
                <ViewTopicContentDialog
                  open={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                  topic={selectedTopic}
                />
              </Dialog>
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
                  {generateTabs(subjects).map((tab) => (
                    <li key={tab.id}>
                      <button
                        className={`py-2 ${activeTab === tab.id
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

      {/* Delete Subject Dialog */}
      <Dialog
        open={deleteSubjectDialogOpen}
        onOpenChange={setDeleteSubjectDialogOpen}
      >
        <DeleteSubjectDialog
          open={deleteSubjectDialogOpen}
          onOpenChange={setDeleteSubjectDialogOpen}
          subjectId={deletingSubjectId}
          subjectTitle={deletingSubjectTitle}
          onSubjectDeleted={handleSubjectDeleted}
        />
      </Dialog>

      {/* Edit Subject Dialog */}
      <Dialog
        open={editSubjectDialogOpen}
        onOpenChange={setEditSubjectDialogOpen}
      >
        <EditSubjectDialog
          open={editSubjectDialogOpen}
          onOpenChange={setEditSubjectDialogOpen}
          subject={editingSubject}
          onSubjectUpdated={handleSubjectUpdated}
        />
      </Dialog>
    </div>
  );
};

export default AdminSubjects;