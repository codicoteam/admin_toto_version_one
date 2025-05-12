import React, { useState } from "react";
import { FC } from "react";
import { Book, Clock, Pencil, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Topic {
  name?: string;
  title?: string;
  _id?: string;
  id?: string;
  description?: string;
}

interface SubjectCardProps {
  id: string;
  title?: string;
  category?: string;
  lessons?: number;
  duration?: string;
  topics?: Topic[];
  imageUrl?: string;
  showSubject?: boolean;
  onClickView?: () => void;
}

const SubjectCard: FC<SubjectCardProps> = ({
  id,
  title,
  category,
  lessons,
  duration,
  topics = [],
  imageUrl = "/default-course-image.jpg",
  showSubject = true,
  onClickView,
}) => {
  const [viewTopicsOpen, setViewTopicsOpen] = useState(false);

  const displayTitle = title || "Untitled Subject";
  const displayCategory = category || "Unknown Category";
  const displayLessons = lessons || 0;
  const displayDuration = duration || "0h";

  function setAddTopicOpen(arg0: boolean) {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full border border-gray-200">
        {/* Subject Image */}
        <div className="h-40 bg-gray-200 relative">
          <img
            src={imageUrl}
            alt={displayTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              const imgElement = e.target as HTMLImageElement;
              imgElement.src = "/default-course-image.jpg";
            }}
          />
          <div className="absolute top-3 left-3 bg-blue-900 text-white text-xs px-2 py-1 rounded-md">
            {displayCategory}
          </div>
        </div>

        {/* Subject Content */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-2 text-blue-900">
            {displayTitle}
          </h3>

          {/* Subject Meta */}
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
              <p className="text-sm text-gray-500 italic">
                No topics available
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={async () => {
                if (onClickView) await onClickView(); // 🔁 fetch topics from backend
                setViewTopicsOpen(true); // 👁 then open dialog
              }}
              variant="outline"
              className="flex-1"
            >
              View Topics
            </Button>
          </div>
        </div>
      </div>

      {/* View Topics Dialog */}
      <Dialog open={viewTopicsOpen} onOpenChange={setViewTopicsOpen}>
        <DialogContent className="sm:max-w-[700px] mx-4 max-w-full">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-xl">
              {displayTitle} - Topics
            </DialogTitle>
            <Button
              onClick={() => {
                setViewTopicsOpen(false);
                setAddTopicOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Topic
            </Button>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="bg-blue-900 text-white px-3 py-1 text-sm rounded">
                  {displayCategory}
                </span>
                <span className="ml-3 text-sm text-gray-600">
                  {displayLessons} Lessons • {displayDuration}
                </span>
              </div>
            </div>

            {topics && topics.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-lg text-gray-800">
                    Subject Topics
                  </h3>
                  <span className="text-sm text-gray-500">
                    {topics.length} topics
                  </span>
                </div>

                <div className="max-h-[450px] overflow-y-auto pr-2">
                  {topics.map((topic, index) => (
                    <div
                      key={topic._id || topic.id || index}
                      className="bg-gray-50 p-4 rounded-md mb-3 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium text-base">
                          {index + 1}.{" "}
                          {topic.name || topic.title || `Topic ${index + 1}`}
                        </h4>
                        <div className="flex gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit Topic"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            title="Delete Topic"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {topic.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {topic.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-md">
                <Book className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-gray-500 mb-2">
                  No topics available for this subject
                </p>
                <div className="flex gap-3 justify-center mt-4">
                  <Button
                    onClick={() => {
                      setViewTopicsOpen(false);
                      setAddTopicOpen(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add First Topic
                  </Button>
                  <Link to={`/admin/subjects/${id}`}>
                    <Button className="bg-blue-900 hover:bg-blue-800" size="sm">
                      Go to Subject Details
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setViewTopicsOpen(false)}
                className="bg-blue-900 hover:bg-blue-800"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubjectCard;
