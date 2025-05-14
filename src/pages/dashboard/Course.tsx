import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, MessageSquare, RotateCcwIcon, ThumbsUp, TriangleAlert } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

const Course = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const [commentText, setCommentText] = useState("");
    const [isPaymentDialogVisible, setPaymentDialogVisible] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [courseData, setCourseData] = useState(null);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch course details
                //https://toto-academy-backend.onrender.com/api/v1/topic_in_subject/gettopicbysubjectid/681374c7a32332081e3da353
                const courseResponse = await axios.get(
                    `https://toto-academy-backend.onrender.com/api/v1/topic_in_subject/gettopicbysubjectid/${id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                // Fetch topics for this course
                const topicsResponse = await axios.get(
                    `https://toto-academy-backend.onrender.com/api/v1/topic_in_subject/gettopicbysubjectid/${id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                setCourseData(courseResponse.data.data);
                setTopics(topicsResponse.data.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, token]);

    const handleCommentSubmit = () => {
        if (!commentText.trim()) return;
        console.log("Submitting comment:", commentText);
        setCommentText("");
    };


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

                Loading course...
            </div>
        </div>;
    }

    if (error) {
        return <div className="min-h-[70vh] flex items-center justify-center ">
            <div className="text-center">
                <TriangleAlert className="h-32 w-32  mx-auto" />
                <h1 className="text-4xl font-bold mb-4">Error Loading Subject</h1>
                <p className="text-xl text-gray-600 mb-4">{error}</p>
                <div className="flex gap-3  mt-7">
                    <Button onClick={() => navigate(-1)} variant="ghost" className="mb-2">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Courses
                    </Button>
                    <Button onClick={() => window.location.reload()} variant="ghost" className="mb-2">
                        <RotateCcwIcon className="mr-2 h-4 w-4" />
                        Reload
                    </Button>

                </div>
            </div>
        </div>
    }


    if (!courseData) {
        return (
            <div className="max-w-screen-xl mx-auto py-4 md:py-6 flex justify-center items-center h-64">
                No course data available
            </div>
        );
    }

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
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                To access <strong>{selectedTopic?.title}</strong>, please complete the payment.
                            </p>

                            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <span>Price:</span>
                                    <span className="font-medium">${selectedTopic?.price}</span>
                                </div>
                                {selectedTopic?.regularPrice && (
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Regular Price:</span>
                                        <span className="line-through">${selectedTopic?.regularPrice}</span>
                                    </div>
                                )}
                                {selectedTopic?.subscriptionPeriod && (
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Subscription:</span>
                                        <span>{selectedTopic?.subscriptionPeriod}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setPaymentDialogVisible(false)}>
                                Cancel
                            </Button>
                            <Button onClick={() => alert("Payment successful!")}>
                                Pay Now (${selectedTopic?.price})
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </motion.div>
            </Dialog>

            <div className="mb-6">
                <Button onClick={() => navigate(-1)} variant="ghost" className="mb-2">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Courses
                </Button>
                <h1 className="text-2xl font-bold">{courseData.subjectName}</h1>
                <p className="text-muted-foreground">{courseData.Level}</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Main content */}
                <div className="w-full md:w-1/2">
                    <div className="sticky top-6">
                        <div className="bg-black aspect-square rounded-lg overflow-hidden mb-6">
                            <img
                                className="w-full h-full object-contain"
                                src={courseData.imageUrl || "/default-course.png"}
                                alt={courseData.subjectName}
                            />
                        </div>

                        <div className="p-4 bg-white dark:bg-background rounded-lg mt-4">
                            <div className="prose max-w-none">
                                <h3 className="text-xl font-semibold mb-4">Course Overview</h3>
                                <p className="mb-4">
                                    {courseData.description || "No description available for this course."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full md:w-1/2">
                    <div className="rounded-lg p-6 space-y-6 sticky top-6">
                        <div className="flex justify-between items-center">
                            <h1 className="font-bold md:text-6xl text-xl">Topics</h1>
                            <div>
                                <div className="bg-gray-50 p-4 px-6 rounded-full dark:bg-slate-900 text-2xl font-medium">
                                    <p>{topics.length}</p>
                                </div>
                            </div>
                        </div>
                        <hr />

                        <div>
                            <ul className="space-y-4">
                                {topics.map((topic, index) => (
                                    <li key={topic._id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-900 rounded-lg">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold">{`${index + 1}. ${topic.title}`}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {topic.description || "No description available"}
                                            </p>
                                            <div className="mt-2 flex items-center gap-4 text-sm">
                                                {topic.price > 0 && (
                                                    <span className="font-medium text-primary">
                                                        ${topic.price}
                                                    </span>
                                                )}
                                                {topic.regularPrice && topic.regularPrice > topic.price && (
                                                    <span className="text-muted-foreground line-through">
                                                        ${topic.regularPrice}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <Button asChild variant="outline" className="ml-4">
                                            {topic.price > 0 ? (
                                                <button
                                                    onClick={() => {
                                                        setSelectedTopic(topic);
                                                        setPaymentDialogVisible(true);
                                                    }}
                                                    className="whitespace-nowrap"
                                                >
                                                    Purchase
                                                </button>
                                            ) : (
                                                <Link to={`/courses/${id}/topic/${topic._id}`}>
                                                    Start Learning
                                                </Link>
                                            )}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Course;