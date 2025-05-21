import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import TopicContentService from "@/services/Admin_Service/Topic_Content_service";
import { supabase } from "@/helper/SupabaseClient";
import { Upload, FileType, X } from "lucide-react";

export interface AddTopicContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topicId: string;
  onContentAdded: (content: any) => void;
}

const AddTopicContentDialog: React.FC<AddTopicContentDialogProps> = ({
  open,
  onOpenChange,
  topicId,
  onContentAdded,
}) => {
  const [contentData, setContentData] = useState({
    title: "",
    description: "",
    file_type: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setContentData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileTypeChange = (value: string) => {
    setContentData((prev) => ({ ...prev, file_type: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create preview for image files
      if (selectedFile.type.startsWith("image/")) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          if (event.target) {
            setFilePreview(event.target.result as string);
          }
        };
        fileReader.readAsDataURL(selectedFile);
      } else {
        // For non-image files, just display file name
        setFilePreview(null);
      }
    }
  };

  const uploadFileToSupabase = async (file: File, fileType: string) => {
    try {
      if (!file) return null;

      // Create appropriate folder structure in Supabase based on file type
      let folder = "topic_content";

      // Add file type subfolder for better organization
      if (fileType) {
        folder = `${folder}/${fileType.toLowerCase()}`;
      }

      // Create a unique file name
      const fileName = `${folder}/${Date.now()}_${file.name}`;

      // Upload file to the Supabase bucket
      const { data, error } = await supabase.storage
        .from("totoacademy") // Replace with your bucket name
        .upload(fileName, file);

      if (error) {
        throw new Error(`Error uploading file: ${error.message}`);
      }

      // Get the public URL of the uploaded file
      const { data: publicData } = supabase.storage
        .from("totoacademy") // Replace with your bucket name
        .getPublicUrl(fileName);

      if (publicData) {
        return publicData.publicUrl;
      }

      return null;
    } catch (error) {
      console.error("Error in file upload:", error);
      throw error;
    }
  };

  const resetForm = () => {
    setContentData({
      title: "",
      description: "",
      file_type: "",
    });
    setFile(null);
    setFilePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!contentData.title || !contentData.file_type || !topicId) {
        throw new Error("Title, file type, and topic ID are required");
      }

      if (!file) {
        throw new Error("Please select a file to upload");
      }

      // Upload the file to Supabase and get the URL
      const uploadedFileUrl = await uploadFileToSupabase(
        file,
        contentData.file_type
      );

      if (!uploadedFileUrl) {
        throw new Error("Failed to upload file");
      }

      // Format data for API
      const apiContentData = {
        title: contentData.title.trim(),
        description: contentData.description.trim(),
        file_type: contentData.file_type,
        file_path: uploadedFileUrl,
        topicId: topicId,
      };

      console.log("Sending content data to API:", apiContentData);

      // Call API to create content
      const result = await TopicContentService.createTopicContent(
        apiContentData
      );
      console.log("API response:", result);

      // Notify parent component about the new content
      onContentAdded(result.data);

      // Show success message
      toast({
        title: "Content added",
        description: "The content has been added successfully.",
      });

      // Reset form and close dialog
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add content:", error);
      // Improved error handling to extract more specific error messages
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to add content. Please try again.";

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileAcceptTypes = () => {
    switch (contentData.file_type?.toLowerCase()) {
      case "video":
        return "video/*";
      case "pdf":
        return ".pdf";
      case "document":
        return ".doc,.docx,.txt,.rtf";
      default:
        return "*/*";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] mx-4 max-w-full">
        <DialogHeader>
          <DialogTitle>Add Topic Content</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Content Title</Label>
            <Input
              id="title"
              value={contentData.title}
              onChange={handleChange}
              placeholder="Enter content title"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={contentData.description}
              onChange={handleChange}
              placeholder="Enter a brief description of this content"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="file_type">File Type</Label>
            <Select
              onValueChange={handleFileTypeChange}
              value={contentData.file_type}
              required
            >
              <SelectTrigger id="file_type">
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PDF">PDF</SelectItem>
                <SelectItem value="Video">Video</SelectItem>
                <SelectItem value="Document">Document</SelectItem>
                <SelectItem value="Image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="file">Upload File</Label>
            <div className="border-2 border-dashed border-green-200 rounded-md p-4">
              {!file ? (
                <div className="text-center py-8">
                  <Upload size={36} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500 mb-4">
                    {contentData.file_type
                      ? `Upload a ${contentData.file_type.toLowerCase()} file`
                      : "Select a file type first"}
                  </p>
                  <Input
                    id="file"
                    type="file"
                    accept={getFileAcceptTypes()}
                    onChange={handleFileChange}
                    required={!file}
                    className="hidden"
                    disabled={!contentData.file_type}
                  />
                  <label
                    htmlFor="file"
                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                      contentData.file_type
                        ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Choose File
                  </label>
                </div>
              ) : (
                <div className="relative bg-white p-4 rounded-md border border-gray-200">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                    onClick={() => {
                      setFile(null);
                      setFilePreview(null);
                    }}
                  >
                    <X size={14} />
                  </Button>

                  <div className="flex items-center">
                    <FileType size={24} className="text-green-600 mr-3" />
                    <div className="overflow-hidden">
                      <p className="font-medium text-gray-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>

                  {filePreview && (
                    <div className="mt-4">
                      <img
                        src={filePreview}
                        alt="File preview"
                        className="max-h-40 max-w-full object-contain"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
            <Button
              type="button"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              variant="outline"
              className="w-full sm:w-auto"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white"
              disabled={isSubmitting || !file || !contentData.file_type}
            >
              {isSubmitting ? "Uploading..." : "Add Content"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTopicContentDialog;
