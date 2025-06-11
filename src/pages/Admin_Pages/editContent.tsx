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

interface ContentFormData {
  _id?: string;
  title: string;
  description: string;
  lesson: Array<{
    text: string;
    audio: string;
    video: string;
    subHeading?: Array<{
      text: string;
      subheadingAudioPath: string;
      question: string;
      expectedAnswer: string;
      comment: string;
      hint: string;
      _id?: string;
    }>;
    _id?: string;
  }>;
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
    lesson: [{ text: "", audio: "", video: "" }],
    file_path: [],
    file_type: "document",
    Topic: topicId || "",
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [playingAudio, setPlayingAudio] = useState<number | null>(null);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const audioRefs = useRef<HTMLAudioElement[]>([]);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  // MathLive state
  const [mathExpression, setMathExpression] = useState("");
  const mathFieldRef = useRef<MathfieldElement | null>(null);
  const mathContainerRef = useRef<HTMLDivElement>(null);
  const [showMathInput, setShowMathInput] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch content data when component mounts
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

  // Initialize MathLive when showMathInput changes
  useEffect(() => {
    if (showMathInput === null || !mathContainerRef.current) return;

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
  }, [showMathInput]);

  // Handle audio play/pause
  const toggleAudio = (index: number) => {
    // Stop any playing video
    if (playingVideo !== null) {
      const videoElement = videoRefs.current[playingVideo];
      if (videoElement) {
        videoElement.pause();
        setPlayingVideo(null);
      }
    }

    const audioElement = audioRefs.current[index];
    
    if (!audioElement) return;
    
    if (playingAudio === index) {
      audioElement.pause();
      setPlayingAudio(null);
    } else {
      // Pause any currently playing audio
      if (playingAudio !== null) {
        const currentAudio = audioRefs.current[playingAudio];
        if (currentAudio) currentAudio.pause();
      }
      
      audioElement.currentTime = 0;
      audioElement.play()
        .then(() => setPlayingAudio(index))
        .catch(error => {
          console.error("Audio playback failed:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to play audio. Please check the URL.",
          });
        });
    }
  };

