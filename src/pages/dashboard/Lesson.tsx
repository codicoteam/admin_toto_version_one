
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, MessageSquare, ThumbsUp } from "lucide-react";
import { useState } from "react";

const Lesson = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("content");
  const [commentText, setCommentText] = useState("");

  // Mock lesson data
  const lessonData = {
    id: "1",
    title: "CSS Flexbox & Grid",
    courseTitle: "Introduction to Web Development",
    instructor: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    description: "In this lesson, you'll learn the fundamentals of CSS Flexbox and Grid layout systems. We'll explore how to create responsive layouts using these powerful CSS features.",
    progress: 35,
    lessonNumber: 3,
    totalLessons: 12,
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
    ],
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    console.log("Submitting comment:", commentText);
    setCommentText("");
    // In a real app, you'd add the comment to the list
  };

  return (
    <div className="max-w-6xl mx-auto py-4 md:py-6">
      <div className="mb-6">
        <Button variant="ghost" className="mb-2">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Course
        </Button>
        <h1 className="text-2xl font-bold">{lessonData.title}</h1>
        <p className="text-muted-foreground">{lessonData.courseTitle}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main content */}
        <div className="w-full md:w-2/3">
          {/* Video player */}
          <div className="bg-black aspect-video rounded-lg overflow-hidden mb-6">
            <video
              className="w-full h-full object-contain"
              controls
              src={lessonData.videoUrl}
              poster="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=450&q=80"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Lesson content tabs */}
          <Tabs defaultValue="content" className="mb-8" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="comments">
                Comments
                <span className="ml-1 bg-muted text-muted-foreground text-xs py-0.5 px-1.5 rounded-full">
                  {lessonData.comments.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="p-4 bg-white rounded-lg mt-4">
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
            </TabsContent>

            <TabsContent value="comments" className="p-4 bg-white rounded-lg mt-4">
              {/* Comment form */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Discussion</h3>
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" />
                    <AvatarFallback>YA</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add a comment..."
                      className="mb-3 resize-none"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <Button onClick={handleCommentSubmit}>Comment</Button>
                  </div>
                </div>
              </div>

              {/* Comments list */}
              <div className="space-y-6">
                {lessonData.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.user.avatar} />
                      <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{comment.user.name}</h4>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm mb-2">{comment.text}</p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                          <ThumbsUp className="h-3 w-3" />
                          <span>{comment.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                          <MessageSquare className="h-3 w-3" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/3">
          <div className="bg-white rounded-lg p-6 space-y-6 sticky top-6">
            {/* Course progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Course Progress</span>
                <span>{lessonData.progress}%</span>
              </div>
              <Progress value={lessonData.progress} className="h-2" />
            </div>

            {/* Instructor */}
            <div>
              <h3 className="font-semibold mb-3">Your Instructor</h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={lessonData.instructor.avatar} />
                  <AvatarFallback>{lessonData.instructor.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{lessonData.instructor.name}</h4>
                  <p className="text-sm text-muted-foreground">Web Development Instructor</p>
                </div>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold mb-3">Lesson Navigation</h3>
              <div className="flex justify-between">
                <Button variant="outline" disabled={lessonData.lessonNumber === 1}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button disabled={lessonData.lessonNumber === lessonData.totalLessons}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Resources */}
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-primary hover:underline text-sm flex items-center gap-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                      <polyline points="13 2 13 9 20 9"></polyline>
                    </svg>
                    Lesson Slides (PDF)
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline text-sm flex items-center gap-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <path d="M8 10v8m4-8v8"></path>
                    </svg>
                    Code Examples (ZIP)
                  </a>
                </li>
                <li>
                  <a href="#" className="text-primary hover:underline text-sm flex items-center gap-2">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    External Resources
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;
