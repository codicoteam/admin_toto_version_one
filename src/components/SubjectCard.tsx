import React, { useState } from "react";
import { FC } from "react";
import {
  Book,
  Clock,
  Pencil,
  Plus,
  Trash2,
  Eye,
  Edit,
  ExternalLink,
  BookOpen,
} from "lucide-react";
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
  onDelete?: () => void;
  onUpdate?: () => void;
}

const ModernSubjectCard: FC<SubjectCardProps> = ({
  id,
  title,
  category,
  lessons,
  duration,
  topics = [],
  imageUrl = "https://media.istockphoto.com/id/1500285927/photo/young-woman-a-university-student-studying-online.jpg?s=612x612&w=0&k=20&c=yvFDnYMNEJ6WEDYrAaOOLXv-Jhtv6ViBRXSzJhL9S_k=",
  showSubject = true,
  onClickView,
  onDelete,
  onUpdate,
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
      <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full border border-gray-100 hover:shadow-xl transition-all duration-300 group relative">
        {/* Gradient accent line */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-500"></div>

        {/* Subject Image with gradient overlay */}
        <div className="h-48 relative overflow-hidden">
          <img
            src={imageUrl}
            alt={displayTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const imgElement = e.target as HTMLImageElement;
              imgElement.src = "/default-course-image.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-medium flex items-center">
            {displayCategory}
          </div>

          {/* Title positioned at the bottom of image for better visibility */}
          <h3 className="absolute bottom-4 left-4 right-4 font-bold text-lg text-white drop-shadow-md line-clamp-2">
            {displayTitle}
          </h3>
        </div>

        {/* Subject Content */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Subject Meta */}
          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4 pt-1">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-2">
                <Book className="w-4 h-4 text-blue-600" />
              </div>
              <span className="font-medium">{displayLessons} Lessons</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-2">
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="font-medium">{displayDuration}</span>
            </div>
          </div>

          {/* Topics */}
          <div className="mb-6 flex-grow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700 flex items-center">
                <BookOpen className="w-4 h-4 mr-1.5 text-gray-500" />
                Topics
              </p>
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                {topics.length} total
              </span>
            </div>

            {topics && topics.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {topics.slice(0, 3).map((topic, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-xs px-3 py-1.5 rounded-full border border-blue-100/50"
                  >
                    {topic.name || topic.title || `Topic ${index + 1}`}
                  </span>
                ))}
                {topics.length > 3 && (
                  <span className="text-xs font-medium bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full border border-gray-100/50">
                    +{topics.length - 3} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic bg-gray-50 rounded-lg p-3 text-center">
                No topics available
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 mt-auto pt-2">
            <Button
              onClick={async () => {
                if (onClickView) await onClickView();
                setViewTopicsOpen(true);
              }}
              variant="outline"
              className="flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border-0 py-2 rounded-lg"
            >
              <Eye size={16} />
              <span>View</span>
            </Button>

            <Button
              onClick={onUpdate}
              variant="outline"
              className="flex items-center justify-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border-0 py-2 rounded-lg"
            >
              <Edit size={16} />
              <span>Edit</span>
            </Button>

            <Button
              onClick={onDelete}
              variant="outline"
              className="flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border-0 py-2 rounded-lg"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </Button>
          </div>
        </div>
      </div>

      {/* View Topics Dialog - modernized */}
      <Dialog open={viewTopicsOpen} onOpenChange={setViewTopicsOpen}>
        <DialogContent className="sm:max-w-[700px] mx-4 max-w-full rounded-xl border-0 shadow-2xl">
          <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
            <DialogTitle className="text-xl font-bold text-gray-800">
              {displayTitle} - Topics
            </DialogTitle>
            <Button
              onClick={() => {
                setViewTopicsOpen(false);
                setAddTopicOpen(true);
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center gap-2 rounded-lg"
            >
              <Plus className="h-4 w-4" />
              Add Topic
            </Button>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center justify-between mb-6 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 text-sm rounded-full font-medium">
                  {displayCategory}
                </span>
                <div className="ml-4 flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Book className="w-4 h-4 mr-1.5 text-indigo-500" />
                    <span>{displayLessons} Lessons</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1.5 text-indigo-500" />
                    <span>{displayDuration}</span>
                  </div>
                </div>
              </div>
            </div>

            {topics && topics.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-800 flex items-center">
                    <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                    Subject Topics
                  </h3>
                  <span className="text-sm px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium">
                    {topics.length} topics
                  </span>
                </div>

                <div className="max-h-[450px] overflow-y-auto pr-2 space-y-3">
                  {topics.map((topic, index) => (
                    <div
                      key={topic._id || topic.id || index}
                      className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-base text-gray-800 flex items-center">
                          <span className="flex items-center justify-center bg-blue-100 text-blue-700 rounded-full h-6 w-6 text-xs mr-2">
                            {index + 1}
                          </span>
                          {topic.name || topic.title || `Topic ${index + 1}`}
                        </h4>
                        <div className="flex gap-2">
                          <button
                            className="text-amber-500 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 p-1.5 rounded-lg transition-colors"
                            title="Edit Topic"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-lg transition-colors"
                            title="Delete Topic"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      {topic.description && (
                        <p className="text-sm text-gray-600 mt-2 ml-8">
                          {topic.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-b from-gray-50 to-white rounded-xl border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-2">
                  No topics available for this subject
                </p>
                <p className="text-gray-500 text-sm max-w-md mx-auto">
                  Add your first topic to start organizing your subject content
                </p>
                <div className="flex gap-3 justify-center mt-6">
                  <Button
                    onClick={() => {
                      setViewTopicsOpen(false);
                      setAddTopicOpen(true);
                    }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add First Topic
                  </Button>
                  <Link to={`/admin/subjects/${id}`}>
                    <Button
                      className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 rounded-lg flex items-center gap-2"
                      size="sm"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Subject Details
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end pt-4 border-t">
              <Button
                onClick={() => setViewTopicsOpen(false)}
                className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 rounded-lg"
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

export default ModernSubjectCard;
