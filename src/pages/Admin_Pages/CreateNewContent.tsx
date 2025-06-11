import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Plus,
  X,
  Upload,
  File,
  FileText,
  Music,
  Video,
  Calculator,
  ChevronLeft,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import TopicContentService from "@/services/Admin_Service/Topic_Content_service";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/helper/SupabaseClient";
import { MathfieldElement } from "mathlive";

// Define file type extensions mapping
const fileTypeExtensions = {
  video: [".mp4", ".avi", ".mov", ".wmv", ".mkv", ".webm"],
  audio: [".mp3", ".wav", ".ogg", ".m4a", ".flac", ".aac"],
  document: [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".txt"],
};

interface SubHeadingItem {
  text: string;
  question: string;
  subheadingAudioPath: string;
  expectedAnswer: string;
  comment: string;
  hint: string;
}

interface LessonItem {
  text: string;
  subHeading: SubHeadingItem[];
  audio: string;
  video: string;
}

interface ContentFormData {
  title: string;
  description: string;
  lesson: LessonItem[];
  file_path: string[];
  file_type: "video" | "audio" | "document";
  Topic: string;
}

const CreateNewContent: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [newContent, setNewContent] = useState<ContentFormData>({
    title: "",
    description: "",
    lesson: [
      {
        text: "",
        subHeading: [
          {
            text: "",
            question: "",
            subheadingAudioPath: "",
            expectedAnswer: "",
            comment: "",
            hint: "",
          },
        ],
        audio: "",
        video: "",
      },
    ],
    file_path: [],
    file_type: "document",
    Topic: topicId || "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // MathLive state
  const [mathExpression, setMathExpression] = useState("");
  const mathFieldRef = useRef<MathfieldElement | null>(null);
  const mathContainerRef = useRef<HTMLDivElement>(null);
  const [mathInputTarget, setMathInputTarget] = useState<{
    lessonIndex: number;
    subHeadingIndex: number;
    field: string;
  } | null>(null);

  // Initialize MathLive when mathInputTarget changes
  useEffect(() => {
    if (mathInputTarget === null || !mathContainerRef.current) return;

    const mf = new MathfieldElement();
    mf.setOptions({
      defaultMode: "math",
      smartMode: true,
      virtualKeyboardMode: "onfocus",
      virtualKeyboards: "all",
    });

    mf.addEventListener("input", () => {
      setMathExpression(mf.getValue("latex"));
    });

    // Style the math field
    mf.style.width = "100%";
    mf.style.minHeight = "60px";
    mf.style.padding = "8px";
    mf.style.border = "1px solid #d1d5db";
    mf.style.borderRadius = "6px";

    mathContainerRef.current.innerHTML = "";
    mathContainerRef.current.appendChild(mf);
    mf.focus();

    mathFieldRef.current = mf;

    return () => {
      if (mathFieldRef.current) {
        mathFieldRef.current.remove();
        mathFieldRef.current = null;
      }
    };
  }, [mathInputTarget]);

  const insertMathExpression = () => {
    if (mathExpression && mathFieldRef.current && mathInputTarget) {
      const latex = mathFieldRef.current.value;
      const { lessonIndex, subHeadingIndex, field } = mathInputTarget;
      
      const lesson = [...newContent.lesson];
      const subHeading = [...lesson[lessonIndex].subHeading];
      const currentText = subHeading[subHeadingIndex][field as keyof SubHeadingItem] as string;
      const newText = currentText + ` \\(${latex}\\) `;
      
      subHeading[subHeadingIndex] = { 
        ...subHeading[subHeadingIndex],
        [field]: newText
      };
      
      lesson[lessonIndex] = {
        ...lesson[lessonIndex],
        subHeading
      };
      
      setNewContent({
        ...newContent,
        lesson
      });
      
      // setMathExpression("");
      if (mathFieldRef.current) {
        mathFieldRef.current.value = "";
      }
    }
  };

  const insertQuickSymbol = (symbol: string) => {
    if (mathFieldRef.current) {
      mathFieldRef.current.executeCommand(["insert", symbol]);
      mathFieldRef.current.focus();
    }
  };

  const toggleMathInput = (
    lessonIndex: number,
    subHeadingIndex: number,
    field: string
  ) => {
    if (
      mathInputTarget?.lessonIndex === lessonIndex &&
      mathInputTarget?.subHeadingIndex === subHeadingIndex &&
      mathInputTarget?.field === field
    ) {
      setMathInputTarget(null);
    } else {
      setMathInputTarget({ lessonIndex, subHeadingIndex, field });
    }
    setMathExpression("");
  };

  const addLessonItem = () => {
    setNewContent((prev) => ({
      ...prev,
      lesson: [
        ...prev.lesson,
        {
          text: "",
          subHeading: [
            {
              text: "",
              question: "",
              subheadingAudioPath: "",
              expectedAnswer: "",
              comment: "",
              hint: "",
            },
          ],
          audio: "",
          video: "",
        },
      ],
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

  const addSubHeading = (lessonIndex: number) => {
    const updatedLessons = [...newContent.lesson];
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      subHeading: [
        ...updatedLessons[lessonIndex].subHeading,
        {
          text: "",
          question: "",
          subheadingAudioPath: "",
          expectedAnswer: "",
          comment: "",
          hint: "",
        },
      ],
    };
    setNewContent({
      ...newContent,
      lesson: updatedLessons,
    });
  };

  const removeSubHeading = (lessonIndex: number, subHeadingIndex: number) => {
    if (newContent.lesson[lessonIndex].subHeading.length > 1) {
      const updatedLessons = [...newContent.lesson];
      updatedLessons[lessonIndex] = {
        ...updatedLessons[lessonIndex],
        subHeading: updatedLessons[lessonIndex].subHeading.filter(
          (_, i) => i !== subHeadingIndex
        ),
      };
      setNewContent({
        ...newContent,
        lesson: updatedLessons,
      });
    }
  };

  const updateLessonItem = (
    lessonIndex: number,
    field: keyof LessonItem,
    value: string
  ) => {
    const updatedLessons = [...newContent.lesson];
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      [field]: value,
    };
    setNewContent({
      ...newContent,
      lesson: updatedLessons,
    });
  };

  const updateSubHeadingItem = (
    lessonIndex: number,
    subHeadingIndex: number,
    field: keyof SubHeadingItem,
    value: string
  ) => {
    const updatedLessons = [...newContent.lesson];
    const updatedSubHeadings = [...updatedLessons[lessonIndex].subHeading];
    updatedSubHeadings[subHeadingIndex] = {
      ...updatedSubHeadings[subHeadingIndex],
      [field]: value,
    };
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      subHeading: updatedSubHeadings,
    };
    setNewContent({
      ...newContent,
      lesson: updatedLessons,
    });
  };

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

  const handleCreateContent = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      const isLessonValid = newContent.lesson.every(
        (lesson) =>
          lesson.text.trim() !== "" &&
          lesson.subHeading.every(
            (sub) => sub.text.trim() !== "" && sub.subheadingAudioPath !== ""
          )
      );

      if (
        !newContent.title.trim() ||
        !newContent.description.trim() ||
        !uploadedFiles.length ||
        !isLessonValid
      ) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description:
            "Please fill all required fields and upload at least one file",
        });
        return;
      }

      const uploadedUrls = await uploadFilesToSupabase(uploadedFiles);
      if (!uploadedUrls.length) {
        throw new Error("Failed to upload files");
      }

      const contentToCreate = {
        ...newContent,
        file_path: uploadedUrls,
      };

      await TopicContentService.createTopicContent(contentToCreate);

      toast({
        title: "Success",
        description: "Content created successfully",
      });

      navigate(-1); // Go back to previous page
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

  const uploadFilesToSupabase = async (files: File[]) => {
    try {
      const uploadPromises = files.map(async (file) => {
        const fileName = `${Date.now()}_${file.name}`;
        const { data, error } = await supabase.storage
          .from("topics")
          .upload(fileName, file);

        if (error) throw error;

        const { data: publicData } = supabase.storage
          .from("topics")
          .getPublicUrl(fileName);

        return publicData?.publicUrl || null;
      });

      const results = await Promise.all(uploadPromises);
      return results.filter((url) => url !== null) as string[];
    } catch (error) {
      console.error("Error in file upload:", error);
      throw error;
    }
  };

  useEffect(() => {
    setNewContent((prev) => ({
      ...prev,
      Topic: topicId || "",
    }));
  }, [topicId]);

  useEffect(() => {
    setUploadedFiles([]);
  }, [newContent.file_type]);

  return (
<div className="min-h-screen w-full bg-gray-100">
  <div className="w-full px-0 py-0">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft size={20} className="mr-2" />
              Back
            </Button>
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold tracking-tight flex items-center justify-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Plus size={24} className="text-white" />
                </div>
                Create New Content
              </h1>
              <p className="text-blue-100 mt-2 text-sm">
                Add engaging content to your topic
              </p>
            </div>
            <div className="w-12"></div> {/* Spacer for alignment */}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Content Type Selection */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
    {/* Content Type */}
    <div className="space-y-2">
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
        <SelectTrigger className="h-10 border border-gray-200 hover:border-blue-300 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm">
          <SelectValue placeholder="Choose type" />
        </SelectTrigger>
        <SelectContent className="border-0 shadow-xl">
          <SelectItem
            value="document"
            className="hover:bg-blue-50 cursor-pointer"
          >
            <div className="flex items-center gap-2 py-1">
              <div className="p-1 bg-blue-100 rounded-lg">
                <File size={14} className="text-blue-600" />
              </div>
              Document
            </div>
          </SelectItem>
          <SelectItem
            value="video"
            className="hover:bg-purple-50 cursor-pointer"
          >
            <div className="flex items-center gap-2 py-1">
              <div className="p-1 bg-purple-100 rounded-lg">
                <Video size={14} className="text-purple-600" />
              </div>
              Video
            </div>
          </SelectItem>
          <SelectItem
            value="audio"
            className="hover:bg-green-50 cursor-pointer"
          >
            <div className="flex items-center gap-2 py-1">
              <div className="p-1 bg-green-100 rounded-lg">
                <Music size={14} className="text-green-600" />
              </div>
              Audio
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>

    {/* Title */}
    <div className="space-y-2">
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
        placeholder="Catchy title"
        className="h-10 text-sm border border-gray-200 hover:border-green-300 focus:border-green-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
      />
    </div>

    {/* Description */}
    <div className="space-y-2">
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
        placeholder="Short description..."
        rows={2}
        className="text-sm border border-gray-200 hover:border-purple-300 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none h-20"
      />
    </div>
  </div>

{/* File Upload Section */}
<div className="space-y-2"> {/* reduced vertical spacing */}
  <div className="flex justify-between items-center">
    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1"> {/* smaller font & gap */}
      <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
      Files
      <span className="text-red-500">*</span>
    </label>
    <Button
      type="button"
      variant="outline"
      size="xs"  /* smaller button size */
      onClick={() => triggerFileInput()}
      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 py-1 px-2" /* reduced padding */
    >
      <Upload size={12} className="mr-1" /> {/* smaller icon */}
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
    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-2 max-h-24 overflow-y-auto border-2 border-gray-100"> {/* reduced padding and height */}
      <div className="space-y-1">
        {uploadedFiles.map((file, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-white rounded-lg px-3 py-1.5 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100" /* smaller paddings */
          >
            <div className="flex items-center gap-2 text-xs truncate"> {/* smaller text */}
              <div className="p-1.5 bg-blue-100 rounded-lg"> {/* smaller padding */}
                <File size={12} className="text-blue-600" /> {/* smaller icon */}
              </div>
              <div className="truncate">
                <p className="font-medium text-gray-800 truncate">{file.name}</p>
                <p className="text-[10px] text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 shrink-0" /* smaller button */
              onClick={() => removeFile(index)}
            >
              <X size={12} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/50"> {/* reduced padding a bit */}
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
        <Upload size={16} className="text-white" />
      </div>
      <p className="text-xs font-medium text-gray-600 mb-1">No files uploaded yet</p> {/* smaller text */}
      <p className="text-[10px] text-gray-500">Click "Upload Files" to add your content</p>
    </div>
  )}
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
                Add Lesson
              </Button>
            </div>

            <div className="space-y-6 max-h-100 overflow-y-auto pr-2">
              {newContent.lesson.map((lessonItem, lessonIndex) => (
                <div
                  key={lessonIndex}
                  className="bg-gradient-to-br from-white via-gray-50 to-blue-50/30 rounded-xl p-4 border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {lessonIndex + 1}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        Lesson {lessonIndex + 1}
                      </span>
                    </div>
                    {newContent.lesson.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                        onClick={() => removeLessonItem(lessonIndex)}
                      >
                        <X size={14} />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Lesson Text */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Lesson Title */}
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-600">
      Lesson Title<span className="text-red-500 ml-1">*</span>
    </label>
    <Input
      value={lessonItem.text}
      onChange={(e) => updateLessonItem(lessonIndex, "text", e.target.value)}
      placeholder="Lesson title..."
      className="text-sm border-2 border-gray-200 hover:border-slate-300 focus:border-slate-400 transition-all duration-200 bg-white/80 backdrop-blur-sm h-9"
    />
  </div>

  {/* Lesson Audio */}
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-600">Lesson Audio</label>
    <div className="flex gap-2">
      <Input
        value={lessonItem.audio}
        onChange={(e) => updateLessonItem(lessonIndex, "audio", e.target.value)}
        placeholder="audio.mp3 or URL"
        className="text-sm flex-1 border-2 border-gray-200 hover:border-green-300 focus:border-green-400 transition-all duration-200 bg-white/80 backdrop-blur-sm h-9"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="px-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 hover:from-green-600 hover:to-emerald-600 h-9"
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "audio/*";
          input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              try {
                const fileName = `${Date.now()}_${file.name}`;
                const { data, error } = await supabase.storage.from("topics").upload(fileName, file);
                if (error) throw error;
                const { data: publicData } = supabase.storage.from("topics").getPublicUrl(fileName);
                if (publicData) {
                  updateLessonItem(lessonIndex, "audio", publicData.publicUrl);
                  toast({ title: "Success", description: "Audio uploaded successfully" });
                }
              } catch (error) {
                console.error("Audio upload failed:", error);
                toast({ variant: "destructive", title: "Error", description: "Failed to upload audio file" });
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

  {/* Lesson Video */}
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-600">Lesson Video</label>
    <div className="flex gap-2">
      <Input
        value={lessonItem.video}
        onChange={(e) => updateLessonItem(lessonIndex, "video", e.target.value)}
        placeholder="video.mp4 or URL"
        className="text-sm flex-1 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm h-9"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="px-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 hover:from-purple-600 hover:to-indigo-600 h-9"
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "video/*";
          input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              try {
                const fileName = `${Date.now()}_${file.name}`;
                const { data, error } = await supabase.storage.from("topics").upload(fileName, file);
                if (error) throw error;
                const { data: publicData } = supabase.storage.from("topics").getPublicUrl(fileName);
                if (publicData) {
                  updateLessonItem(lessonIndex, "video", publicData.publicUrl);
                  toast({ title: "Success", description: "Video uploaded successfully" });
                }
              } catch (error) {
                console.error("Video upload failed:", error);
                toast({ variant: "destructive", title: "Error", description: "Failed to upload video file" });
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


                    {/* Subheadings */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-medium text-gray-600">
                          Subheadings
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addSubHeading(lessonIndex)}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                        >
                          <Plus size={14} className="mr-1" />
                          Add Subheading
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {lessonItem.subHeading.map(
                          (subHeadingItem, subHeadingIndex) => (
                            <div
                              key={subHeadingIndex}
                              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs">
                                    {subHeadingIndex + 1}
                                  </div>
                                  <span className="text-xs font-medium text-gray-700">
                                    Subheading {subHeadingIndex + 1}
                                  </span>
                                </div>
                                {lessonItem.subHeading.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50"
                                    onClick={() =>
                                      removeSubHeading(lessonIndex, subHeadingIndex)
                                    }
                                  >
                                    <X size={12} />
                                  </Button>
                                )}
                              </div>

                              <div className="space-y-3">
                                {/* Subheading Text */}
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-gray-600">
                                    Text
                                    <span className="text-red-500 ml-1">*</span>
                                  </label>
                                  {mathInputTarget?.lessonIndex === lessonIndex &&
                                  mathInputTarget?.subHeadingIndex ===
                                    subHeadingIndex &&
                                  mathInputTarget?.field === "text" ? (
                                    <>
                              <div className="bg-white border-2 border-gray-200 rounded-lg p-4" style={{ height: '100%', minHeight: '100px' }}>
                                  <div
                                    ref={mathContainerRef}
                                    className="math-field-container"
                                    style={{ height: '100%', width: '100%' }}
                                  />
                                </div>
                                      {/* Quick Math Symbols */}
                                      <div className="space-y-3">
                                        <h4 className="text-xs font-medium text-gray-600">
                                          Quick Insert:
                                        </h4>
                           <div className="grid grid-cols-6 gap-2">
                            {[
                              { symbol: "\\frac{#@}{#?}", display: "𝑎/𝑏", label: "Fraction" },
                              { symbol: "#@^{#?}", display: "x²", label: "Power" },
                              { symbol: "\\sqrt{#@}", display: "√x", label: "Square Root" },
                              { symbol: "\\sum_{#@}^{#?}", display: "∑", label: "Sum" },
                              { symbol: "\\int_{#@}^{#?}", display: "∫", label: "Integral" },
                              { symbol: "\\alpha", display: "α", label: "Alpha" },
                              { symbol: "\\beta", display: "β", label: "Beta" },
                              { symbol: "\\pi", display: "π", label: "Pi" },
                              { symbol: "\\infty", display: "∞", label: "Infinity" },
                              { symbol: "\\leq", display: "≤", label: "Less Equal" },
                              { symbol: "\\geq", display: "≥", label: "Greater Equal" },
                              { symbol: "\\neq", display: "≠", label: "Not Equal" },
                            ].map((item, index) => (
                              <Button
                                key={index}
                                type="button"
                                variant="outline"
                                className="h-6 px-2 text-[10px] leading-tight border-gray-200 hover:bg-blue-50"
                                onClick={() => insertQuickSymbol(item.symbol)}
                                title={item.label}
                              >
                                {item.display}
                              </Button>
                            ))}
                          </div>

                                      </div>

                                      {/* Math Preview */}
                                      {mathExpression && (
                                        <div className="space-y-2">
                                          <h4 className="text-xs font-medium text-gray-600">
                                            Preview:
                                          </h4>
                                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[50px] flex items-center justify-center">
                                            <math-field
                                              read-only
                                              math-mode="math"
                                              value={mathExpression}
                                            />
                                          </div>
                                        </div>
                                      )}
<div className="flex justify-between">
  <Button
    type="button"
    onClick={() => setMathInputTarget(null)}
    variant="outline"
    className="text-xs h-8 px-3"
  >
    Back
  </Button>
  <Button
    type="button"
    onClick={insertMathExpression}
    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 hover:from-green-600 hover:to-emerald-600 text-xs h-8 px-4"
  >
    Insert
  </Button>
</div>


                                    </>
                                  ) : (
                                    <>
                                      <Textarea
                                        value={subHeadingItem.text}
                                        onChange={(e) =>
                                          updateSubHeadingItem(
                                            lessonIndex,
                                            subHeadingIndex,
                                            "text",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Subheading text..."
                                        className="border-2 border-gray-200 hover:border-slate-300 focus:border-slate-400 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none min-h-[80px]"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          toggleMathInput(
                                            lessonIndex,
                                            subHeadingIndex,
                                            "text"
                                          )
                                        }
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 text-xs"
                                      >
                                        <Calculator size={12} className="mr-1" />
                                        Add Math Expression
                                      </Button>
                                    </>
                                  )}
                                </div>

                                {/* Subheading Audio */}
                                <div className="space-y-2">
                                  <label className="text-xs font-medium text-gray-600">
                                    Audio
                                    <span className="text-red-500 ml-1">*</span>
                                  </label>
                                  <div className="flex gap-2">
                                    <Input
                                      value={subHeadingItem.subheadingAudioPath}
                                      onChange={(e) =>
                                        updateSubHeadingItem(
                                          lessonIndex,
                                          subHeadingIndex,
                                          "subheadingAudioPath",
                                          e.target.value
                                        )
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
                                              const fileName = `${Date.now()}_${file.name}`;
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
                                                updateSubHeadingItem(
                                                  lessonIndex,
                                                  subHeadingIndex,
                                                  "subheadingAudioPath",
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

                                {/* Additional Subheading Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-600">
                                      Question
                                    </label>
                                    <Input
                                      value={subHeadingItem.question}
                                      onChange={(e) =>
                                        updateSubHeadingItem(
                                          lessonIndex,
                                          subHeadingIndex,
                                          "question",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Question..."
                                      className="text-sm border-2 border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-600">
                                      Expected Answer
                                    </label>
                                    <Input
                                      value={subHeadingItem.expectedAnswer}
                                      onChange={(e) =>
                                        updateSubHeadingItem(
                                          lessonIndex,
                                          subHeadingIndex,
                                          "expectedAnswer",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Expected answer..."
                                      className="text-sm border-2 border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-600">
                                      Comment
                                    </label>
                                    <Input
                                      value={subHeadingItem.comment}
                                      onChange={(e) =>
                                        updateSubHeadingItem(
                                          lessonIndex,
                                          subHeadingIndex,
                                          "comment",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Comment..."
                                      className="text-sm border-2 border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-600">
                                      Hint
                                    </label>
                                    <Input
                                      value={subHeadingItem.hint}
                                      onChange={(e) =>
                                        updateSubHeadingItem(
                                          lessonIndex,
                                          subHeadingIndex,
                                          "hint",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Hint..."
                                      className="text-sm border-2 border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

   
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 bg-gray-50/80 border-t border-gray-200">
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
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
        </div>
      </div>
    </div>
  );
};

export default CreateNewContent;