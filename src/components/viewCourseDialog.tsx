import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TopicInCourseService from "@/services/Admin_Service/Topic_InCourse_service";
import { useToast } from "@/components/ui/use-toast";

const ViewCourseDialog = ({ open, onOpenChange, course }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Only fetch topics when the dialog is open and we have a course
    if (open && course?.id) {
      fetchTopics(course.id);
    }
  }, [open, course]);

  const fetchTopics = async (courseId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await TopicInCourseService.getAllTopics(courseId);
      setTopics(result.data || []);
    } catch (err) {
      console.error("Failed to fetch topics:", err);
      setError("Failed to load topics. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load topics for this course.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] mx-4 max-w-full">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-900">
            {course?.title || "Course Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {course?.category || "Category"}
              </span>
              <div className="mt-2 text-sm text-gray-600">
                <span className="mr-4">{course?.lessons || 0} Lessons</span>
                <span>{course?.duration || "0h"}</span>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">Topics</h3>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
              <p>{error}</p>
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-md">
              <p className="text-gray-500">
                No topics available for this course
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {topics.map((topic, index) => (
                <div
                  key={topic._id || index}
                  className="p-4 bg-white border border-gray-200 rounded-md shadow-sm"
                >
                  <h4 className="font-medium">
                    {index + 1}. {topic.name || topic.title || "Untitled Topic"}
                  </h4>
                  {topic.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {topic.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewCourseDialog;
