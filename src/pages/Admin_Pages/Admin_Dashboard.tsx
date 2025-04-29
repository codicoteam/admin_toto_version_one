import { BookOpen, Calendar, DollarSign, PieChart, Clock } from "lucide-react";
import StatCard from "@/components/StatCard";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar"; // Import the Sidebar component

const Admin_Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">
        <div className="w-full min-h-screen p-4 md:p-6">
          <div className="flex flex-col gap-6 mb-6">
            <div className="w-full">
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold">
                        ADMIN DASHBOARD
                      </h1>
                      <p className="text-muted-foreground mt-1">
                        Welcome back, Admin! Here's what's happening today.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  <StatCard
                    title="Total Students"
                    value="32"
                    icon={<Clock className="h-5 w-5" />}
                  />
                  <StatCard
                    title="Active Courses"
                    value="5"
                    icon={<BookOpen className="h-5 w-5" />}
                    trend={{ value: 20, positive: true }}
                  />
                  <StatCard
                    title="Revenue"
                    value="$12,500"
                    icon={<DollarSign className="h-5 w-5" />}
                  />
                  <StatCard
                    title="Completion Rate"
                    value="76%"
                    icon={<PieChart className="h-5 w-5" />}
                  />
                </div>
              </div>
            </div>
          </div>

          <SectionTitle title="Platform Overview" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8 ">
            <Card className="h-full p-4 md:p-6 border-dashed bg-blue-100">
              <h3 className="text-lg md:text-xl font-bold text-left">
                TOP STUDENTS
              </h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <span className="mr-2 font-bold">1.</span>
                  <span className="font-medium">John Smith</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 font-bold">2.</span>
                  <span className="font-medium">Sarah Johnson</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 font-bold">3.</span>
                  <span className="font-medium">Michael Williams</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 font-bold">4.</span>
                  <span className="font-medium">Emily Brown</span>
                </div>
              </div>
            </Card>

            <Card className="h-full p-4 md:p-6 border-dashed bg-blue-100">
              <h3 className="text-lg md:text-xl font-bold text-left">
                POPULAR COURSES
              </h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <span className="mr-2 font-bold">1.</span>
                  <span className="font-medium">Web Development</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 font-bold">2.</span>
                  <span className="font-medium">Data Science</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 font-bold">3.</span>
                  <span className="font-medium">UI/UX Design</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 font-bold">4.</span>
                  <span className="font-medium">Mobile Development</span>
                </div>
              </div>
            </Card>

            <Card className="h-full p-4 md:p-6 border-dashed bg-blue-100">
              <h3 className="text-lg md:text-xl font-bold text-left">
                UPCOMING EVENTS
              </h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <span className="mr-2 font-bold">Apr 30:</span>
                  <span className="font-medium">New Course Launch</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 font-bold">May 5:</span>
                  <span className="font-medium">Teacher Conference</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 font-bold">May 10:</span>
                  <span className="font-medium">Platform Update</span>
                </div>
              </div>
            </Card>

            <Card className="h-full p-4 md:p-6 border-dashed bg-blue-100">
              <h3 className="text-lg md:text-xl font-bold text-left">
                PLATFORM STATS
              </h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <span className="mr-2 font-bold">👥</span>
                  <span className="font-medium">95% User Satisfaction</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 font-bold">📈</span>
                  <span className="font-medium">32% Growth this month</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 font-bold">🔄</span>
                  <span className="font-medium">88% Retention Rate</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="mt-6">
            <SectionTitle
              title="Recent Course Activity"
              description="Latest updates from your courses"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              <Card className="flex flex-col h-full">
                <div className="bg-gray-200 h-40 rounded-t-lg"></div>
                <CardContent className="flex-1 p-4">
                  <h3 className="font-bold text-lg">Advanced React Patterns</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    15 new students enrolled this week
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
                  <h3 className="font-bold text-lg">
                    Data Science Fundamentals
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    8 new students enrolled this week
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
                    12 new students enrolled this week
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
                    6 new students enrolled this week
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
      </div>
    </div>
  );
};

export default Admin_Dashboard;
