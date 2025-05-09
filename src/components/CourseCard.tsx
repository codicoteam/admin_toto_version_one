import React from "react";
import { FC } from "react";
import { Book, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Topic {
  name?: string;
  title?: string;
  _id?: string;
  id?: string;
}

interface CourseCardProps {
  id: string;
  title?: string;
  category?: string;
  lessons?: number;
  duration?: string;
  topics?: Topic[];
  imageUrl?: string;
  showSubject?: boolean;
}

const CourseCard: FC<CourseCardProps> = ({
  id,
  title,
  category,
  lessons,
  duration,
  topics = [],
  imageUrl = "/default-course-image.jpg",
  showSubject = true,
}) => {
  // Ensure we have valid data to display
  const displayTitle = title || "Untitled Course";
  const displayCategory = category || "Unknown Category";
  const displayLessons = lessons || 0;
  const displayDuration = duration || "0h";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-gray-200">
      {/* Course Image */}
      <div className="h-40 bg-gray-200 relative">
        <img
          src={imageUrl}
          alt={displayTitle}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Type assertion to tell TypeScript this is an HTMLImageElement
            const imgElement = e.target as HTMLImageElement;
            imgElement.src = "/default-course-image.jpg";
          }}
        />
        <div className="absolute top-3 left-3 bg-blue-900 text-white text-xs px-2 py-1 rounded-md">
          {displayCategory}
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-2 text-blue-900">{displayTitle}</h3>

        {/* Course Meta */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center">
            <Book className="w-4 h-4 mr-1" />
            <span>{displayLessons} Lessons</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{displayDuration}</span>
          </div>
        </div>

        {/* Topics */}
        <div className="mb-4 flex-grow">
          <p className="text-sm font-medium mb-2 text-gray-700">Topics:</p>
          {topics && topics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {topics.slice(0, 3).map((topic, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {topic.name || topic.title || `Topic ${index + 1}`}
                </span>
              ))}
              {topics.length > 3 && (
                <span className="text-xs text-blue-700">
                  +{topics.length - 3} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No topics available</p>
          )}
        </div>

        {/* Action Button */}
        <Link to={`/admin/courses/${id}`}>
          <Button className="w-full bg-blue-900 hover:bg-blue-800">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;
