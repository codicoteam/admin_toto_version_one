import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, MessageSquare, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"; // Import Dialog components
import { motion } from "framer-motion"; // Import motion for animation

const Course = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("content");
    const [commentText, setCommentText] = useState("");
    const [isPaymentDialogVisible, setPaymentDialogVisible] = useState(false); // Add state for payment dialog
    const [selectedTopic, setSelectedTopic] = useState(null); // Add state for selected topic

    // Mock lesson data
    const lessonData = {
        id: "0",
        title: "Physics",
        thumbnailUrl: "/physics.png",
        category: "Advanced Level",
        lessonsCount: 12,
        duration: "6 hours",
        description: "In this lesson, you'll learn the fundamentals of CSS Flexbox and Grid layout systems. We'll explore how to create responsive layouts using these powerful CSS features.",
        progress: 95,
        lessonNumber: 3,
        topics: [
            { id: "1", title: "Introduction to Physics", price: 0, isSubscribed: true },
            { id: "2", title: "Newton's Laws of Motion", price: 10, isSubscribed: false },
            { id: "3", title: "Work, Energy, and Power", price: 15, isSubscribed: false },
            { id: "4", title: "Gravitation", price: 20, isSubscribed: true },
            { id: "5", title: "Thermodynamics", price: 25, isSubscribed: false },
            { id: "6", title: "Waves and Oscillations", price: 30, isSubscribed: true },
            { id: "7", title: "Optics", price: 35, isSubscribed: false },
            { id: "8", title: "Electricity and Magnetism", price: 40, isSubscribed: true },
            { id: "9", title: "Modern Physics", price: 45, isSubscribed: false },
            { id: "10", title: "Quantum Mechanics", price: 50, isSubscribed: false },
            { id: "11", title: "Relativity", price: 55, isSubscribed: true },
            { id: "12", title: "Astrophysics", price: 60, isSubscribed: false },
            { id: "13", title: "Nuclear Physics", price: 65, isSubscribed: true },
            { id: "14", title: "Particle Physics", price: 70, isSubscribed: false },
            { id: "15", title: "Fluid Mechanics", price: 75, isSubscribed: true },
            { id: "16", title: "Thermal Physics", price: 80, isSubscribed: false },
            { id: "17", title: "Acoustics", price: 85, isSubscribed: true },
            { id: "18", title: "Electromagnetic Waves", price: 90, isSubscribed: false },
            { id: "19", title: "Solid State Physics", price: 95, isSubscribed: true },
            { id: "20", title: "Plasma Physics", price: 100, isSubscribed: false },
        ],
        totalLessons: 20,
        comments: [
            {
                id: "comment1",
                user: {
                    name: "Alex Thompson",
                    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                },
                text: "Great explanation of Flexbox! I finally understand how to use it properly for my projects.",
                timestamp: "2 hours ago",
                likes: 5,
            },
            {
                id: "comment2",
                user: {
                    name: "Jamie Lee",
                    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                },
                text: "Could you explain the difference between flex-basis and width in more detail? I'm still confused about when to use each.",
                timestamp: "1 day ago",
                likes: 2,
            },
            {
                id: "comment3",
                user: {
                    name: "Chris Evans",
                    avatar: "https://images.unsplash.com/photo-1502767089025-6572583495b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                },
                text: "This lesson was very helpful. Thanks for the detailed examples!",
                timestamp: "3 days ago",
                likes: 8,
            },
            {
                id: "comment4",
                user: {
                    name: "Taylor Swift",
                    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
                },
                text: "Can you add more examples on Grid layout? That would be awesome!",
                timestamp: "5 days ago",
                likes: 3,
            },
        ],
    };

    const handleCommentSubmit = () => {
        if (!commentText.trim()) return;
        console.log("Submitting comment:", commentText);
        setCommentText("");
        // In a real app, you'd add the comment to the list
    };
    return (
        <div className="max-w-screen-xl mx-auto py-4 md:py-6">
            {/* Payment Dialog */}
            <Dialog open={isPaymentDialogVisible} onOpenChange={setPaymentDialogVisible}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Payment Required</DialogTitle>
                        </DialogHeader>
                        <p className="text-sm text-muted-foreground">
                            To access <strong>{selectedTopic?.title}</strong>, please complete the payment of ${selectedTopic?.price}.
                        </p>

                        <div className="mt-4">
                            <h4 className="text-lg font-semibold mb-2">Your Balance</h4>
                            <p className="text-sm text-muted-foreground">
                                Current Balance: <strong>$50.00</strong>
                            </p>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setPaymentDialogVisible(false)}>Cancel</Button>
                            <Button onClick={() => alert("Payment successful!")}>Pay Now -${selectedTopic?.price}</Button>
                        </DialogFooter>
                    </DialogContent>
                </motion.div>
            </Dialog>
            <div className="mb-6">
                <Button variant="ghost" className="mb-2">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Courses
                </Button>
                <h1 className="text-2xl font-bold">{lessonData.title}</h1>
                <p className="text-muted-foreground">{lessonData.title}</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Main content */}
                <div className="w-full md:w-1/2 ">
                    <div className="sticky top-6">

                        <div className="bg-black aspect-square rounded-lg overflow-hidden mb-6">
                            <img
                                className="w-full h-full object-contain"
                                src={lessonData.thumbnailUrl}
                            />
                        </div>

                        {/* Lesson content tabs */}


                        <div className="p-4 bg-white dark:bg-background rounded-lg mt-4">
                            <div className="prose max-w-none">
                                <h3 className="text-xl font-semibold mb-4">Lesson Overview</h3>
                                <p className="mb-4">{lessonData.description}</p>
                                <h4 className="text-lg font-semibold mb-2">What you'll learn:</h4>
                                <ul className="list-disc pl-5 mb-4 space-y-1">
                                    <li>Understand the CSS Flexbox layout model</li>
                                    <li>Learn how to create flexible and responsive designs</li>
                                    <li>Master Flexbox properties like justify-content, align-items, and flex-grow</li>
                                    <li>Compare Flexbox and Grid layout systems</li>
                                    <li>Build complex layouts using CSS Grid</li>
                                </ul>
                                <h4 className="text-lg font-semibold mb-2">Additional Resources:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>
                                        <a href="#" className="text-primary hover:underline">Flexbox Cheatsheet</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-primary hover:underline">CSS Grid Guide</a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-primary hover:underline">Practice Exercises</a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-1/2">
                    <div className="rounded-lg p-6 space-y-6 sticky top-6">
                        <div className="flex justify-between items-center">
                            <h1 className=" font-bold md:text-6xl text-xl">Topics</h1>
                            <div>
                                <div className="bg-gray-50 p-4 px-6 rounded-full dark:bg-slate-900 text-2xl font-medium"><p>{lessonData.topics.length}</p></div>
                            </div>
                        </div>
                        <hr />

                        <div>
                            <ul className="space-y-4">
                                {lessonData.topics.map((topic, ind) => (
                                    <li key={topic.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                                        <div>
                                            <h3 className="text-lg font-semibold">{`${ind + 1} ${topic.title}`}</h3>
                                            <p className="text-sm text-muted-foreground">Price: ${topic.price}</p>
                                        </div>
                                        <Button asChild variant="outline" >
                                            {topic.isSubscribed ?
                                                <Link to={`/courses/244/topic/${topic.id}`}>
                                                    Study
                                                </Link>
                                                : <button
                                                    onClick={() => {
                                                        setSelectedTopic(topic); // Set selected topic
                                                        setPaymentDialogVisible(true); // Show payment dialog
                                                    }}
                                                >
                                                    Get
                                                </button>
                                            }
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    )
}

export default Course