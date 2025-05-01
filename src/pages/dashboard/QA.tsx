
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Search, ThumbsUp, CheckCircle } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";

const QA = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Mock Q&A data
  const questions = [
    {
      id: "q1",
      title: "How do I implement flexbox in a responsive layout?",
      body: "I'm trying to create a responsive navbar using flexbox but can't figure out how to make it stack vertically on mobile. Any suggestions?",
      user: {
        name: "Alex Thompson",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      course: "Introduction to Web Development",
      timestamp: "2 hours ago",
      answers: 3,
      likes: 5,
      solved: true,
      tags: ["CSS", "Flexbox", "Responsive Design"],
    },
    {
      id: "q2",
      title: "Difference between useEffect and useLayoutEffect?",
      body: "I've noticed React has both useEffect and useLayoutEffect hooks. When should I use one over the other?",
      user: {
        name: "Jamie Lee",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      course: "Advanced React",
      timestamp: "1 day ago",
      answers: 2,
      likes: 7,
      solved: false,
      tags: ["React", "Hooks", "JavaScript"],
    },
    {
      id: "q3",
      title: "How to calculate moving average in Python?",
      body: "I need to calculate a 7-day moving average for a time series dataset in Python. What's the most efficient way to do this?",
      user: {
        name: "Sarah Wilson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      course: "Data Analysis with Python",
      timestamp: "3 days ago",
      answers: 5,
      likes: 12,
      solved: true,
      tags: ["Python", "Data Science", "Statistics"],
    },
    {
      id: "q4",
      title: "Best practices for API authentication?",
      body: "I'm building a RESTful API and need advice on the best authentication method. Should I use JWT, session tokens, or OAuth?",
      user: {
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      },
      course: "Backend Development",
      timestamp: "5 days ago",
      answers: 8,
      likes: 15,
      solved: false,
      tags: ["API", "Security", "Authentication"],
    },
  ];

  // Filter questions based on active tab
  const filteredQuestions = activeTab === "all"
    ? questions
    : activeTab === "solved"
      ? questions.filter(q => q.solved)
      : questions.filter(q => !q.solved);

  return (
    <div className="py-4 md:py-6">
      <SectionTitle
        title="Q&A Forum"
        description="Get answers from instructors and fellow students"
      >
        <Button>Ask a Question</Button>
      </SectionTitle>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search questions..." className="pl-10" />
        </div>

        <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">All Questions</TabsTrigger>
            <TabsTrigger value="solved">Solved</TabsTrigger>
            <TabsTrigger value="unsolved">Unsolved</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Questions list */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <div key={question.id} className="bg-white rounded-lg p-5 border border-border hover:shadow-card transition-shadow">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={question.user.avatar} />
                <AvatarFallback>{question.user.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-medium hover:text-primary cursor-pointer">{question.title}</h3>
                  {question.solved && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Solved
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{question.body}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs font-normal bg-secondary/50">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span>Posted by {question.user.name}</span>
                  <span>in {question.course}</span>
                  <span>{question.timestamp}</span>

                  <div className="ml-auto flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{question.answers} answers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>{question.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QA;
