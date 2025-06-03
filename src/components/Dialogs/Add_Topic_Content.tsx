import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, File, Video, Music, FileText, Upload, X } from "lucide-react";
import TopicContentService from "@/services/Admin_Service/Topic_Content_service";
import { supabase } from "@/helper/SupabaseClient";

interface ContentFormData {
  title: string;
  description: string;
  lesson: Array<{
    text: string;
    audio: string;
    video: string;
  }>;
  file_path: string[];
  file_type: "video" | "audio" | "document";
  Topic: string;
}

interface Topic {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  price?: number;
  regularPrice?: number;
}

interface CreateContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  topic: Topic | null;
  onContentCreated: () => void;
}

// Define file type extensions mapping
const fileTypeExtensions = {
  video: [".mp4", ".avi", ".mov", ".wmv", ".mkv", ".webm"],
  audio: [".mp3", ".wav", ".ogg", ".m4a", ".flac", ".aac"],
  document: [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".txt"],
};

const CreateContentDialog: React.FC<CreateContentDialogProps> = ({
  open,
  onOpenChange,
  topic,
  onContentCreated,
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [newContent, setNewContent] = useState<ContentFormData>({
    title: "",
    description: "",
    lesson: [{ text: "", audio: "", video: "" }],
    file_path: [],
    file_type: "document",
    Topic: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Text dialog state
  const [textDialogOpen, setTextDialogOpen] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [tempText, setTempText] = useState("");

  // Initialize form with topic ID when dialog opens
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

  // Helper functions for lesson management
  const addLessonItem = () => {
    setNewContent((prev) => ({
      ...prev,
      lesson: [...prev.lesson, { text: "", audio: "", video: "" }],
    }));
  };

  const removeLessonItem = (index: number) => {
    if (newContent.lesson.length > 1) {
      setNewContent((prev) => ({
        ...prev,
        lesson: prev.lesson.filter((_, i) => i !== index),
      }));
    }
  };

  const updateLessonItem = (
    index: number,
    field: "text" | "audio" | "video",
    value: string
  ) => {
    setNewContent((prev) => ({
      ...prev,
      lesson: prev.lesson.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Text dialog handlers
  const handleTextButtonClick = (index: number) => {
    setCurrentTextIndex(index);
    setTempText(newContent.lesson[index].text);
    setTextDialogOpen(true);
  };

  const handleSaveText = () => {
    updateLessonItem(currentTextIndex, "text", tempText);
    setTextDialogOpen(false);
    setTempText("");
  };

  // File handling
  const getAcceptedFileTypes = (fileType: string) => {
    return fileTypeExtensions[fileType as keyof typeof fileTypeExtensions].join(
      ","
    );
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);

    // Store files temporarily (actual URLs will be updated after Supabase upload)
    const tempFilePaths = files.map((file) => URL.createObjectURL(file));
    setNewContent((prev) => ({
      ...prev,
      file_path: [...prev.file_path, ...tempFilePaths],
    }));
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setNewContent((prev) => ({
      ...prev,
      file_path: prev.file_path.filter((_, i) => i !== index),
    }));
  };

  // Upload files to Supabase
  const uploadFilesToSupabase = async (files: File[]) => {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileName = `${Date.now()}_${file.name}`;

        const { data, error } = await supabase.storage
          .from("topics")
          .upload(fileName, file);

        if (error) {
          console.error("Error uploading file:", error);
          throw new Error(`Error uploading file: ${error.message}`);
        }

        const { data: publicData } = supabase.storage
          .from("topics")
          .getPublicUrl(fileName);

        if (publicData) {
          return publicData.publicUrl;
        }

        return null;
      });

      const results = await Promise.all(uploadPromises);
      return results.filter((url) => url !== null) as string[];
    } catch (error) {
      console.error("Error in file upload:", error);
      throw error;
    }
  };

  // Form submission
  const handleCreateContent = async () => {
    try {
      setIsSubmitting(true);

      if (
        !newContent.title.trim() ||
        !newContent.description.trim() ||
        !uploadedFiles.length ||
        newContent.lesson.some((item) => !item.text.trim())
      ) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description:
            "Please fill all required fields, add lesson text, and upload at least one file",
        });
        return;
      }

      // Upload files to Supabase and get URLs
      const uploadedUrls = await uploadFilesToSupabase(uploadedFiles);

      if (!uploadedUrls.length) {
        throw new Error("Failed to upload files");
      }

      // Create content with Supabase URLs
      const contentToCreate = {
        ...newContent,
        file_path: uploadedUrls,
      };

      await TopicContentService.createTopicContent(contentToCreate);

      toast({
        title: "Success",
        description: "Content created successfully",
      });

      // Reset form and close dialog
      handleResetForm();
      onContentCreated();
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

  const handleResetForm = () => {
    setNewContent({
      title: "",
      description: "",
      lesson: [{ text: "", audio: "", video: "" }],
      file_path: [],
      file_type: "document",
      Topic: topic ? topic._id || topic.id || "" : "",
    });
    setUploadedFiles([]);
    onOpenChange(false);
  };

  return (
    <>
      {/* Create Content Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 border-0 shadow-2xl">
          {/* Header with gradient background */}
          <div className="relative -m-6 mb-0 p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white flex-shrink-0">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Plus size={24} className="text-white" />
                </div>
                Create New Content
              </DialogTitle>
              <p className="text-blue-100 mt-2 text-sm">
                Add engaging content to your topic
              </p>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Content Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                Content Type
                <span className="text-red-500">*</span>
              </label>
              <Select
                value={newContent.file_type}
                onValueChange={(value) =>
                  setNewContent({
                    ...newContent,
                    file_type: value as ContentFormData["file_type"],
                  })
                }
              >
                <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 bg-white/80 backdrop-blur-sm">
                  <SelectValue placeholder="Choose your content type" />
                </SelectTrigger>
                <SelectContent className="border-0 shadow-xl">
                  <SelectItem
                    value="document"
                    className="hover:bg-blue-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 py-1">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <File size={16} className="text-blue-600" />
                      </div>
                      Document
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="video"
                    className="hover:bg-purple-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 py-1">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Video size={16} className="text-purple-600" />
                      </div>
                      Video
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="audio"
                    className="hover:bg-green-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 py-1">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Music size={16} className="text-green-600" />
                      </div>
                      Audio
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Title and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                  Title
                  <span className="text-red-500">*</span>
                </label>
                <Input
                  value={newContent.title}
                  onChange={(e) =>
                    setNewContent({ ...newContent, title: e.target.value })
                  }
                  placeholder="Enter a catchy title"
                  className="h-12 border-2 border-gray-200 hover:border-green-300 focus:border-green-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  Description
                  <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={newContent.description}
                  onChange={(e) =>
                    setNewContent({
                      ...newContent,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your content..."
                  rows={3}
                  className="border-2 border-gray-200 hover:border-purple-300 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none"
                />
              </div>
            </div>

            {/* Lesson Items */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                  Lesson Content
                  <span className="text-red-500">*</span>
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLessonItem}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus size={14} className="mr-2" />
                  Add Lesson Item
                </Button>
              </div>

              <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                {newContent.lesson.map((lessonItem, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-white via-gray-50 to-blue-50/30 rounded-xl p-4 border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          Lesson Item {index + 1}
                        </span>
                      </div>
                      {newContent.lesson.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                          onClick={() => removeLessonItem(index)}
                        >
                          <X size={14} />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Text Button */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-2 block">
                          Text Content
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleTextButtonClick(index)}
                          className="w-full bg-gradient-to-r from-slate-500 to-gray-500 text-white border-0 hover:from-slate-600 hover:to-gray-600 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                          <FileText size={14} className="mr-2" />
                          {lessonItem.text ? "Edit Text" : "Add Text"}
                        </Button>
                      </div>

                      {/* Audio Content */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-2 block">
                          Audio Content
                        </label>
                        <div className="flex gap-2">
                          <Input
                            value={lessonItem.audio}
                            onChange={(e) =>
                              updateLessonItem(index, "audio", e.target.value)
                            }
                            placeholder="audio.mp3 or URL"
                            className="text-sm flex-1 border-2 border-gray-200 hover:border-green-300 focus:border-green-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="px-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "audio/*";
                              input.onchange = async (e) => {
                                const file = (e.target as HTMLInputElement)
                                  .files?.[0];
                                if (file) {
                                  try {
                                    const fileName = `${Date.now()}_${
                                      file.name
                                    }`;
                                    const { data, error } =
                                      await supabase.storage
                                        .from("topics")
                                        .upload(fileName, file);

                                    if (error) throw error;

                                    const { data: publicData } =
                                      supabase.storage
                                        .from("topics")
                                        .getPublicUrl(fileName);

                                    if (publicData) {
                                      updateLessonItem(
                                        index,
                                        "audio",
                                        publicData.publicUrl
                                      );
                                      toast({
                                        title: "Success",
                                        description:
                                          "Audio uploaded successfully",
                                      });
                                    }
                                  } catch (error) {
                                    console.error(
                                      "Audio upload failed:",
                                      error
                                    );
                                    toast({
                                      variant: "destructive",
                                      title: "Error",
                                      description:
                                        "Failed to upload audio file",
                                    });
                                  }
                                }
                              };
                              input.click();
                            }}
                          >
                            <Upload size={14} />
                          </Button>
                        </div>
                      </div>

                      {/* Video Content */}
                      <div>
                        <label className="text-xs font-medium text-gray-600 mb-2 block">
                          Video Content
                        </label>
                        <div className="flex gap-2">
                          <Input
                            value={lessonItem.video}
                            onChange={(e) =>
                              updateLessonItem(index, "video", e.target.value)
                            }
                            placeholder="video.mp4 or URL"
                            className="text-sm flex-1 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="px-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg"
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = "video/*";
                              input.onchange = async (e) => {
                                const file = (e.target as HTMLInputElement)
                                  .files?.[0];
                                if (file) {
                                  try {
                                    const fileName = `${Date.now()}_${
                                      file.name
                                    }`;
                                    const { data, error } =
                                      await supabase.storage
                                        .from("topics")
                                        .upload(fileName, file);

                                    if (error) throw error;

                                    const { data: publicData } =
                                      supabase.storage
                                        .from("topics")
                                        .getPublicUrl(fileName);

                                    if (publicData) {
                                      updateLessonItem(
                                        index,
                                        "video",
                                        publicData.publicUrl
                                      );
                                      toast({
                                        title: "Success",
                                        description:
                                          "Video uploaded successfully",
                                      });
                                    }
                                  } catch (error) {
                                    console.error(
                                      "Video upload failed:",
                                      error
                                    );
                                    toast({
                                      variant: "destructive",
                                      title: "Error",
                                      description:
                                        "Failed to upload video file",
                                    });
                                  }
                                }
                              };
                              input.click();
                            }}
                          >
                            <Upload size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                  Files
                  <span className="text-red-500">*</span>
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={triggerFileInput}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Upload size={14} className="mr-2" />
                  Upload Files
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept={getAcceptedFileTypes(newContent.file_type)}
                multiple
              />

              {uploadedFiles.length > 0 ? (
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-4 max-h-32 overflow-y-auto border-2 border-gray-100">
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-white rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
                      >
                        <div className="flex items-center gap-3 text-sm truncate">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <File size={14} className="text-blue-600" />
                          </div>
                          <div className="truncate">
                            <p className="font-medium text-gray-800 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 shrink-0"
                          onClick={() => removeFile(index)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload size={20} className="text-white" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    No files uploaded yet
                  </p>
                  <p className="text-xs text-gray-500">
                    Click "Upload Files" to add your content
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Footer */}
          <DialogFooter className="flex-shrink-0 px-6 py-4 bg-gray-50/80 border-t border-gray-200 mt-auto">
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                onClick={handleResetForm}
                className="flex-1 h-12 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateContent}
                disabled={isSubmitting}
                className="flex-1 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white border-0 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:hover:shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
                    Creating Content...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus size={16} />
                    Create Content
                  </div>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Text Editor Dialog */}
      <Dialog open={textDialogOpen} onOpenChange={setTextDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>Edit Lesson Text</DialogTitle>
          <div className="space-y-4">
            <Textarea
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              placeholder="Enter your lesson text here..."
              rows={10}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTextDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveText}>Save Text</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateContentDialog;
