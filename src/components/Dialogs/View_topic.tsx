import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import Topic from "../Interfaces/Topic_Interface";
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

  // File upload handlers
  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    isUpdate = false
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);

    if (isUpdate) {
      setUploadedFilesForUpdate((prev) => [...prev, ...files]);

      // Store file paths
      const newFilePaths = files.map((file) => URL.createObjectURL(file));
      setContentToUpdate((prev) => ({
        ...prev,
        file_path: [...prev.file_path, ...newFilePaths],
      }));
    } else {
      setUploadedFiles((prev) => [...prev, ...files]);

      // Store file paths
      const newFilePaths = files.map((file) => URL.createObjectURL(file));
      setNewContent((prev) => ({
        ...prev,
        file_path: [...prev.file_path, ...newFilePaths],
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
        !newContent.file_path.length
      ) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description:
            "Please fill all required fields and upload at least one file",
        });
        return;
      }

      // In a real implementation, you would upload files to a server here
      // For now, we'll just use the file paths (object URLs) as placeholders
      const contentToCreate = {
        ...newContent,
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
        description: "Failed to create content. Please try again.",
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
        !contentToUpdate.file_path.length
      ) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description:
            "Please fill all required fields and upload at least one file",
        });
        return;
      }

      // In a real implementation, you would upload files to a server here
      const contentToSave = {
        ...contentToUpdate,
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

      toast({
        title: "Success",
        description: "Content updated successfully",
      });

      setUpdateDialogOpen(false);
      setUploadedFilesForUpdate([]);
    } catch (error) {
      console.error("Failed to update content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update content. Please try again.",
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

      toast({
        title: "Success",
        description: "Content deleted successfully",
      });

      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete content:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete content. Please try again.",
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
                      Regular Price
                    </h3>
                    <p className="text-base font-semibold text-gray-700">
                      ${topic.regularPrice || 0}
                    </p>
                    {topic.price < topic.regularPrice && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full inline-block mt-1">
                        {Math.round(
                          ((topic.regularPrice - topic.price) /
                            topic.regularPrice) *
                            100
                        )}
                        % Off
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Topic Content Section - Scrollable */}
            <div
              className="overflow-y-auto flex-1 bg-gray-50"
              style={{
                maxHeight: "50vh",
                overflowY: "auto",
                msOverflowStyle: "auto",
                scrollbarWidth: "auto",
              }}
            >
              <div className="py-4 px-6">
                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-green-600 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mx-auto">
                    <div className="flex items-center">
                      <X className="h-5 w-5 text-red-500 mr-2" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                ) : contents.length === 0 ? (
                  <div className="text-center py-16 px-4">
                    <div className="bg-white rounded-xl shadow-sm p-8 max-w-lg mx-auto">
                      <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <BookOpen size={24} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-gray-800 mb-2">
                        No content yet
                      </h3>
                      <p className="text-gray-500 text-sm mb-4">
                        Add content to enhance the learning experience.
                      </p>
                      <Button
                        className="bg-blue-500 hover:bg-blue-900 text-white"
                        onClick={() => setCreateDialogOpen(true)}
                        size="sm"
                      >
                        <Plus size={16} className="mr-1" /> Add Your First
                        Content
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {contents.map((content, index) => {
                      const fileType = content.file_type || "Unknown";
                      return (
                        <Card
                          key={content._id || index}
                          className="h-full flex flex-col"
                        >
                          <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white flex justify-between">
                            <div>
                              <CardTitle className="text-base">
                                {content.title}
                              </CardTitle>
                              <CardDescription className="text-xs mt-1 flex items-center">
                                <span
                                  className={`inline-block w-2 h-2 rounded-full mr-1 ${
                                    fileType === "document"
                                      ? "bg-green-400"
                                      : fileType === "video"
                                      ? "bg-blue-400"
                                      : fileType === "audio"
                                      ? "bg-purple-400"
                                      : "bg-gray-400"
                                  }`}
                                />
                                {fileType}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {fileType}
                            </Badge>
                          </CardHeader>
                          <CardContent className="flex-1 flex flex-col">
                            <p className="text-sm text-gray-700 mb-3">
                              {content.description}
                            </p>
                            {/* File list with scrolling if needed */}
                            {content.file_path?.length > 0 && (
                              <div className="flex-1 mb-3">
                                <ul className="bg-gray-50 p-3 rounded-md space-y-1 max-h-24 overflow-y-auto">
                                  {content.file_path.map(
                                    (file: string, i: number) => (
                                      <li
                                        key={i}
                                        className="flex justify-between items-center text-xs text-blue-600"
                                      >
                                        <span className="truncate flex items-center">
                                          <File size={12} className="mr-1" />
                                          {getFilenameFromPath(file)}
                                        </span>
                                        <Button
                                          size="icon"
                                          variant="ghost"
                                          className="h-6 w-6"
                                        >
                                          <Download size={12} />
                                        </Button>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </div>
                            )}
                            <div className="mt-auto flex justify-end space-x-1">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                              >
                                <Eye size={12} className="mr-1" /> View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 h-7 text-xs"
                              >
                                <Download size={12} className="mr-1" /> Download
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-amber-600 h-7 text-xs"
                                onClick={() => openUpdateDialog(content)}
                              >
                                <Edit size={12} className="mr-1" /> Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 h-7 text-xs"
                                onClick={() => openDeleteDialog(content._id)}
                              >
                                <Trash2 size={12} className="mr-1" /> Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-white p-4 border-t border-gray-200 shadow-sm shrink-0 rounded-b-lg">
              <div className="flex items-center justify-between">
                <div className="text-gray-500 flex items-center space-x-2 text-sm">
                  <BookOpen size={14} />
                  <span>{contents.length} content items</span>
                </div>
                <div className="flex space-x-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Close
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-900 hover:bg-blue-400 text-white"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    <Plus size={14} className="mr-1" /> Add Content
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Content Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-2xl font-semibold mb-2">
            Add New Content
          </DialogTitle>

          <div className="grid gap-6 py-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title *
              </label>
              <Input
                id="title"
                placeholder="Enter content title"
                value={newContent.title}
                onChange={(e) =>
                  setNewContent({ ...newContent, title: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description *
              </label>
              <Textarea
                id="description"
                placeholder="Enter content description"
                value={newContent.description}
                onChange={(e) =>
                  setNewContent({ ...newContent, description: e.target.value })
                }
                rows={3}
              />
            </div>

            <div>
              <label
                htmlFor="file-type"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                File Type *
              </label>
              <Select
                value={newContent.file_type}
                onValueChange={(value) => {
                  setNewContent({
                    ...newContent,
                    file_type: value as any,
                    file_path: [],
                  });
                  setUploadedFiles([]);
                }}
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
              <p className="text-xs text-gray-500 mt-1">
                {newContent.file_type === "document" &&
                  "Allowed file types: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT"}
                {newContent.file_type === "video" &&
                  "Allowed file types: MP4, AVI, MOV, WMV, MKV, WebM"}
                {newContent.file_type === "audio" &&
                  "Allowed file types: MP3, WAV, OGG, M4A, FLAC, AAC"}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Files *
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => triggerFileInput()}
                  type="button"
                  className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  <Upload size={14} className="mr-1" /> Select Files
                </Button>
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  accept={getAcceptedFileTypes(newContent.file_type)}
                  onChange={(e) => handleFileSelect(e)}
                />
              </div>

              <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                {uploadedFiles.length > 0 ? (
                  <ul className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                      >
                        <div className="flex items-center text-sm">
                          <File className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="truncate max-w-sm">{file.name}</span>
                          <span className="ml-2 text-xs text-gray-500">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X size={16} />
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                    <Upload size={32} className="mb-2 text-gray-300" />
                    <p className="text-sm">No files selected</p>
                    <p className="text-xs mt-1">
                      Click "Select Files" to upload {newContent.file_type}{" "}
                      files
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                setUploadedFiles([]);
                setNewContent({
                  title: "",
                  description: "",
                  file_path: [],
                  file_type: "document",
                  Topic: topic ? topic._id || topic.id : "",
                });
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateContent}
              disabled={isSubmitting || uploadedFiles.length === 0}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              {isSubmitting ? "Creating..." : "Create Content"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Content Dialog */}
      {contentToUpdate && (
        <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-2xl font-semibold mb-2">
              Update Content
            </DialogTitle>

            <div className="grid gap-6 py-4">
              <div>
                <label
                  htmlFor="edit-title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title *
                </label>
                <Input
                  id="edit-title"
                  placeholder="Enter content title"
                  value={contentToUpdate.title}
                  onChange={(e) =>
                    setContentToUpdate({
                      ...contentToUpdate,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description *
                </label>
                <Textarea
                  id="edit-description"
                  placeholder="Enter content description"
                  value={contentToUpdate.description}
                  onChange={(e) =>
                    setContentToUpdate({
                      ...contentToUpdate,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div>
                <label
                  htmlFor="edit-file-type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  File Type *
                </label>
                <Select
                  value={contentToUpdate.file_type}
                  onValueChange={(value) => {
                    // Clear file paths when changing file type
                    setContentToUpdate({
                      ...contentToUpdate,
                      file_type: value as any,
                      file_path: [],
                    });
                    setUploadedFilesForUpdate([]);
                  }}
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
                <p className="text-xs text-gray-500 mt-1">
                  {contentToUpdate.file_type === "document" &&
                    "Allowed file types: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT"}
                  {contentToUpdate.file_type === "video" &&
                    "Allowed file types: MP4, AVI, MOV, WMV, MKV, WebM"}
                  {contentToUpdate.file_type === "audio" &&
                    "Allowed file types: MP3, WAV, OGG, M4A, FLAC, AAC"}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Files *
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => triggerFileInput(true)}
                    type="button"
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                  >
                    <Upload size={14} className="mr-1" /> Add More Files
                  </Button>
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={updateFileInputRef}
                    className="hidden"
                    multiple
                    accept={getAcceptedFileTypes(contentToUpdate.file_type)}
                    onChange={(e) => handleFileSelect(e, true)}
                  />
                </div>

                <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                  {contentToUpdate.file_path.length > 0 ? (
                    <ul className="space-y-2">
                      {contentToUpdate.file_path.map(
                        (filePath: string, index: number) => {
                          const isNewFile =
                            index >=
                            contentToUpdate.file_path.length -
                              uploadedFilesForUpdate.length;
                          const fileName = isNewFile
                            ? uploadedFilesForUpdate[
                                index -
                                  (contentToUpdate.file_path.length -
                                    uploadedFilesForUpdate.length)
                              ].name
                            : getFilenameFromPath(filePath);

                          return (
                            <li
                              key={index}
                              className={`flex items-center justify-between p-2 rounded-md ${
                                isNewFile ? "bg-green-50" : "bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center text-sm">
                                <File
                                  className={`h-4 w-4 mr-2 ${
                                    isNewFile
                                      ? "text-green-500"
                                      : "text-blue-500"
                                  }`}
                                />
                                <span className="truncate max-w-sm">
                                  {fileName}
                                </span>
                                {isNewFile && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 text-xs bg-green-100 text-green-800"
                                  >
                                    New
                                  </Badge>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index, true)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X size={16} />
                              </Button>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                      <Upload size={32} className="mb-2 text-gray-300" />
                      <p className="text-sm">No files selected</p>
                      <p className="text-xs mt-1">
                        Click "Add More Files" to upload{" "}
                        {contentToUpdate.file_type} files
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setUpdateDialogOpen(false);
                  setContentToUpdate(null);
                  setUploadedFilesForUpdate([]);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateContent}
                disabled={
                  isSubmitting || contentToUpdate.file_path.length === 0
                }
                className="bg-blue-700 hover:bg-blue-800 text-white"
              >
                {isSubmitting ? "Updating..." : "Update Content"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" /> Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this content? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setContentToDelete(null);
              }}
              disabled={isSubmitting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteContent}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white"
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
