// src/pages/Exams.tsx
import { useEffect, useState, useMemo } from "react";
import SectionTitle from "@/components/SectionTitle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, TriangleAlert, Plus, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import ExamCard from "@/components/exam_card";
import ExamService from "@/services/Admin_Service/exams_services";
import Sidebar from "@/components/Sidebar";

const Exams = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await ExamService.getAllExams();
        setExams(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch exams");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [token]);

  // Get unique exam levels for tabs
  const availableLevels = useMemo(() => {
    const levels = new Set<string>();
    exams.forEach(exam => {
      if (exam.level) {
        levels.add(exam.level.toLowerCase());
      }
    });
    return Array.from(levels);
  }, [exams]);

  // Filter exams based on active tab and search term
  const filteredExams = useMemo(() => {
    let result = exams;
    
    // Filter by active tab
    if (activeTab !== "all") {
      result = result.filter(exam => {
        const examLevel = exam.level?.toLowerCase() || '';
        return examLevel === activeTab;
      });
    }
    
    // Fixed search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(exam => 
        exam.title.toLowerCase().includes(term)
      );
    }
    
    return result;
  }, [exams, activeTab, searchTerm]);

  if (loading) {
    return <div className="justify-center items-center py-[10vh] text-center gap-11">
      <div className="flex justify-center items-center">
        <div className="loader">
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
          <div className="loader-square"></div>
        </div>
      </div>
      <div className="pt-10">
        Loading exams...
      </div>
    </div>;
  }

  if (error) {
    return <div className="min-h-[70vh] flex items-center justify-center ">
      <div className="text-center">
        <TriangleAlert className="h-32 w-32  mx-auto" />
        <h1 className="text-4xl font-bold mb-4">Error Loading Exams</h1>
        <p className="text-xl text-gray-600 mb-4">{error}</p>
        <a href="/exams" className="text-blue-500 hover:text-blue-700 underline">
          reload
        </a>
      </div>
    </div>
  }

  // Function to format level names for display
  const formatLevelName = (level: string) => {
    const levelMap: Record<string, string> = {
      'primary school': 'Primary School',
      'ordinary level': 'Ordinary Level',
      'advanced level': 'Advanced Level',
      'tertiary education': 'Tertiary Education'
    };
    return levelMap[level] || level.charAt(0).toUpperCase() + level.slice(1);
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
          <SectionTitle
            title="Exams Catalog"
            description="Browse and manage all available exams"
          >
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Input 
                  placeholder="Search exams by title..." 
                  className="pl-10 w-full sm:w-[240px]" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" /> Clear
              </Button>
              <Button asChild className="flex items-center gap-2">
                <Link to="/createExam">
                  <Plus className="h-4 w-4" /> Add Exam
                </Link>
              </Button>
            </div>
          </SectionTitle>

          {availableLevels.length > 0 && (
            <Tabs defaultValue="all" className="sticky top-0 bg-white dark:bg-slate-950 z-20 py-4" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Levels</TabsTrigger>
                {availableLevels.map(level => (
                  <TabsTrigger key={level} value={level}>
                    {formatLevelName(level)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}

          {filteredExams.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredExams.map(exam => (
                <ExamCard
                  key={exam._id}
                  id={exam._id}
                  title={exam.title}
                  subjectName={exam.subject?.subjectName || "Unknown Subject"}
                  level={exam.level}
                  durationInMinutes={exam.durationInMinutes}
                  thumbnailUrl={exam.subject?.imageUrl || "/default-exam.png"}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <TriangleAlert className="h-24 w-24 text-yellow-500 mb-6" />
              <h3 className="text-2xl font-semibold mb-2">No Exams Found</h3>
              <p className="text-gray-600 text-center max-w-md">
                {searchTerm
                  ? `No exams match your search for "${searchTerm}"`
                  : "No exams available for the selected filters"}
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => {
                  setSearchTerm("");
                  setActiveTab("all");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exams;