import { useState } from "react";
import { Plus, X, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Dialog for adding a new topic
const AddTopicDialog = ({ open, onOpenChange, courseId, onTopicAdded }) => {
  const [topicName, setTopicName] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create new topic object
    const newTopic = {
      id: `topic-${Date.now()}`,
      name: topicName,
      description: topicDescription,
      duration: duration,
      courseId: courseId,
      status: "Pending", // Default status
    };

    // Pass the new topic up to parent component
    onTopicAdded(newTopic);

    // Reset form and close dialog
    setTopicName("");
    setTopicDescription("");
    setDuration("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] mx-4 max-w-full">
        <DialogHeader>
          <DialogTitle>Add New Topic</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="topicName">Topic Name</Label>
            <Input
              id="topicName"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="Enter topic name"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="topicDescription">Description</Label>
            <Textarea
              id="topicDescription"
              value={topicDescription}
              onChange={(e) => setTopicDescription(e.target.value)}
              placeholder="Topic description..."
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="30"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-2">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Add Topic
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main dialog for displaying course topics
export const CourseTopicsDialog = ({
  courseId,
  courseTitle,
  topics = [],
  open,
  onOpenChange,
}) => {
  const [localTopics, setLocalTopics] = useState(topics);
  const [addTopicDialogOpen, setAddTopicDialogOpen] = useState(false);

  // Handler for adding a new topic
  const handleTopicAdded = (newTopic) => {
    setLocalTopics([...localTopics, newTopic]);
  };

  // Generate dummy topics to fill grid if needed
  const getDisplayTopics = () => {
    // Start with existing topics
    const displayTopics = [...localTopics];

    // If we have less than 10 topics, add placeholder topics to fill the grid
    while (displayTopics.length < 10) {
      displayTopics.push({
        id: `placeholder-${displayTopics.length}`,
        name: `Topic ${displayTopics.length + 1} (Topic Name if any)`,
        duration: "0 hr",
        status: "Pending",
        isPlaceholder: true,
      });
    }

    return displayTopics;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl mx-4">
          {/* Custom header with back button */}
          <div className="flex items-center mb-4">
            <Button
              variant="outline"
              size="sm"
              className="mr-2"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Go Back
            </Button>

            <div className="flex flex-col ml-4">
              <h1 className="text-2xl font-bold">
                {courseTitle || "Course Name"}
              </h1>
              <div className="text-sm text-gray-500">
                Details
                <br />
                {courseTitle || "(Course Name)"}
                <br />
                ...............................
                <br />
                ...............................
                <br />
                ...............................
              </div>
            </div>
          </div>

          {/* Grid layout for topics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {getDisplayTopics().map((topic, index) => (
              <div
                key={topic.id || index}
                className="border rounded-md overflow-hidden bg-white flex flex-col"
              >
                {/* Topic content area */}
                <div className="h-32 bg-gray-100 flex items-center justify-center p-2">
                  {index === 1 ? (
                    <span className="text-center text-gray-500">No Pic</span>
                  ) : null}
                  {index === 8 ? (
                    <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center">
                      <span className="text-red-500">?</span>
                    </div>
                  ) : null}
                </div>

                {/* Topic info */}
                <div className="p-2 text-center">
                  <h3 className="text-sm font-medium truncate">{topic.name}</h3>
                </div>

                {/* Topic footer */}
                <div className="mt-auto flex flex-col gap-1 p-2">
                  <div className="flex justify-between items-center text-xs">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 px-2 py-1"
                    >
                      View Topic
                    </Button>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {topic.duration || "0.5 hr"}
                    </span>
                  </div>
                  <div className="w-full">
                    <div className="bg-red-500 text-white text-xs text-center py-1 rounded">
                      {topic.status || "Pending"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom controls */}
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => {}}>
              Load more topics
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {}}>
                Multi-Selection
              </Button>

              <Button onClick={() => setAddTopicDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" /> Add Topic
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Topic Dialog */}
      <AddTopicDialog
        open={addTopicDialogOpen}
        onOpenChange={setAddTopicDialogOpen}
        courseId={courseId}
        onTopicAdded={handleTopicAdded}
      />
    </>
  );
};
