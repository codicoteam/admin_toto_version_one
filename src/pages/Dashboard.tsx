
import { BookOpen, Calendar, DollarSign, PieChart } from "lucide-react";
import StatCard from "@/components/StatCard";
import SectionTitle from "@/components/SectionTitle";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  // Mock data for enrolled courses
  const enrolledCourses = [
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
      enrolled: true,
      progress: 65,
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
      enrolled: true,
      progress: 30,
    },
  ];

  // Mock upcoming lessons
  const upcomingLessons = [
    {
      id: "lesson1",
      title: "CSS Flexbox & Grid",
      course: "Introduction to Web Development",
      date: "Today, 2:00 PM",
      duration: "45 minutes"
    },
    {
      id: "lesson2",
      title: "Python Data Visualization",
      course: "Advanced Data Science with Python",
      date: "Tomorrow, 10:30 AM",
      duration: "60 minutes"
    },
    {
      id: "lesson3",
      title: "JavaScript Event Handling",
      course: "Introduction to Web Development",
      date: "Apr 25, 3:00 PM",
      duration: "45 minutes"
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
        <div className="w-full md:w-2/3">
          <div className="flex flex-col gap-4">
            <div className="bg-primary-foreground rounded-xl p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, Alex!</h1>
                  <p className="text-muted-foreground mt-1">Here's what's happening with your learning today.</p>
                </div>
                <div className="sm:ml-auto">
                  <Button>Resume Learning</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard
                title="Hours Learned"
                value="32"
                icon={<Clock className="h-5 w-5" />}
                trend={{ value: 12, positive: true }}
              />
              <StatCard
                title="Courses Enrolled"
                value="5"
                icon={<BookOpen className="h-5 w-5" />}
                trend={{ value: 20, positive: true }}
              />
              <StatCard
                title="Wallet Balance"
                value="$125.00"
                icon={<DollarSign className="h-5 w-5" />}
              />
              <StatCard
                title="Certificates"
                value="3"
                icon={<PieChart className="h-5 w-5" />}
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 bg-primary-foreground rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Upcoming Lessons</h3>
          <div className="space-y-3">
            {upcomingLessons.map((lesson) => (
              <div key={lesson.id} className="flex gap-3 p-3 rounded-lg border border-border">
                <div className="rounded-full bg-primary/10 p-3 h-11 w-11 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{lesson.title}</h4>
                  <p className="text-sm text-muted-foreground">{lesson.course}</p>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{lesson.date}</span>
                    <span>{lesson.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">View All Scheduled Lessons</Button>
        </div>
      </div>

      <SectionTitle
        title="Continue Learning"
        description="Pick up where you left off"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {enrolledCourses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}

        <Card className="flex flex-col justify-center items-center p-6 border-dashed">
          <CardContent className="text-center">
            <div className="rounded-full bg-muted p-4 mx-auto mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">Discover New Courses</h3>
            <p className="text-sm text-muted-foreground mb-4">Explore our catalog and find your next learning adventure</p>
            <Button variant="outline" asChild>
              <a href="/courses">Browse Courses</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Mock Clock component that should be imported from lucide-react
const Clock = ({ className }: { className: string }) => {
  return <div className={className}></div>;
};

// Mock Plus component that should be imported from lucide-react
const Plus = ({ className }: { className: string }) => {
  return <div className={className}></div>;
};

export default Dashboard;
