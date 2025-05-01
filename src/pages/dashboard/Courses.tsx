
import { useEffect, useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";

const Courses = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Mock course data
  const courses = [
    {
      id: "0",
      title: "Physics",
      thumbnailUrl: "/physics.png",
      category: "Advanced Level",
      lessonsCount: 12,
      duration: "6 hours",
    },
    {
      id: "1",
      title: "English Language",
      thumbnailUrl: "/english.png",
      category: "Ordinary Level",
      lessonsCount: 12,
      duration: "6 hours",
    },
    {
      id: "2",
      title: "Maths",
      thumbnailUrl: "/maths.png",
      category: "Advanced Level",
      lessonsCount: 12,
      duration: "6 hours",
    },
    {
      id: "3",
      title: "Accounts",
      thumbnailUrl: "/accounts.png",
      category: "Ordinary Level",
      lessonsCount: 12,
      duration: "6 hours",
    },
    {
      id: "4",
      title: "Religious Studies",
      thumbnailUrl: "/religious.png",
      category: "Primary School",
      lessonsCount: 12,
      duration: "6 hours",
    },
    {
      id: "5",
      title: "Chemistry",
      thumbnailUrl: "/chemistry.png",
      category: "Ordinary Level",
      lessonsCount: 12,
      duration: "6 hours",
    },
    {
      id: "6",
      title: "Biology",
      thumbnailUrl: "/biology.png",
      category: "Ordinary Level",
      lessonsCount: 12,
      duration: "6 hours",
    },
    {
      id: "7",
      title: "Shona Language",
      thumbnailUrl: "/shona.png",
      category: "Ordinary Level",
      lessonsCount: 12,
      duration: "6 hours",
    },
  ];

  const [filteredCourses, setFilteredCourses] = useState([])
  useEffect(() => {
    const filterd = activeTab === "all"
      ? courses
      : courses.filter(course => course.category.toLowerCase() === activeTab);
    setFilteredCourses(filterd);
  }, [activeTab])


  return (
    <div className="md:py-6 py-4">
      <SectionTitle
        title="Course Catalog"
        description="Explore our extensive collection of courses"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search courses..." className="pl-10 w-full sm:w-[240px]" />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </SectionTitle>

      <Tabs defaultValue="all" className=" sticky top-0 bg-white dark:bg-slate-950 z-20 py-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Categories</TabsTrigger>
          <TabsTrigger value="primary school">Primary School</TabsTrigger>
          <TabsTrigger value="ordinary level">Ordinary Level</TabsTrigger>
          <TabsTrigger value="advanced level">Advanced Level</TabsTrigger>
          <TabsTrigger value="tertiary education">Tertiary Education</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  );
};

export default Courses;
