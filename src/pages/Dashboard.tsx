import { BookOpen, Calendar, DollarSign, PieChart, Clock } from "lucide-react";
import StatCard from "@/components/StatCard";
import SectionTitle from "@/components/SectionTitle";
import CourseCard from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen p-4 md:p-6">
      <div className="flex flex-col gap-6 mb-6">
        <div className="w-full">
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">DASHBOARD</h1>
                  <p className="text-muted-foreground mt-1">
                    Here's what's happening .
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <StatCard
                title="Students"
                value="32"
                icon={<Clock className="h-5 w-5" />}
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
      </div>

      <SectionTitle
        title="Activity Overview"
        // description="Pick up where you left off"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8 ">
        <Card className="h-full p-4 md:p-6 border-dashed bg-blue-200">
          <h3 className="text-lg md:text-xl font-bold text-left">
            TOP STUDENTS
          </h3>
          <div className="mt-4 space-y-2">
            {/* Student list items */}
            <div className="flex items-center">
              <span className="mr-2 font-bold">1.</span>
              <span className="font-medium">STUDENT NAME</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 font-bold">2.</span>
              <span className="font-medium">STUDENT NAME</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 font-bold">3.</span>
              <span className="font-medium">STUDENT NAME</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 font-bold">4.</span>
              <span className="font-medium">STUDENT NAME</span>
            </div>
          </div>
        </Card>

        <Card className="h-full p-4 md:p-6 border-dashed bg-blue-200">
          <h3 className="text-lg md:text-xl font-bold text-left">
            TOP ENROLLED COURSES
          </h3>
          <div className="mt-4 space-y-2">
            {/* Course list items */}
            <div className="flex items-center">
              <span className="mr-2 font-bold">1.</span>
              <span className="font-medium">Course 1</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 font-bold">2.</span>
              <span className="font-medium">Course 2</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 font-bold">3.</span>
              <span className="font-medium">Course 3</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 font-bold">4.</span>
              <span className="font-medium">Course 4</span>
            </div>
          </div>
        </Card>

        <Card className="h-full p-4 md:p-6 border-dashed bg-blue-200">
          <h3 className="text-lg md:text-xl font-bold text-left">
            UPCOMING DEADLINES
          </h3>
          <div className="mt-4 space-y-2">
            {/* Deadline list items */}
            <div className="flex items-center">
              <span className="mr-2 font-bold">Apr 30:</span>
              <span className="font-medium">JavaScript Final Project</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 font-bold">May 5:</span>
              <span className="font-medium">UI Design Assignment</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 font-bold">May 10:</span>
              <span className="font-medium">Python Quiz</span>
            </div>
          </div>
        </Card>

        <Card className="h-full p-4 md:p-6 border-dashed bg-blue-200">
          <h3 className="text-lg md:text-xl font-bold text-left">
            RECENT ACHIEVEMENTS
          </h3>
          <div className="mt-4 space-y-2">
            {/* Achievement list items */}
            <div className="flex items-center">
              <span className="mr-2 font-bold">🏆</span>
              <span className="font-medium">Completed React Course</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 font-bold">🌟</span>
              <span className="font-medium">Perfect Score on Quiz</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 font-bold">📊</span>
              <span className="font-medium">30-Day Streak</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <SectionTitle
          title="Recommended Courses"
          description="Courses we think you'll love based on your interests"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {/* Add recommendation course cards here */}
          <Card className="flex flex-col h-full">
            <div className="bg-gray-200 h-40 rounded-t-lg"></div>
            <CardContent className="flex-1 p-4">
              <h3 className="font-bold text-lg">Advanced React Patterns</h3>
              <p className="text-sm text-gray-600 mt-2">
                Master complex React patterns and techniques
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-bold">$89.99</span>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full">
            <div className="bg-gray-200 h-40 rounded-t-lg"></div>
            <CardContent className="flex-1 p-4">
              <h3 className="font-bold text-lg">Data Science Fundamentals</h3>
              <p className="text-sm text-gray-600 mt-2">
                Introduction to key data science concepts
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-bold">$79.99</span>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full">
            <div className="bg-gray-200 h-40 rounded-t-lg"></div>
            <CardContent className="flex-1 p-4">
              <h3 className="font-bold text-lg">UI/UX Design Principles</h3>
              <p className="text-sm text-gray-600 mt-2">
                Learn essential design skills for digital products
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-bold">$69.99</span>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full">
            <div className="bg-gray-200 h-40 rounded-t-lg"></div>
            <CardContent className="flex-1 p-4">
              <h3 className="font-bold text-lg">Mobile App Development</h3>
              <p className="text-sm text-gray-600 mt-2">
                Build cross-platform mobile applications
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-bold">$99.99</span>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
