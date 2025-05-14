import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";
import TopicInSubjectService from "@/services/Admin_Service/Topic_InSubject_service";

interface DeleteTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicId: string | null;
  topicTitle: string;
  onTopicDeleted: () => void;
}

const DeleteTopicDialog: React.FC<DeleteTopicDialogProps> = ({
  open,
  onOpenChange,
  topicId,
  topicTitle,
  onTopicDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!topicId) return;

    setIsDeleting(true);
    try {
      const result = await TopicInSubjectService.deleteTopic(topicId);
      console.log("Delete result:", result);

      toast({
        title: "Topic deleted",
        description: "The topic has been successfully deleted.",
      });

      onOpenChange(false);
      onTopicDeleted();
    } catch (error: any) {
      console.error("Failed to delete topic:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete topic. Please try again.";

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] mx-4 max-w-full p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 text-white">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            Delete Topic
          </DialogTitle>
        </div>

        <div className="p-6">
          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    This action cannot be undone. This will permanently delete
                    the topic and all associated content.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-6">
            Are you sure you want to delete the topic{" "}
            <span className="font-semibold">"{topicTitle}"</span>?
          </p>

          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p>
              All content and settings associated with this topic will be
              permanently removed from the system.
            </p>
          </div>
        </div>

        <DialogFooter className="bg-gray-50 p-4 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-end gap-2">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full sm:w-auto border-gray-300"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            variant="destructive"
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                Deleting...
              </span>
            ) : (
              "Delete Topic"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTopicDialog;
