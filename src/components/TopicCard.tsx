import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Edit, Trash, Eye } from "lucide-react";

// Define the Topic interface
interface Topic {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  subscriptionPeriod?: string;
  price: number;
}

interface TopicCardProps {
  topic: Topic;
  index: number;
  onViewTopic: (topic: Topic) => void;
  onEditTopic: (topic: Topic) => void;
  onDeleteTopic: (topicId: string) => void;
  onViewContent: (topic: Topic) => void;
}

const ModernTopicCard: React.FC<TopicCardProps> = ({
  topic,
  index,
  onViewTopic,
  onEditTopic,
  onDeleteTopic,
  onViewContent,
}) => {
  return (
    <Card className="relative h-full overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 bg-white rounded-xl group">
      {/* Subtle gradient accent at the top */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>

      <CardHeader className="pt-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <BookOpen size={18} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-800">
                {topic.title || topic.name}
              </CardTitle>
              <Badge className="bg-blue-50 text-blue-600 font-medium rounded-full px-2.5 py-0.5 text-xs">
                Topic {index + 1}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <CardDescription className="text-sm text-gray-600 line-clamp-2 mb-4">
          {topic.description || "No description available"}
        </CardDescription>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-xs font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-gray-600">
              {topic.subscriptionPeriod || "Monthly"}
            </span>
          </div>
          {topic.price > 0 && (
            <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-sm">
              ${topic.price}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 pb-4 flex flex-col gap-3">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-70"></div>

        <div className="flex gap-2 w-full">
          <Button
            onClick={() => onViewTopic(topic)}
            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-0 flex items-center justify-center gap-1.5 rounded-lg py-1.5"
            size="sm"
          >
            <Eye size={14} />
            <span>View</span>
          </Button>

          <Button
            onClick={() => onEditTopic(topic)}
            className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border-0 flex items-center justify-center gap-1.5 rounded-lg py-1.5"
            size="sm"
          >
            <Edit size={14} />
            <span>Edit</span>
          </Button>

          <Button
            onClick={() => onDeleteTopic(topic._id || topic.id || "")}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border-0 flex items-center justify-center gap-1.5 rounded-lg py-1.5"
            size="sm"
          >
            <Trash size={14} />
            <span>Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ModernTopicCard;