// Pause audio and toggle video visibility (video stays paused)
const toggleVideo = (index: number) => {
  /* 1️⃣  Stop any playing audio */
  if (playingAudio !== null) {
    const audio = audioRefs.current[playingAudio];
    if (audio) audio.pause();
    setPlayingAudio(null);
  }

  /* 2️⃣  Grab the target <video> */
  const video = videoRefs.current[index];
  if (!video) return;

  /* 3️⃣  If the same video is already shown, hide / reset it */
  if (playingVideo === index) {
    video.pause();
    video.currentTime = 0;          // rewind to poster / first frame
    setPlayingVideo(null);
    return;
  }

  /* 4️⃣  Otherwise make this the active video (but keep it paused) */
  if (playingVideo !== null) {
    const current = videoRefs.current[playingVideo];
    if (current) {
      current.pause();
      current.currentTime = 0;
    }
  }

  video.currentTime = 0;            // make sure first frame is rendered
  video.load();                     // refresh in case the source changed
  setPlayingVideo(index);           // now the UI can show this video
};

  // Clean up audio/video elements on unmount
  useEffect(() => {
    return () => {
      // Stop all media playback
      if (playingAudio !== null) {
        const audio = audioRefs.current[playingAudio];
        if (audio) audio.pause();
      }
      if (playingVideo !== null) {
        const video = videoRefs.current[playingVideo];
        if (video) video.pause();
      }
      
      // Clean up refs
      audioRefs.current = [];
      videoRefs.current = [];
    };
  }, []);

  const insertMathExpression = (index: number) => {
    if (mathExpression && mathFieldRef.current) {
      const latex = mathFieldRef.current.value;
      const currentText = content.lesson[index].text;
      const newText = currentText + ` \\(${latex}\\) `;
      
      updateLessonItem(index, "text", newText);
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

  const toggleMathInput = (index: number) => {
    setShowMathInput(showMathInput === index ? null : index);
    setMathExpression("");
  };

  const addLessonItem = () => {
    setContent((prev) => ({
      ...prev,
      lesson: [...prev.lesson, { text: "", audio: "", video: "" }],
    }));
  };

  const removeLessonItem = (index: number) => {
    if (content.lesson.length > 1) {
      setContent((prev) => ({
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
    setContent((prev) => ({
      ...prev,
      lesson: prev.lesson.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
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
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setContent((prev) => ({
      ...prev,
      file_path: prev.file_path.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateContent = async () => {
    try {
      setIsSubmitting(true);

      if (
        !content.title.trim() ||
        !content.description.trim() ||
        !content.file_path.length ||
        content.lesson.some((item) => !item.text.trim())
      ) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description:
            "Please fill all required fields, add lesson text, and ensure at least one file is uploaded",
        });
        return;
      }

      // Upload new files if any
      let uploadedUrls = [...content.file_path];
      if (uploadedFiles.length > 0) {
        const newUrls = await uploadFilesToSupabase(uploadedFiles);
        uploadedUrls = [...content.file_path.filter(url => !url.startsWith('blob:')), ...newUrls];
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

      navigate(-1); // Go back to previous page
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 w-full">
      <div className="w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
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
                Update your existing content
              </p>
            </div>
            <div className="w-12"></div> {/* Spacer for alignment */}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Content Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              Content Type
              <span className="text-red-500">*</span>
            </label>
            <Select
              value={content.file_type}
              onValueChange={(value) =>
                setContent({
                  ...content,
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
                value={content.title}
                onChange={(e) =>
                  setContent({ ...content, title: e.target.value })
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
                value={content.description}
                onChange={(e) =>
                  setContent({
                    ...content,
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

            <div className="space-y-4 max-h-100 overflow-y-auto pr-2">
              {content.lesson.map((lessonItem, index) => (
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
                    {content.lesson.length > 1 && (
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
                    {/* Text Input Section */}
                    <div className="col-span-3">
                      <label className="text-xs font-medium text-gray-600 mb-2 block">
                        Text Content
                      </label>
                      <div className="space-y-3">
                        {showMathInput === index ? (
                          <>
                            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 min-h-[100px]">
                              <div ref={mathContainerRef} className="math-field-container" />
                            </div>

                            {/* Quick Math Symbols */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium text-gray-600">
                                Quick Insert:
                              </h4>
                              <div className="grid grid-cols-4 gap-2">
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
                                    size="sm"
                                    className="h-10 text-sm hover:bg-blue-50 border-gray-200"
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
                                <h4 className="text-sm font-medium text-gray-600">
                                  Preview:
                                </h4>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 min-h-[50px] flex items-center justify-center">
                                  <math-field read-only math-mode="math" value={mathExpression} />
                                </div>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button
                                type="button"
                                onClick={() => toggleMathInput(index)}
                                variant="outline"
                                className="flex-1"
                              >
                                Back to Text
                              </Button>
                              <Button
                                type="button"
                                onClick={() => insertMathExpression(index)}
                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 hover:from-green-600 hover:to-emerald-600"
                              >
                                Insert Math
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <Textarea
                              ref={textareaRef}
                              value={lessonItem.text}
                              onChange={(e) =>
                                updateLessonItem(index, "text", e.target.value)
                              }
                              placeholder="Enter lesson text..."
                              className="border-2 border-gray-200 hover:border-slate-300 focus:border-slate-400 transition-all duration-200 bg-white/80 backdrop-blur-sm resize-none min-h-[100px]"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => toggleMathInput(index)}
                              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                            >
                              <Calculator size={14} className="mr-1" />
                              Add Math Expression
                            </Button>
                          </>
                        )}
                      </div>
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
                                  const fileName = `${Date.now()}_${file.name}`;
                                  const { data, error } = await supabase.storage
                                    .from("topics")
                                    .upload(fileName, file);

                                  if (error) throw error;

                                  const { data: publicData } = supabase.storage
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
                                }
                              }
                            };
                            input.click();
                          }}
                        >
                          <Upload size={14} />
                        </Button>
                      </div>
                      {lessonItem.audio && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <audio
                              ref={el => {
                                if (el) {
                                  audioRefs.current[index] = el;
                                }
                              }}
                              src={lessonItem.audio}
                              onEnded={() => setPlayingAudio(null)}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => toggleAudio(index)}
                              className="flex items-center gap-2"
                            >
                              {playingAudio === index ? (
                                <>
                                  <Pause size={14} />
                                  <span>Pause Audio</span>
                                </>
                              ) : (
                                <>
                                  <Play size={14} />
                                  <span>Play Audio</span>
                                </>
                              )}
                            </Button>
                            <span className="text-xs text-gray-500 truncate">
                              {lessonItem.audio.split('/').pop()}
                            </span>
                          </div>
                        </div>
                      )}
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
                                  const fileName = `${Date.now()}_${file.name}`;
                                  const { data, error } = await supabase.storage
                                    .from("topics")
                                    .upload(fileName, file);

                                  if (error) throw error;

                                  const { data: publicData } = supabase.storage
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
                                }
                              }
                            };
                            input.click();
                          }}
                        >
                          <Upload size={14} />
                        </Button>
                      </div>
                      {lessonItem.video && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <video
                              ref={el => {
                                if (el) {
                                  videoRefs.current[index] = el;
                                }
                              }}
                              src={lessonItem.video}
                              onEnded={() => setPlayingVideo(null)}
                              className="hidden"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => toggleVideo(index)}
                              className="flex items-center gap-2"
                            >
                              {playingVideo === index ? (
                                <>
                                  <Pause size={14} />
                                  <span>Pause Video</span>
                                </>
                              ) : (
                                <>
                                  <Play size={14} />
                                  <span>Play Video</span>
                                </>
                              )}
                            </Button>
                            <span className="text-xs text-gray-500 truncate">
                              {lessonItem.video.split('/').pop()}
                            </span>
                          </div>
                          {playingVideo === index && (
                            <div className="mt-2">
                              <video
                                controls
                                src={lessonItem.video}
                                className="w-full rounded-lg border border-gray-200"
                                // onEnded={() => setPlayingVideo(null)}
                                // autoPlay
                              />
                            </div>
                          )}
                        </div>
                      )}
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
                onClick={() => triggerFileInput()}
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
              accept={getAcceptedFileTypes(content.file_type)}
              multiple
            />

            {content.file_path.length > 0 ? (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-xl p-4 max-h-32 overflow-y-auto border-2 border-gray-100">
                <div className="space-y-2">
                  {content.file_path.map((filePath, index) => (
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
                            {filePath.split('/').pop()}
                          </p>
                          <p className="text-xs text-gray-500">
                            File URL
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
              onClick={handleUpdateContent}
              disabled={isSubmitting}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white border-0 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:hover:shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full border-2 border-t-transparent border-white animate-spin" />
                  Updating Content...
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
    </div>
  );
};

export default EditContent;