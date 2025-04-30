import { useState } from "react";
import SectionTitle from "@/components/SectionTitle";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter } from "lucide-react";

const CoursesHome = () => {

    const [activeTab, setActiveTab] = useState("all");

    // Mock course data
    const courses = [
        {
            id: "1",
            title: "Introduction to Web Development",
            instructor: {
                name: "Sarah Johnson",
                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
            thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            category: "Programming",
            lessonsCount: 12,
            duration: "6 hours",
        },
        {
            id: "2",
            title: "Advanced Data Science with Python",
            instructor: {
                name: "Michael Chen",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
            thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            category: "Data Science",
            lessonsCount: 18,
            duration: "10 hours",
        },
        {
            id: "3",
            title: "User Experience Design Fundamentals",
            instructor: {
                name: "Emily Rodriguez",
                avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
            thumbnailUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            category: "Design",
            lessonsCount: 10,
            duration: "5 hours",
        },
        {
            id: "4",
            title: "Digital Marketing Strategies",
            instructor: {
                name: "Robert Smith",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
            thumbnailUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            category: "Marketing",
            lessonsCount: 15,
            duration: "8 hours",
        },
        {
            id: "5",
            title: "Mobile App Development with React Native",
            instructor: {
                name: "David Kim",
                avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
            thumbnailUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            category: "Programming",
            lessonsCount: 20,
            duration: "12 hours",
        },
        {
            id: "6",
            title: "Business Analytics and Intelligence",
            instructor: {
                name: "Lisa Wang",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
            },
            thumbnailUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            category: "Business",
            lessonsCount: 14,
            duration: "7 hours",
        },
    ];

    // Filter courses based on active tab
    const filteredCourses = activeTab === "all"
        ? courses
        : courses.filter(course => course.category.toLowerCase() === activeTab);

    return (
        <div className=" max-w-screen-xl  mx-auto my-16"    >
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

            <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all">All Categories</TabsTrigger>
                    <TabsTrigger value="programming">Programming</TabsTrigger>
                    <TabsTrigger value="data science">Data Science</TabsTrigger>
                    <TabsTrigger value="design">Design</TabsTrigger>
                    <TabsTrigger value="business">Business</TabsTrigger>
                    <TabsTrigger value="marketing">Marketing</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                    <CourseCard key={course.id} {...course} />
                ))}
            </div>
        </div>
    );
};


export default CoursesHome