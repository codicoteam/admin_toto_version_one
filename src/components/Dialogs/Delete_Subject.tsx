import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import SubjectService from "@/services/Admin_Service/Subject_service";

export interface DeleteSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectId: string | null;
  subjectTitle: string;
  onSubjectDeleted: () => void;
}

const DeleteSubjectDialog: React.FC<DeleteSubjectDialogProps> = ({
  open,
  onOpenChange,
  subjectId,
  subjectTitle,
  onSubjectDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!subjectId) return;

    setIsDeleting(true);

    try {
      // Call the delete API
      await SubjectService.deleteSubject(subjectId);

      // Show success message
      toast({
        title: "Subject deleted",
        description: "The subject has been deleted successfully.",
      });

      // Notify parent component
      onSubjectDeleted();

      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to delete subject:", error);

      // Extract error message
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete subject. Please try again.";

      // Show error message
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
    <DialogContent className="sm:max-w-[425px] mx-4 max-w-full">
      <DialogHeader>
        <DialogTitle>Delete Subject</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete <strong>{subjectTitle}</strong>? This
          action cannot be undone.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="w-full sm:w-auto"
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={handleDelete}
          className="w-full sm:w-auto"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete Subject"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteSubjectDialog;
