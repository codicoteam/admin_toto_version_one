import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from "@/helper/SupabaseClient"; // Import Supabase client
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Download,
  Eye,
  Plus,
  X,
  Edit,
  Trash2,
  AlertCircle,
  Upload,
  File,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import TopicContentService from "@/services/Admin_Service/Topic_Content_service";
import Topic from "@/components/Interfaces/Topic_Interface";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ContentFormData {
  title: string;
  description: string;
  file_path: string[];
  file_type: "video" | "audio" | "document";
  Topic: string;
}

interface ViewTopicContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: Topic | null;
}

// Define file type extensions mapping
const fileTypeExtensions = {
  video: [".mp4", ".avi", ".mov", ".wmv", ".mkv", ".webm"],
  audio: [".mp3", ".wav", ".ogg", ".m4a", ".flac", ".aac"],
  document: [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".txt"],
};

const ViewTopicContentDialog: React.FC<ViewTopicContentDialogProps> = ({
  open,
  onOpenChange,
  topic,
}) => {
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Create dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);
  const [newContent, setNewContent] = useState<ContentFormData>({
    title: "",
    description: "",
    file_path: [],
    file_type: "document",
    Topic: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Update dialog state
  const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);
  const [contentToUpdate, setContentToUpdate] = useState<any>(null);
  const [uploadedFilesForUpdate, setUploadedFilesForUpdate] = useState<File[]>(
    []
  );

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [contentToDelete, setContentToDelete] = useState<string | null>(null);

  // File input refs
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const updateFileInputRef = React.useRef<HTMLInputElement>(null);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchTopicContents = async () => {
      if (!topic) return;
      const topicId = topic._id || topic.id;
      if (!topicId) return;

      try {
        setLoading(true);
        setError(null);
        const result = await TopicContentService.getTopicContentByTopicId(
          topicId
        );
        setContents(result.data || []);
      } catch (error) {
        console.error("Failed to fetch topic contents:", error);
        setError("Failed to load topic contents. Please try again.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load topic contents. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (open && topic) {
      fetchTopicContents();
    }
  }, [open, topic, toast]);

  // Initialize new content form with topic ID when dialog opens
  useEffect(() => {
    if (topic) {
      setNewContent((prev) => ({
        ...prev,
        Topic: topic._id || topic.id || "",
      }));
    }
  }, [topic]);

  // Reset file inputs when file type changes
  useEffect(() => {
    setUploadedFiles([]);
  }, [newContent.file_type]);

  useEffect(() => {
    if (contentToUpdate) {
      setUploadedFilesForUpdate([]);
    }
  }, [contentToUpdate?.file_type]);

  // Function to upload files to Supabase
  const uploadFilesToSupabase = async (files: File[]) => {
    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        // Create a unique file name
        const fileName = `${Date.now()}_${file.name}`;

        // Upload file to the Supabase bucket
        const { data, error } = await supabase.storage
          .from("totoacademy") // Use your bucket name
          .upload(fileName, file);

        if (error) {
          throw new Error(`Error uploading file: ${error.message}`);
        }

        // Get the public URL of the uploaded file
        const { data: publicData } = supabase.storage
          .from("totoacademy") // Use your bucket name
          .getPublicUrl(fileName);

        if (publicData) {
          uploadedUrls.push(publicData.publicUrl);
        }
      }

      return uploadedUrls;
    } catch (error) {
      console.error("Error in file upload:", error);
      throw error;
    }
  };

  // File upload handlers
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    isUpdate = false
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    if (isUpdate) {
      setUploadedFilesForUpdate((prev) => [...prev, ...files]);

      // Create preview URLs for UI display only
      const previewUrls = files.map((file) => URL.createObjectURL(file));

      // For updating, we temporarily store the preview URLs
      // These will be replaced with actual Supabase URLs when form is submitted
      setContentToUpdate((prev) => ({
        ...prev,
        file_path: [...prev.file_path, ...previewUrls],
      }));
    } else {
      setUploadedFiles((prev) => [...prev, ...files]);

      // Create preview URLs for UI display only
      const previewUrls = files.map((file) => URL.createObjectURL(file));

      // We're just setting preview URLs for display
      // Real URLs will be set when form is submitted
      setNewContent((prev) => ({
        ...prev,
        file_path: [...prev.file_path, ...previewUrls],
      }));
    }
  };

  const removeFile = (index: number, isUpdate = false) => {
    if (isUpdate) {
      setUploadedFilesForUpdate((prev) => prev.filter((_, i) => i !== index));
      setContentToUpdate((prev) => ({
        ...prev,
        file_path: prev.file_path.filter((_, i) => i !== index),
      }));
    } else {
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
      setNewContent((prev) => ({
        ...prev,
        file_path: prev.file_path.filter((_, i) => i !== index),
      }));
    }
  };

  const getAcceptedFileTypes = (fileType: string) => {
    return fileTypeExtensions[fileType as keyof typeof fileTypeExtensions].join(
      ","
    );
  };

  const triggerFileInput = (isUpdate = false) => {
    if (isUpdate) {
      updateFileInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleCreateContent = async () => {
    try {
      setIsSubmitting(true);

      // Form validation
      if (
        !newContent.title.trim() ||
        !newContent.description.trim() ||
        uploadedFiles.length === 0
      ) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description:
            "Please fill all required fields and upload at least one file",
        });
        return;
      }

      // Upload files to Supabase and get public URLs
      const uploadedUrls = await uploadFilesToSupabase(uploadedFiles);

      if (uploadedUrls.length === 0) {
        throw new Error("Failed to upload files");
      }

      // Prepare content data with real file paths from Supabase
      const contentToCreate = {
        ...newContent,
        file_path: uploadedUrls,
      };

      await TopicContentService.createTopicContent(contentToCreate);

      // Refresh content list
      if (topic) {
        const topicId = topic._id || topic.id;
        const result = await TopicContentService.getTopicContentByTopicId(
          topicId
        );
        setContents(result.data || []);
      }

      toast({
        title: "Success",
        description: "Content created successfully",
      });

      // Reset form and close dialog
      setNewContent({
        title: "",
        description: "",
        file_path: [],
        file_type: "document",
        Topic: topic ? topic._id || topic.id : "",
      });
      setUploadedFiles([]);
      setCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to create content. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateContent = async () => {
    if (!contentToUpdate || !contentToUpdate._id) return;

    try {
      setIsSubmitting(true);

      // Form validation
      if (
        !contentToUpdate.title.trim() ||
        !contentToUpdate.description.trim() ||
        (contentToUpdate.file_path.length === 0 &&
          uploadedFilesForUpdate.length === 0)
      ) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description:
            "Please fill all required fields and have at least one file",
        });
        return;
      }

      let updatedFilePaths = [...contentToUpdate.file_path];

      // If there are new files uploaded, upload them to Supabase
      if (uploadedFilesForUpdate.length > 0) {
        // Filter out the new files (those that are not URLs from Supabase)
        const newFiles = uploadedFilesForUpdate;

        // Upload new files to Supabase
        const newUploadedUrls = await uploadFilesToSupabase(newFiles);

        // Update the file paths with the new Supabase URLs
        // This approach assumes all new files are at the end of the file_path array
        // If that's not the case, we would need a more complex mapping logic
        updatedFilePaths = updatedFilePaths.slice(
          0,
          updatedFilePaths.length - newFiles.length
        );
        updatedFilePaths = [...updatedFilePaths, ...newUploadedUrls];
      }

      const contentToSave = {
        ...contentToUpdate,
        file_path: updatedFilePaths,
      };

      await TopicContentService.updateTopicContent(
        contentToUpdate._id,
        contentToSave
      );

      // Refresh content list
      if (topic) {
        const topicId = topic._id || topic.id;
        const result = await TopicContentService.getTopicContentByTopicId(
          topicId
        );
        setContents(result.data || []);
      }

      const t = toast({
        title: "✅ Content Updated Successfully",
        description: "Your content has been updated and is ready to use.",
        variant: "default",
        duration: 8000,
        action: (
          <Button
            variant="secondary"
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={() => t.dismiss()} // dismiss the toast safely
          >
            Got it
          </Button>
        ),
      });


      setUpdateDialogOpen(false);
      setUploadedFilesForUpdate([]);
    } catch (error) {
      console.error("Failed to update content:", error);
      const t = toast({
        variant: "destructive",
        title: "Oops! Couldn’t Update Content",
        description: "We couldn’t update the content right now. Please try again.",
        duration: 8000,
        action: (
          <Button
            variant="secondary"
            className="bg-white text-red-600 hover:bg-red-100"
            onClick={() => t.dismiss()} // dismiss the toast safely
          >
            Dismiss
          </Button>
        ),
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContent = async () => {
    if (!contentToDelete) return;

    try {
      setIsSubmitting(true);
      await TopicContentService.deleteTopicContent(contentToDelete);

      // Remove deleted content from state
      setContents(
        contents.filter((content) => content._id !== contentToDelete)
      );
      const t = toast({
        title: "✅ Content Deleted Successfully",
        description: "The content has been deleted and removed from your list.",
        variant: "default",
        duration: 8000,
        action: (
          <Button
            variant="secondary"
            className="bg-green-600 text-white hover:bg-green-700"
            onClick={() => t.dismiss()} // dismiss the toast safely
          >
            Got it
          </Button>
        ),
      });


      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete content:", error);
      const t = toast({
        variant: "destructive",
        title: "Oops! Couldn’t Delete Content",
        description: "We couldn’t delete the content right now. Please try again.",
        duration: 8000,
        action: (
          <Button
            variant="secondary"
            className="bg-white text-red-600 hover:bg-red-100"
            onClick={() => t.dismiss()} // dismiss the toast safely
          >
            Dismiss
          </Button>
        ),
      });

    } finally {
      setIsSubmitting(false);
      setContentToDelete(null);
    }
  };

  const openUpdateDialog = (content: any) => {
    setContentToUpdate({ ...content });
    setUpdateDialogOpen(true);
  };

  const openDeleteDialog = (contentId: string) => {
    setContentToDelete(contentId);
    setDeleteDialogOpen(true);
  };

  // Function to get filename from path
  const getFilenameFromPath = (path: string) => {
    // For URLs created with URL.createObjectURL or actual file paths
    return path.split("/").pop() || path;
  };

  if (!topic) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-7xl max-h-[900vh] overflow-y-auto p-0 m-0 rounded-lg">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-400 to-blue-900 p-6 text-white shrink-0 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold tracking-tight">
                    {topic.title || topic.name}
                  </DialogTitle>
                  <div className="flex items-center mt-2 text-green-100">
                    <BookOpen size={16} className="mr-2" />
                    <span className="text-sm">Topic Overview</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-orange-400 border-white text-white hover:bg-orange-300 hover:text-green-900"
                  >
                    <Download size={14} className="mr-1" /> Export
                  </Button>
                  <Button
                    onClick={() => setCreateDialogOpen(true)}
                    variant="outline"
                    size="sm"
                    className="bg-blue-400 border-white text-white hover:bg-white hover:text-green-900"
                  >
                    <Plus size={14} className="mr-1" /> Add Content
                  </Button>
                </div>
              </div>
            </div>

            {/* Topic Details */}
            <div className="bg-white border-b border-gray-100 py-4 px-6 shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="font-medium text-xs text-blue-800 mb-1">
                    Description
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {topic.description || "No description available"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="font-medium text-xs text-gray-600 mb-1">
                      Price
                    </h3>
                    <p className="text-base font-semibold text-green-700">
                      ${topic.price || 0}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="font-medium text-xs text-gray-600 mb-1">
                      Status
                    </h3>
                    <Badge
                      className={`${topic.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                        }`}
                    >
                      {topic.status || "draft"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Content List */}
            <div className="flex-grow p-6 overflow-auto">
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md flex items-start">
                  <AlertCircle className="text-red-500 mr-3" size={20} />
                  <p className="text-red-700">{error}</p>
                </div>
              ) : contents.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <File className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No content yet
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by adding new content to this topic.
                  </p>
                  <div className="mt-6">
                    <Button
                      onClick={() => setCreateDialogOpen(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus size={14} className="mr-1" /> Add Content
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contents.map((content) => (
                    <Card key={content._id} className="overflow-hidden">
                      <CardHeader className="bg-gray-50 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-md">
                              {content.title}
                            </CardTitle>
                            <CardDescription className="mt-1 text-xs">
                              {new Date(content.createdAt).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge
                            className={`${content.file_type === "document"
                              ? "bg-blue-100 text-blue-800"
                              : content.file_type === "video"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-amber-100 text-amber-800"
                              }`}
                          >
                            {content.file_type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {content.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {content.file_path.map((path, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="flex items-center text-xs"
                            >
                              <File size={10} className="mr-1" />
                              {getFilenameFromPath(path).substring(0, 15)}
                              {getFilenameFromPath(path).length > 15
                                ? "..."
                                : ""}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200 hover:bg-gray-50"
                          >
                            <Eye size={14} className="mr-1" /> View
                          </Button>
                          <Button
                            onClick={() => openUpdateDialog(content)}
                            variant="outline"
                            size="sm"
                            className="border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            <Edit size={14} className="mr-1" /> Edit
                          </Button>
                          <Button
                            onClick={() => openDeleteDialog(content._id)}
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={14} className="mr-1" /> Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Content Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="w-full max-w-xl">
          <DialogTitle>Add New Content</DialogTitle>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={newContent.title}
                onChange={(e) =>
                  setNewContent({ ...newContent, title: e.target.value })
                }
                placeholder="Enter content title"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                value={newContent.description}
                onChange={(e) =>
                  setNewContent({ ...newContent, description: e.target.value })
                }
                placeholder="Enter content description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="file-type" className="text-sm font-medium">
                Content Type
              </label>
              <Select
                value={newContent.file_type}
                onValueChange={(value) =>
                  setNewContent({
                    ...newContent,
                    file_type: value as "video" | "audio" | "document",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Files</label>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={getAcceptedFileTypes(newContent.file_type)}
                onChange={(e) => handleFileSelect(e)}
                multiple
              />
              <div
                onClick={() => triggerFileInput()}
                className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
              >
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-1 text-sm text-gray-500">
                  Click to upload files or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Accepted types:{" "}
                  {getAcceptedFileTypes(newContent.file_type)
                    .split(",")
                    .join(", ")}
                </p>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm font-medium">Selected Files:</p>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                      >
                        <div className="flex items-center">
                          <File size={16} className="mr-2 text-blue-500" />
                          <span className="text-sm truncate max-w-[200px]">
                            {file.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateContent} disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Content"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Content Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="w-full max-w-xl">
          <DialogTitle>Update Content</DialogTitle>
          {contentToUpdate && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="update-title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="update-title"
                  value={contentToUpdate.title}
                  onChange={(e) =>
                    setContentToUpdate({
                      ...contentToUpdate,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter content title"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="update-description"
                  className="text-sm font-medium"
                >
                  Description
                </label>
                <Textarea
                  id="update-description"
                  value={contentToUpdate.description}
                  onChange={(e) =>
                    setContentToUpdate({
                      ...contentToUpdate,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter content description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="update-file-type"
                  className="text-sm font-medium"
                >
                  Content Type
                </label>
                <Select
                  value={contentToUpdate.file_type}
                  onValueChange={(value) =>
                    setContentToUpdate({
                      ...contentToUpdate,
                      file_type: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Files</label>
                {contentToUpdate.file_path.length > 0 && (
                  <div className="space-y-2">
                    {contentToUpdate.file_path.map((path, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                      >
                        <div className="flex items-center">
                          <File size={16} className="mr-2 text-blue-500" />
                          <span className="text-sm truncate max-w-[200px]">
                            {getFilenameFromPath(path)}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index, true)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  ref={updateFileInputRef}
                  className="hidden"
                  accept={getAcceptedFileTypes(contentToUpdate.file_type)}
                  onChange={(e) => handleFileSelect(e, true)}
                  multiple
                />
                <div
                  onClick={() => triggerFileInput(true)}
                  className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
                >
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-500">
                    Click to upload additional files
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUpdateDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateContent} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Content"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This content will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteContent}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ViewTopicContentDialog;
