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
  Save,
  Play,
  Pause,
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
  _id?: string;
}

interface LessonItem {
  text: string;
  subHeading: SubHeadingItem[];
  audio: string;
  video: string;
  _id?: string;
}
interface ContentFormData {
  _id?: string;
  title: string;
  description: string;
  lesson: LessonItem[];
  file_path: string[];
  file_type: "video" | "audio" | "document";
  Topic: string;
}

const EditContent: React.FC = () => {
  const { contentId, topicId } = useParams<{ contentId: string; topicId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [content, setContent] = useState<ContentFormData>({
    title: "",
    description: "",
    lesson: [{
      text: "",
      subHeading: [{
        text: "",
        question: "",
        subheadingAudioPath: "",
        expectedAnswer: "",
        comment: "",
        hint: "",
      }],
      audio: "",
      video: "",
    }],
    file_path: [],
    file_type: "document",
    Topic: topicId || "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [currentQuestionData, setCurrentQuestionData] = useState({
    lessonIndex: -1,
    subHeadingIndex: -1,
  });
  const [audioUploadStatus, setAudioUploadStatus] = useState<"idle" | "uploading" | "success">("idle");
  const [audioStatus, setAudioStatus] = useState<"idle" | "uploading" | "success">("idle");
  const [videoStatus, setVideoStatus] = useState<"idle" | "uploading" | "success">("idle");
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [initialExistingFileCount, setInitialExistingFileCount] = useState(0);

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

  // Fetch content data
  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!contentId) return;
        
        const response = await TopicContentService.getTopicContentById(contentId);
        const contentData = response.data;
        
        setContent({
          _id: contentData._id,
          title: contentData.title,
          description: contentData.description,
          lesson: contentData.lesson.map((lessonItem: any) => ({
            _id: lessonItem._id,
            text: lessonItem.text,
            audio: lessonItem.audio,
            video: lessonItem.video,
            subHeading: lessonItem.subHeading?.map((subItem: any) => ({
              _id: subItem._id,
              text: subItem.text,
              subheadingAudioPath: subItem.subheadingAudioPath,
              question: subItem.question,
              expectedAnswer: subItem.expectedAnswer,
              comment: subItem.comment,
              hint: subItem.hint,
            })) || []
          })),
          file_path: contentData.file_path,
          file_type: contentData.file_type,
          Topic: contentData.Topic._id,
        });
        
        setInitialExistingFileCount(contentData.file_path.length);
      } catch (error) {
        console.error("Failed to fetch content:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load content data. Please try again.",
        });
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [contentId, toast, navigate]);

  const insertMathExpression = () => {
    if (mathExpression && mathFieldRef.current && mathInputTarget) {
      const latex = mathFieldRef.current.value;
      const { lessonIndex, subHeadingIndex, field } = mathInputTarget;
      
      const lesson = [...content.lesson];
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
      
      setContent({
        ...content,
        lesson
      });
      
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
    setContent((prev) => ({
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
    setActiveLessonIndex(content.lesson.length);
  };
  const removeLessonItem = (index: number) => {
    if (content.lesson.length > 1) {
      setContent((prev) => ({
        ...prev,
        lesson: prev.lesson.filter((_, i) => i !== index),
      }));
      if (index === activeLessonIndex) {
        setActiveLessonIndex(Math.max(0, index - 1));
      }
    }
  };
  const addSubHeading = (lessonIndex: number) => {
    const updatedLessons = [...content.lesson];
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
    setContent({
      ...content,
      lesson: updatedLessons,
    });
  };

  const removeSubHeading = (lessonIndex: number, subHeadingIndex: number) => {
    if (content.lesson[lessonIndex].subHeading.length > 1) {
      const updatedLessons = [...content.lesson];
      updatedLessons[lessonIndex] = {
        ...updatedLessons[lessonIndex],
        subHeading: updatedLessons[lessonIndex].subHeading.filter(
          (_, i) => i !== subHeadingIndex
        ),
      };
      setContent({
        ...content,
        lesson: updatedLessons,
      });
    }
  };

  const updateLessonItem = (
    lessonIndex: number,
    field: keyof LessonItem,
    value: string
  ) => {
    const updatedLessons = [...content.lesson];
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      [field]: value,
    };
    setContent({
      ...content,
      lesson: updatedLessons,
    });
  };

  const updateSubHeadingItem = (
    lessonIndex: number,
    subHeadingIndex: number,
    field: keyof SubHeadingItem,
    value: string
  ) => {
    const updatedLessons = [...content.lesson];
    const updatedSubHeadings = [...updatedLessons[lessonIndex].subHeading];
    updatedSubHeadings[subHeadingIndex] = {
      ...updatedSubHeadings[subHeadingIndex],
      [field]: value,
    };
    updatedLessons[lessonIndex] = {
      ...updatedLessons[lessonIndex],
      subHeading: updatedSubHeadings,
    };
    setContent({
      ...content,
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
    setContent((prev) => ({
      ...prev,
      file_path: [...prev.file_path, ...tempFilePaths],
    }));
  };

  const removeFile = (index: number) => {
    setContent((prev) => ({
      ...prev,
      file_path: prev.file_path.filter((_, i) => i !== index),
    }));
    
    // Remove from uploadedFiles if it's a new file
    if (index >= initialExistingFileCount) {
      const uploadedIndex = index - initialExistingFileCount;
      setUploadedFiles(prev => prev.filter((_, i) => i !== uploadedIndex));
    }
  };

  const togglePlayAudio = (index: number) => {
    if (playingAudio === index) {
      audioRefs.current[index]?.pause();
      setPlayingAudio(null);
    } else {
      if (playingAudio !== null) {
        audioRefs.current[playingAudio]?.pause();
      }
      audioRefs.current[index]?.play();
      setPlayingAudio(index);
    }
  };

  const togglePlayVideo = (index: number) => {
    if (playingVideo === index) {
      videoRefs.current[index]?.pause();
      setPlayingVideo(null);
    } else {
      if (playingVideo !== null) {
        videoRefs.current[playingVideo]?.pause();
      }
      videoRefs.current[index]?.play();
      setPlayingVideo(index);
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

  const handleUpdateContent = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!content.title.trim()) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Title is required",
        });
        return;
      }

      if (!content.description.trim()) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Short description is required",
        });
        return;
      }

      // Validate lesson titles
      const lessonErrors: number[] = [];
      content.lesson.forEach((lesson, index) => {
        if (!lesson.text.trim()) {
          lessonErrors.push(index + 1);
        }
      });

      if (lessonErrors.length > 0) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: `Lesson titles are required for lessons: ${lessonErrors.join(", ")}`,
        });
        return;
      }
      // Upload new files if any
      let uploadedUrls = [...content.file_path];
      if (uploadedFiles.length > 0) {
        const newUrls = await uploadFilesToSupabase(uploadedFiles);
        uploadedUrls = [
          ...content.file_path.slice(0, initialExistingFileCount),
          ...newUrls
        ];
      }

      const contentToUpdate = {
        ...content,
        file_path: uploadedUrls,
      };

      await TopicContentService.updateTopicContent(content._id || '', contentToUpdate);

      toast({
        title: "Success",
        description: "Content updated successfully",
      });

      navigate(-1);
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

  const openQuestionModal = (lessonIndex: number, subHeadingIndex: number) => {
    setCurrentQuestionData({ lessonIndex, subHeadingIndex });
    setShowQuestionModal(true);
  };

  const saveQuestion = () => {
    setShowQuestionModal(false);
  };

  // Get the current subheading item for the modal
  const currentSubHeadingItem = currentQuestionData.lessonIndex !== -1 && 
    currentQuestionData.subHeadingIndex !== -1
    ? content.lesson[currentQuestionData.lessonIndex].subHeading[currentQuestionData.subHeadingIndex]
    : null;

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

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
                  <FileText size={24} className="text-white" />
                </div>
                Edit Content
              </h1>
              <p className="text-blue-100 mt-2 text-sm">
                Update and manage your content
              </p>
            </div>
            <div className="w-12"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Content Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            <div className="space-y-2">
              <Input
                value={content.title}
                onChange={(e) =>
                  setContent({ ...content, title: e.target.value })
                }
                placeholder="Title"
                className="h-10 text-sm border border-gray-200 hover:border-green-300 focus:border-green-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            </div>
            <div className="space-y-2">
              <Textarea
                value={content.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    description: e.target.value,
                  })
                }
                placeholder="Short description..."
                rows={2}
                className="text-sm border border-gray-200 hover:border-purple-300 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none h-20"
              />
            </div>
          </div>

          {/* Lesson Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {content.lesson.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveLessonIndex(index)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  activeLessonIndex === index
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                Lesson {index + 1}
              </button>
            ))}
            <button
              onClick={addLessonItem}
              className="px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-medium text-sm flex items-center gap-1 hover:from-orange-600 hover:to-red-600 transition-all duration-200"
            >
              <Plus size={16} /> Add Lesson
            </button>
          </div>

          {/* Active Lesson Content */}
          <div className="space-y-6">
            {content.lesson.map(
              (lessonItem, lessonIndex) =>
                lessonIndex === activeLessonIndex && (
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
                      {content.lesson.length > 1 && (
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
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Lesson Title */}
                        <div className="space-y-1">
                          <Input
                            value={lessonItem.text}
                            onChange={(e) =>
                              updateLessonItem(lessonIndex, "text", e.target.value)
                            }
                            placeholder="Lesson title..."
                            className="text-sm border-2 border-gray-200 hover:border-slate-300 focus:border-slate-400 transition-all duration-200 bg-white/80 backdrop-blur-sm h-9"
                          />
                        </div>

                        {/* Lesson Audio/Video */}
                        <div className="space-y-1">
                          <div className="flex gap-2">
                            {/* Audio Upload */}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={audioStatus === "uploading"}
                              className={`flex items-center gap-2 px-3 text-white h-9 border-0 shadow-md transition-all duration-200 ${
                                audioStatus === "success" || lessonItem.audio
                                  ? "bg-green-600"
                                  : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                              }`}
                              onClick={async () => {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = "audio/*";
                                input.onchange = async (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) {
                                    setAudioStatus("uploading");
                                    try {
                                      const fileName = `${Date.now()}_${file.name}`;
                                      const { error } = await supabase.storage
                                        .from("topics")
                                        .upload(fileName, file);
                                      if (error) throw error;
            
                                      const { data: publicData } = supabase.storage
                                        .from("topics")
                                        .getPublicUrl(fileName);
                                      if (publicData) {
                                        updateLessonItem(lessonIndex, "audio", publicData.publicUrl);
                                        setAudioStatus("success");
                                        toast({
                                          title: "Success",
                                          description: "Audio uploaded successfully",
                                        });
                                      }
                                    } catch (error) {
                                      console.error("Audio upload failed:", error);
                                      toast({
                                        variant: "destructive",
                                        title: "Error",
                                        description: "Failed to upload audio file",
                                      });
                                      setAudioStatus("idle");
                                    } finally {
                                      setTimeout(() => setAudioStatus("idle"), 2000);
                                    }
                                  }
                                };
                                input.click();
                              }}
                            >
                              <Music size={16} />
                              {audioStatus === "uploading"
                                ? "Uploading..."
                                : audioStatus === "success" || lessonItem.audio
                                ? "Uploaded"
                                : "Upload Audio"}
                            </Button>

                            {/* Video Upload */}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={videoStatus === "uploading"}
                              className={`flex items-center gap-2 px-3 text-white h-9 border-0 shadow-md transition-all duration-200 ${
                                videoStatus === "success" || lessonItem.video
                                  ? "bg-indigo-600"
                                  : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                              }`}
                              onClick={async () => {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = "video/*";
                                input.onchange = async (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) {
                                    setVideoStatus("uploading");
                                    try {
                                      const fileName = `${Date.now()}_${file.name}`;
                                      const { error } = await supabase.storage
                                        .from("topics")
                                        .upload(fileName, file);
                                      if (error) throw error;
            
                                      const { data: publicData } = supabase.storage
                                        .from("topics")
                                        .getPublicUrl(fileName);
                                      if (publicData) {
                                        updateLessonItem(lessonIndex, "video", publicData.publicUrl);
                                        setVideoStatus("success");
                                        toast({
                                          title: "Success",
                                          description: "Video uploaded successfully",
                                        });
                                      }
                                    } catch (error) {
                                      console.error("Video upload failed:", error);
                                      toast({
                                        variant: "destructive",
                                        title: "Error",
                                        description: "Failed to upload video file",
                                      });
                                      setVideoStatus("idle");
                                    } finally {
                                      setTimeout(() => setVideoStatus("idle"), 2000);
                                    }
                                  }
                                };
                                input.click();
                              }}
                            >
                              <Video size={16} />
                              {videoStatus === "uploading"
                                ? "Uploading..."
                                : videoStatus === "success" || lessonItem.video
                                ? "Uploaded"
                                : "Upload Video"}
                            </Button>
                          </div>
                        </div>

                        {/* Audio/Video Playback */}
                        <div className="flex gap-2">
                          {lessonItem.audio && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => togglePlayAudio(lessonIndex)}
                              className="flex items-center gap-1"
                            >
                              {playingAudio === lessonIndex ? <Pause size={14} /> : <Play size={14} />}
                              Play Audio
                              <audio 
                                ref={el => audioRefs.current[lessonIndex] = el!}
                                src={lessonItem.audio}
                                onEnded={() => setPlayingAudio(null)}
                              />
                            </Button>
                          )}
                          {lessonItem.video && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => togglePlayVideo(lessonIndex)}
                              className="flex items-center gap-1"
                            >
                              {playingVideo === lessonIndex ? <Pause size={14} /> : <Play size={14} />}
                              Play Video
                              <video 
                                ref={el => videoRefs.current[lessonIndex] = el!}
                                src={lessonItem.video}
                                onEnded={() => setPlayingVideo(null)}
                                className="hidden"
                              />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Subheadings */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-medium text-gray-600">
                            Sections
                          </label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addSubHeading(lessonIndex)}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                          >
                            <Plus size={14} className="mr-1" />
                            Add Section
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
                                      Section {subHeadingIndex + 1}
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
                                    {mathInputTarget?.lessonIndex ===
                                      lessonIndex &&
                                    mathInputTarget?.subHeadingIndex ===
                                      subHeadingIndex &&
                                    mathInputTarget?.field === "text" ? (
                                      <>
                                        <div
                                          className="bg-white border-2 border-gray-200 rounded-lg p-4"
                                          style={{
                                            height: "100%",
                                            minHeight: "100px",
                                          }}
                                        >
                                          <div
                                            ref={mathContainerRef}
                                            className="math-field-container"
                                            style={{ height: "100%", width: "100%" }}
                                          />
                                        </div>

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
                                          placeholder="Section text..."
                                          className="border-2 border-gray-200 hover:border-slate-300 focus:border-slate-400 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none min-h-[80px]"
                                        />
                                        <div className="flex justify-between items-center w-full">
                                          <div className="flex items-center gap-2 w-2/3">
                                            {/* Audio Upload for Subheading */}
                                            <Button
                                              type="button"
                                              variant="outline"
                                              size="sm"
                                              disabled={audioUploadStatus === "uploading"}
                                              className={`flex items-center gap-2 px-3 text-white h-9 shadow-md transition-all duration-200 border-0 ${
                                                audioUploadStatus === "success" || subHeadingItem.subheadingAudioPath
                                                  ? "bg-green-600"
                                                  : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                              }`}
                                              onClick={async () => {
                                                const input = document.createElement("input");
                                                input.type = "file";
                                                input.accept = "audio/*";
                                                input.onchange = async (e) => {
                                                  const file = (e.target as HTMLInputElement).files?.[0];
                                                  if (file) {
                                                    setAudioUploadStatus("uploading");
                                                    try {
                                                      const fileName = `${Date.now()}_${file.name}`;
                                                      const { error } = await supabase.storage
                                                        .from("topics")
                                                        .upload(fileName, file);
                                                      if (error) throw error;
                            
                                                      const { data: publicData } = supabase.storage
                                                        .from("topics")
                                                        .getPublicUrl(fileName);
                                                      if (publicData) {
                                                        updateSubHeadingItem(
                                                          lessonIndex,
                                                          subHeadingIndex,
                                                          "subheadingAudioPath",
                                                          publicData.publicUrl
                                                        );
                                                        setAudioUploadStatus("success");
                                                        toast({
                                                          title: "Success",
                                                          description: "Audio uploaded successfully",
                                                        });
                                                      }
                                                    } catch (error) {
                                                      console.error("Audio upload failed:", error);
                                                      toast({
                                                        variant: "destructive",
                                                        title: "Error",
                                                        description: "Failed to upload audio file",
                                                      });
                                                      setAudioUploadStatus("idle");
                                                    } finally {
                                                      setTimeout(() => setAudioUploadStatus("idle"), 2000);
                                                    }
                                                  }
                                                };
                                                input.click();
                                              }}
                                            >
                                              <Music size={16} />
                                              {audioUploadStatus === "uploading"
                                                ? "Uploading Audio..."
                                                : audioUploadStatus === "success" || subHeadingItem.subheadingAudioPath
                                                ? "Audio Uploaded"
                                                : "Upload Audio"}
                                            </Button>

                                            {/* Play Audio for Subheading */}
                                            {subHeadingItem.subheadingAudioPath && (
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                  const audio = new Audio(subHeadingItem.subheadingAudioPath);
                                                  audio.play();
                                                }}
                                                className="flex items-center gap-1"
                                              >
                                                <Play size={14} />
                                                Play
                                              </Button>
                                            )}
                                          </div>

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
                                            Add Math
                                          </Button>
                                        </div>

                                        <div className="space-y-2">
                                          <Textarea
                                            value={subHeadingItem.comment}
                                            onChange={(e) =>
                                              updateSubHeadingItem(
                                                lessonIndex,
                                                subHeadingIndex,
                                                "comment",
                                                e.target.value
                                              )
                                            }
                                            placeholder="Add Comment..."
                                            className="text-sm border-2 border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                          />
                                        </div>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            openQuestionModal(
                                              lessonIndex,
                                              subHeadingIndex
                                            )
                                          }
                                          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                                        >
                                          <Plus size={14} className="mr-1" />
                                          Add Question
                                        </Button>
                                      </>
                                    )}
                                  </div>

                                  {/* Show question if it exists */}
                                  {subHeadingItem.question && (
                                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                                      <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                          <h4 className="text-xs font-medium text-blue-800">
                                            Question:
                                          </h4>
                                          <p className="text-sm text-blue-900">
                                            {subHeadingItem.question}
                                          </p>
                                        </div>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 text-blue-400 hover:text-blue-600"
                                          onClick={() =>
                                            openQuestionModal(
                                              lessonIndex,
                                              subHeadingIndex
                                            )
                                          }
                                        >
                                          <FileText size={14} />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 bg-gray-50/80 border-t border-gray-200">
          <div className="flex justify-between w-full items-center">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="h-12 px-6 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </Button>

            <Button
              onClick={handleUpdateContent}
              disabled={isSubmitting}
              className="h-12 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white border-0 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:hover:shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
                  Updating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save size={16} />
                  Update Content
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Question Modal */}
      {showQuestionModal && currentSubHeadingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Edit Question</h3>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Question Field */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">
                  Question
                </label>
                <div className="flex gap-2">
                  <Textarea
                    value={currentSubHeadingItem.question}
                    onChange={(e) =>
                      updateSubHeadingItem(
                        currentQuestionData.lessonIndex,
                        currentQuestionData.subHeadingIndex,
                        "question",
                        e.target.value
                      )
                    }
                    placeholder="Enter your question..."
                    className="border-2 border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none min-h-[80px]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toggleMathInput(
                        currentQuestionData.lessonIndex,
                        currentQuestionData.subHeadingIndex,
                        "question"
                      )
                    }
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 h-10"
                  >
                    <Calculator size={14} className="mr-1" />
                    Math
                  </Button>
                </div>
              </div>

              {/* Expected Answer Field */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">
                  Expected Answer
                </label>
                <div className="flex gap-2">
                  <Input
                    value={currentSubHeadingItem.expectedAnswer}
                    onChange={(e) =>
                      updateSubHeadingItem(
                        currentQuestionData.lessonIndex,
                        currentQuestionData.subHeadingIndex,
                        "expectedAnswer",
                        e.target.value
                      )
                    }
                    placeholder="Expected answer..."
                    className="border-2 border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toggleMathInput(
                        currentQuestionData.lessonIndex,
                        currentQuestionData.subHeadingIndex,
                        "expectedAnswer"
                      )
                    }
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 h-10"
                  >
                    <Calculator size={14} className="mr-1" />
                    Math
                  </Button>
                </div>
              </div>

              {/* Hint Field */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">
                  Hint
                </label>
                <div className="flex gap-2">
                  <Input
                    value={currentSubHeadingItem.hint}
                    onChange={(e) =>
                      updateSubHeadingItem(
                        currentQuestionData.lessonIndex,
                        currentQuestionData.subHeadingIndex,
                        "hint",
                        e.target.value
                      )
                    }
                    placeholder="Hint for the question..."
                    className="border-2 border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toggleMathInput(
                        currentQuestionData.lessonIndex,
                        currentQuestionData.subHeadingIndex,
                        "hint"
                      )
                    }
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 transition-all duration-200 h-10"
                  >
                    <Calculator size={14} className="mr-1" />
                    Math
                  </Button>
                </div>
              </div>

              {/* Math Input Section (conditionally rendered) */}
              {mathInputTarget?.lessonIndex === currentQuestionData.lessonIndex &&
                mathInputTarget?.subHeadingIndex ===
                  currentQuestionData.subHeadingIndex && (
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div
                      className="bg-white border-2 border-gray-200 rounded-lg p-4"
                      style={{
                        height: "100%",
                        minHeight: "100px",
                      }}
                    >
                      <div
                        ref={mathContainerRef}
                        className="math-field-container"
                        style={{ height: "100%", width: "100%" }}
                      />
                    </div>

                    {mathExpression && (
                      <div className="space-y-2 mt-2">
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

                    <div className="flex justify-between mt-3">
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
                  </div>
                )}

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowQuestionModal(false)}
                  className="border-2 border-gray-300 hover:border-gray-400"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveQuestion}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EditContent;