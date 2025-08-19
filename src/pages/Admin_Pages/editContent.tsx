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
  ChevronLeft,
  Edit,
  Check,
  ChevronDown,
  Image as ImageIcon
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import TopicContentService from "@/services/Admin_Service/Topic_Content_service";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/helper/SupabaseClient";
import { MathfieldElement } from "mathlive";

// Define file type extensions mapping
const fileTypeExtensions = {
  video: [".mp4", ".avi", ".mov", ".wmv", ".mkv", ".webm"],
  audio: [".mp3", ".wav", ".ogg", ".m4a", ".flac", ".aac"],
  document: [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".txt"],
  image: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".webp"]
};

interface SubHeadingItem {
  text: string;
  question: string;
  subheadingAudioPath: string;
  expectedAnswer: string;
  comment: string;
  hint: string;
  imagePath: string;
  _id?: string;
}

interface LessonItem {
  text: string;
  subHeading: SubHeadingItem[];
  audio: string;
  video: string;
  image: string;
  _id?: string;
}

interface ContentFormData {
  _id?: string;
  title: string;
  description: string;
  lesson: LessonItem[];
  file_path: string[];
  file_type: "video" | "audio" | "document" | "image";
  Topic: string;
}

// Helper function to extract LaTeX from text
const extractLatexFromText = (text: string): string => {
  if (!text) return "";
  if (text.startsWith("\\(") && text.endsWith("\\)")) {
    return text.substring(2, text.length - 2);
  }
  return text;
};

// Helper function to extract filename from URL
const extractFilenameFromUrl = (url: string): string => {
  if (!url) return "";
  try {
    const decodedUrl = decodeURIComponent(url);
    const filenameWithParams = decodedUrl.split('/').pop() || '';
    const filename = filenameWithParams.split('?')[0];
    const timestampRegex = /^\d+_/;
    return filename.replace(timestampRegex, '');
  } catch (e) {
    console.error("Error extracting filename:", e);
    return url;
  }
};

// Helper function to shorten filename for display
const shortenFilename = (filename: string, maxLength: number = 20): string => {
  if (!filename) return "";
  if (filename.length <= maxLength) return filename;
  const extensionIndex = filename.lastIndexOf('.');
  const extension = extensionIndex !== -1 ? filename.slice(extensionIndex) : '';
  const nameWithoutExtension = extensionIndex !== -1 ? filename.slice(0, extensionIndex) : filename;
  const shortenedName = nameWithoutExtension.slice(0, maxLength - extension.length - 3) + '...';
  return shortenedName + extension;
};

// Reusable Math Input Component
interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  editing: boolean;
  placeholder?: string;
  className?: string;
}

const MathInput: React.FC<MathInputProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
  editing,
  placeholder = "",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mathfieldRef = useRef<MathfieldElement | null>(null);
  const ignoreNextChange = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mathfieldRef.current) {
      const mf = new MathfieldElement();
      mathfieldRef.current = mf;

      mf.setOptions({
        defaultMode: "math",
        smartMode: true,
        virtualKeyboardMode: "onfocus",
        virtualKeyboards: "all",
        inlineShortcuts: {
          "++": "\\plus",
          "->": "\\rightarrow",
        },
        readOnly: !editing,
      });

      mf.style.width = "100%";
      mf.style.minHeight = !editing ? "auto" : "60px";
      mf.style.padding = !editing ? "0" : "8px";
      mf.style.border = !editing ? "none" : "1px solid #d1d5db";
      mf.style.borderRadius = "6px";
      mf.style.backgroundColor = !editing ? "transparent" : "#fff";

      if (!editing) {
        mf.style.pointerEvents = "none";
        mf.style.cursor = "default";
      }

      mf.addEventListener("input", (evt) => {
        if (!editing) return;
        ignoreNextChange.current = true;
        onChange(`\\(${(evt.target as MathfieldElement).value}\\)`);
      });

      containerRef.current.appendChild(mf);
    }

    // Set initial value
    const unwrappedValue = extractLatexFromText(value || "");
    if (mathfieldRef.current.value !== unwrappedValue) {
      mathfieldRef.current.value = unwrappedValue;
    }

    // Update readOnly state
    mathfieldRef.current.setOptions({ readOnly: !editing });
    mathfieldRef.current.style.pointerEvents = editing ? "auto" : "none";
    mathfieldRef.current.style.backgroundColor = editing ? "#fff" : "transparent";
    mathfieldRef.current.style.minHeight = editing ? "60px" : "auto";
    mathfieldRef.current.style.padding = editing ? "8px" : "0";
    mathfieldRef.current.style.border = editing ? "1px solid #d1d5db" : "none";

    return () => {
      if (mathfieldRef.current) {
        mathfieldRef.current.remove();
        mathfieldRef.current = null;
      }
    };
  }, [editing]);

  useEffect(() => {
    if (!mathfieldRef.current || ignoreNextChange.current) {
      ignoreNextChange.current = false;
      return;
    }

    const unwrappedValue = extractLatexFromText(value || "");
    if (mathfieldRef.current.value !== unwrappedValue) {
      mathfieldRef.current.value = unwrappedValue;
    }
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} />
      {editing && (
        <div className="flex justify-end gap-2 mt-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onCancel}
            className="h-8 px-3"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onSave}
            className="h-8 px-3 bg-green-500 hover:bg-green-600 text-white"
          >
            <Check size={14} className="mr-1" />
            Save
          </Button>
        </div>
      )}
      {!value && !editing && (
        <div className="text-gray-400 italic text-sm">{placeholder}</div>
      )}
    </div>
  );
};

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
        imagePath: ""
      }],
      audio: "",
      video: "",
      image: ""
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
  const [selectedFileType, setSelectedFileType] = useState<"audio" | "video" | "document" | "image">("audio");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [editingStates, setEditingStates] = useState<{ [key: string]: boolean }>({});
  const [initialExistingFileCount, setInitialExistingFileCount] = useState(0);

  // Lesson media states
  const [audioStatuses, setAudioStatuses] = useState<("idle" | "uploading" | "success")[]>([]);
  const [videoStatuses, setVideoStatuses] = useState<("idle" | "uploading" | "success")[]>([]);
  const [imageStatuses, setImageStatuses] = useState<("idle" | "uploading" | "success")[]>([]);
  const [uploadedAudioNames, setUploadedAudioNames] = useState<(string | null)[]>([]);
  const [uploadedVideoNames, setUploadedVideoNames] = useState<(string | null)[]>([]);
  const [uploadedImageNames, setUploadedImageNames] = useState<(string | null)[]>([]);

  // Get field path for editing state tracking
  const getFieldPath = (lessonIndex: number, subHeadingIndex: number | null, fieldName: string) => {
    if (subHeadingIndex === null) {
      return `lesson_${lessonIndex}_${fieldName}`;
    }
    return `lesson_${lessonIndex}_subheading_${subHeadingIndex}_${fieldName}`;
  };

  // Toggle editing state for a specific field
  const toggleEditing = (fieldPath: string) => {
    setEditingStates(prev => ({
      ...prev,
      [fieldPath]: !prev[fieldPath]
    }));
  };

  // Save value for a specific field
  const saveMathValue = (fieldPath: string) => {
    setEditingStates(prev => ({
      ...prev,
      [fieldPath]: false
    }));
  };

  // Cancel editing for a specific field
  const cancelEditing = (fieldPath: string) => {
    setEditingStates(prev => ({
      ...prev,
      [fieldPath]: false
    }));
  };

  // Helper function to update per-lesson states
  const updateAudioState = (lessonIndex: number, status: "idle" | "uploading" | "success", fileName?: string) => {
    setAudioStatuses(prev => {
      const newStatuses = [...prev];
      newStatuses[lessonIndex] = status;
      return newStatuses;
    });

    if (fileName !== undefined) {
      setUploadedAudioNames(prev => {
        const newNames = [...prev];
        newNames[lessonIndex] = fileName;
        return newNames;
      });
    }
  };

  const updateVideoState = (lessonIndex: number, status: "idle" | "uploading" | "success", fileName?: string) => {
    setVideoStatuses(prev => {
      const newStatuses = [...prev];
      newStatuses[lessonIndex] = status;
      return newStatuses;
    });

    if (fileName !== undefined) {
      setUploadedVideoNames(prev => {
        const newNames = [...prev];
        newNames[lessonIndex] = fileName;
        return newNames;
      });
    }
  };

  const updateImageState = (lessonIndex: number, status: "idle" | "uploading" | "success", fileName?: string) => {
    setImageStatuses(prev => {
      const newStatuses = [...prev];
      newStatuses[lessonIndex] = status;
      return newStatuses;
    });

    if (fileName !== undefined) {
      setUploadedImageNames(prev => {
        const newNames = [...prev];
        newNames[lessonIndex] = fileName;
        return newNames;
      });
    }
  };

  // Fetch content data
  useEffect(() => {
    const fetchContent = async () => {
      try {
        if (!contentId) return;

        const response = await TopicContentService.getTopicContentById(contentId);
        const contentData = response.data;

        const updatedContent = {
          _id: contentData._id,
          title: contentData.title,
          description: contentData.description,
          lesson: contentData.lesson.map((lessonItem: any) => ({
            _id: lessonItem._id,
            text: lessonItem.text,
            audio: lessonItem.audio,
            video: lessonItem.video,
            image: lessonItem.image || "",
            subHeading: lessonItem.subHeading?.map((subItem: any) => ({
              _id: subItem._id,
              text: subItem.text,
              subheadingAudioPath: subItem.subheadingAudioPath,
              imagePath: subItem.imagePath || "",
              question: subItem.question,
              expectedAnswer: subItem.expectedAnswer,
              comment: subItem.comment,
              hint: subItem.hint,
            })) || []
          })),
          file_path: contentData.file_path,
          file_type: contentData.file_type,
          Topic: contentData.Topic._id,
        };

        setContent(updatedContent);
        setInitialExistingFileCount(contentData.file_path.length);

        // Initialize media states
        setAudioStatuses(updatedContent.lesson.map(lesson => lesson.audio ? "success" : "idle"));
        setVideoStatuses(updatedContent.lesson.map(lesson => lesson.video ? "success" : "idle"));
        setImageStatuses(updatedContent.lesson.map(lesson => lesson.image ? "success" : "idle"));
        setUploadedAudioNames(updatedContent.lesson.map(lesson =>
          lesson.audio ? shortenFilename(extractFilenameFromUrl(lesson.audio)) : null
        ));
        setUploadedVideoNames(updatedContent.lesson.map(lesson =>
          lesson.video ? shortenFilename(extractFilenameFromUrl(lesson.video)) : null
        ));
        setUploadedImageNames(updatedContent.lesson.map(lesson =>
          lesson.image ? shortenFilename(extractFilenameFromUrl(lesson.image)) : null
        ));
      } catch (error) {
        console.error("Failed to fetch content:", error);
        const t = toast({
          variant: "destructive",
          title: "Oops! Couldn’t Load Content",
          description: "We couldn’t load the content data right now. Please try again.",
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

        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [contentId, toast, navigate]);

  const addLessonItem = () => {
    setContent((prev) => ({
      ...prev,
      lesson: [
        ...prev.lesson,
        {
          text: "",
          subHeading: [{
            text: "",
            question: "",
            subheadingAudioPath: "",
            expectedAnswer: "",
            comment: "",
            hint: "",
            imagePath: ""
          }],
          audio: "",
          video: "",
          image: ""
        },
      ],
    }));

    // Add new states for the new lesson
    setAudioStatuses(prev => [...prev, "idle"]);
    setVideoStatuses(prev => [...prev, "idle"]);
    setImageStatuses(prev => [...prev, "idle"]);
    setUploadedAudioNames(prev => [...prev, null]);
    setUploadedVideoNames(prev => [...prev, null]);
    setUploadedImageNames(prev => [...prev, null]);

    setActiveLessonIndex(content.lesson.length);
  };

  const removeLessonItem = (index: number) => {
    if (content.lesson.length > 1) {
      setContent((prev) => ({
        ...prev,
        lesson: prev.lesson.filter((_, i) => i !== index),
      }));

      setAudioStatuses(prev => prev.filter((_, i) => i !== index));
      setVideoStatuses(prev => prev.filter((_, i) => i !== index));
      setImageStatuses(prev => prev.filter((_, i) => i !== index));
      setUploadedAudioNames(prev => prev.filter((_, i) => i !== index));
      setUploadedVideoNames(prev => prev.filter((_, i) => i !== index));
      setUploadedImageNames(prev => prev.filter((_, i) => i !== index));

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
          imagePath: ""
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
        const t = toast({
          variant: "destructive",
          title: "Oops! Missing Title",
          description: "Please provide a title before continuing.",
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

        return;
      }

      if (!content.description.trim()) {
        const t = toast({
          variant: "destructive",
          title: "Oops! Missing Short Description",
          description: "Please provide a short description before continuing.",
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
        const t = toast({
          variant: "destructive",
          title: "Oops! Missing Lesson Titles",
          description: `Please provide titles for the following lessons: ${lessonErrors.join(", ")}`,
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
    return (
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
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
                  <Edit size={24} className="text-white" />
                </div>
                Edit Content
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Content Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="space-y-2 md:col-span-1">
              <Input
                value={content.title}
                onChange={(e) =>
                  setContent({ ...content, title: e.target.value })
                }
                placeholder="Title"
                className="h-10 text-sm border border-gray-200 hover:border-green-300 focus:border-green-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Input
                value={content.description}
                onChange={(e) =>
                  setContent({
                    ...content,
                    description: e.target.value,
                  })
                }
                placeholder="Short description..."
                className="h-10 text-sm border border-gray-200 hover:border-green-300 focus:border-green-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Lesson Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {content.lesson.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveLessonIndex(index)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${activeLessonIndex === index
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
                            placeholder="Enter lesson title"
                            className="text-sm border border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-all duration-200"
                          />
                        </div>
                      </div>

                      {/* Subheadings */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-medium text-gray-600">
                            Sections
                          </label>
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
                                  {/* Subheading Text - Math Input */}
                                  <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-600">
                                      Section Content
                                    </label>
                                    <div className="border border-gray-200 rounded-lg p-2 bg-white">
                                      {editingStates[getFieldPath(lessonIndex, subHeadingIndex, "text")] ? (
                                        <MathInput
                                          value={subHeadingItem.text}
                                          onChange={(value) =>
                                            updateSubHeadingItem(
                                              lessonIndex,
                                              subHeadingIndex,
                                              "text",
                                              value
                                            )
                                          }
                                          editing={true}
                                          onSave={() => saveMathValue(getFieldPath(lessonIndex, subHeadingIndex, "text"))}
                                          onCancel={() => cancelEditing(getFieldPath(lessonIndex, subHeadingIndex, "text"))}
                                        />
                                      ) : (
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <MathInput
                                              value={subHeadingItem.text}
                                              editing={false}
                                              placeholder="Click edit to add content"
                                            />
                                          </div>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-gray-400 hover:text-blue-500"
                                            onClick={() => toggleEditing(getFieldPath(lessonIndex, subHeadingIndex, "text"))}
                                          >
                                            <Edit size={14} />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Comment Field - Math Input */}
                                  <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-600">
                                      Comment
                                    </label>
                                    <div className="border border-gray-200 rounded-lg p-2 bg-white">
                                      {editingStates[getFieldPath(lessonIndex, subHeadingIndex, "comment")] ? (
                                        <MathInput
                                          value={subHeadingItem.comment}
                                          onChange={(value) =>
                                            updateSubHeadingItem(
                                              lessonIndex,
                                              subHeadingIndex,
                                              "comment",
                                              value
                                            )
                                          }
                                          editing={true}
                                          onSave={() => saveMathValue(getFieldPath(lessonIndex, subHeadingIndex, "comment"))}
                                          onCancel={() => cancelEditing(getFieldPath(lessonIndex, subHeadingIndex, "comment"))}
                                        />
                                      ) : (
                                        <div className="flex items-start justify-between">
                                          <div className="flex-1">
                                            <MathInput
                                              value={subHeadingItem.comment}
                                              editing={false}
                                              placeholder="Click edit to add comment"
                                            />
                                          </div>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-gray-400 hover:text-blue-500"
                                            onClick={() => toggleEditing(getFieldPath(lessonIndex, subHeadingIndex, "comment"))}
                                          >
                                            <Edit size={14} />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Question Button */}
                                  <div className="flex items-center justify-between w-full">
                                    <div>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openQuestionModal(lessonIndex, subHeadingIndex)}
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                                      >
                                        <Plus size={14} className="mr-1" />
                                        {subHeadingItem.question ? "Edit Question" : "Add Question"}
                                      </Button>
                                    </div>

                                    <div className="flex flex-col items-end">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className={`flex items-center gap-2 px-3 text-white h-9 shadow-md transition-all duration-200 border-0 ${subHeadingItem.subheadingAudioPath || subHeadingItem.imagePath
                                              ? "bg-green-600"
                                              : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                                              }`}
                                          >
                                            {selectedFileType === "audio" && <Music size={16} />}
                                            {selectedFileType === "video" && <Video size={16} />}
                                            {selectedFileType === "document" && <FileText size={16} />}
                                            {selectedFileType === "image" && <ImageIcon size={16} />}
                                            {subHeadingItem.subheadingAudioPath
                                              ? shortenFilename(extractFilenameFromUrl(subHeadingItem.subheadingAudioPath))
                                              : subHeadingItem.imagePath
                                                ? shortenFilename(extractFilenameFromUrl(subHeadingItem.imagePath))
                                                : `Upload ${selectedFileType}`}
                                            <ChevronDown size={14} className="ml-1" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-48">
                                          <DropdownMenuItem
                                            onClick={() => setSelectedFileType("audio")}
                                            className="flex items-center gap-2"
                                          >
                                            <Music size={14} /> Audio
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => setSelectedFileType("video")}
                                            className="flex items-center gap-2"
                                          >
                                            <Video size={14} /> Video
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => setSelectedFileType("document")}
                                            className="flex items-center gap-2"
                                          >
                                            <FileText size={14} /> Document
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={() => setSelectedFileType("image")}
                                            className="flex items-center gap-2"
                                          >
                                            <ImageIcon size={14} /> Image
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>

                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 bg-blue-500 text-white hover:bg-blue-600 w-full"
                                        disabled={uploading}
                                        onClick={async () => {
                                          const input = document.createElement("input");
                                          input.type = "file";
                                          input.accept = getAcceptedFileTypes(selectedFileType);
                                          input.onchange = async (e) => {
                                            const file = (e.target as HTMLInputElement).files?.[0];
                                            if (file) {
                                              setUploadedFileName(file.name);
                                              setUploading(true);

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
                                                  if (selectedFileType === "image") {
                                                    updateSubHeadingItem(
                                                      lessonIndex,
                                                      subHeadingIndex,
                                                      "imagePath",
                                                      publicData.publicUrl
                                                    );
                                                  } else {
                                                    updateSubHeadingItem(
                                                      lessonIndex,
                                                      subHeadingIndex,
                                                      "subheadingAudioPath",
                                                      publicData.publicUrl
                                                    );
                                                  }

                                                  toast({
                                                    title: "Success",
                                                    description: `${selectedFileType.charAt(0).toUpperCase() + selectedFileType.slice(1)} uploaded successfully`,
                                                    duration: 5000,
                                                  });
                                                }
                                              } catch (error) {
                                                console.error("Upload failed:", error);
                                                toast({
                                                  variant: "destructive",
                                                  title: "Error",
                                                  description: `Failed to upload ${selectedFileType} file`,
                                                });
                                                setUploadedFileName(null);
                                              } finally {
                                                setUploading(false);
                                              }
                                            }
                                          };
                                          input.click();
                                        }}
                                      >
                                        {uploading ? (
                                          <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
                                            Selecting...
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-1">
                                            <Upload size={14} className="mr-1" />
                                            Select File
                                          </div>
                                        )}
                                      </Button>
                                    </div>
                                  </div>

                                  {/* Show question if it exists */}
                                  {subHeadingItem.question && (
                                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
                                      <div className="flex justify-between items-start">
                                        <div className="space-y-1 w-full">
                                          <h4 className="text-xs font-medium text-blue-800">
                                            Question:
                                          </h4>
                                          <div className="border border-gray-200 rounded-lg p-2 bg-white">
                                            <div className="flex items-start justify-between">
                                              <div className="flex-1">
                                                <MathInput
                                                  value={subHeadingItem.question}
                                                  editing={false}
                                                  placeholder="No question added"
                                                />
                                              </div>
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-gray-400 hover:text-blue-500"
                                                onClick={() => openQuestionModal(lessonIndex, subHeadingIndex)}
                                              >
                                                <Edit size={14} />
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>

                        <div className="space-y-1">
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
                      </div>

                      {/* Lesson media upload buttons */}
                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={audioStatuses[lessonIndex] === "uploading"}
                          className={`flex items-center gap-2 px-3 text-white h-9 shadow-md transition-all duration-200 border-0 ${audioStatuses[lessonIndex] === "success"
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
                                updateAudioState(lessonIndex, "uploading", file.name);

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
                                    updateAudioState(lessonIndex, "success", shortenFilename(file.name));

                                    toast({
                                      title: "Success",
                                      description: "Audio uploaded successfully",
                                      duration: 5000,
                                    });
                                  }
                                } catch (error) {
                                  console.error("Audio upload failed:", error);
                                  updateAudioState(lessonIndex, "idle", null);
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
                          <Music size={16} />
                          {audioStatuses[lessonIndex] === "uploading"
                            ? `Uploading ${uploadedAudioNames[lessonIndex]}...`
                            : audioStatuses[lessonIndex] === "success"
                              ? (
                                <span className="max-w-[100px] truncate">
                                  {uploadedAudioNames[lessonIndex] || "Uploaded"}
                                </span>
                              )
                              : "Upload Audio"}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={videoStatuses[lessonIndex] === "uploading"}
                          className={`flex items-center gap-2 px-3 text-white h-9 border-0 shadow-md transition-all duration-200 ${videoStatuses[lessonIndex] === "success"
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
                                updateVideoState(lessonIndex, "uploading", file.name);

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
                                    updateVideoState(lessonIndex, "success", shortenFilename(file.name));

                                    toast({
                                      title: "Success",
                                      description: "Video uploaded successfully",
                                      duration: 3000,
                                    });
                                  }
                                } catch (error) {
                                  console.error("Video upload failed:", error);
                                  updateVideoState(lessonIndex, "idle", null);
                                  toast({
                                    variant: "destructive",
                                    title: "Error",
                                    description: "Failed to upload video file",
                                    duration: 5000,
                                  });
                                }
                              }
                            };
                            input.click();
                          }}
                        >
                          <Video size={16} />
                          {videoStatuses[lessonIndex] === "uploading"
                            ? `Uploading ${uploadedVideoNames[lessonIndex]}...`
                            : videoStatuses[lessonIndex] === "success"
                              ? (
                                <span className="max-w-[100px] truncate">
                                  {uploadedVideoNames[lessonIndex] || "Uploaded"}
                                </span>
                              )
                              : "Upload Video"}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={imageStatuses[lessonIndex] === "uploading"}
                          className={`flex items-center gap-2 px-3 text-white h-9 border-0 shadow-md transition-all duration-200 ${imageStatuses[lessonIndex] === "success"
                            ? "bg-yellow-600"
                            : "bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
                            }`}
                          onClick={async () => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = async (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                updateImageState(lessonIndex, "uploading", file.name);

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
                                    updateLessonItem(lessonIndex, "image", publicData.publicUrl);
                                    updateImageState(lessonIndex, "success", shortenFilename(file.name));

                                    toast({
                                      title: "Success",
                                      description: "Image uploaded successfully",
                                      duration: 3000,
                                    });
                                  }
                                } catch (error) {
                                  console.error("Image upload failed:", error);
                                  updateImageState(lessonIndex, "idle", null);
                                  toast({
                                    variant: "destructive",
                                    title: "Error",
                                    description: "Failed to upload image file",
                                    duration: 5000,
                                  });
                                }
                              }
                            };
                            input.click();
                          }}
                        >
                          <ImageIcon size={16} />
                          {imageStatuses[lessonIndex] === "uploading"
                            ? `Uploading ${uploadedImageNames[lessonIndex]}...`
                            : imageStatuses[lessonIndex] === "success"
                              ? (
                                <span className="max-w-[100px] truncate">
                                  {uploadedImageNames[lessonIndex] || "Uploaded"}
                                </span>
                              )
                              : "Upload Image"}
                        </Button>
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
              <h3 className="text-lg font-bold text-gray-800">
                {currentSubHeadingItem.question ? "Edit Question" : "Add Question"}
              </h3>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Question Field - Math Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">
                  Question
                </label>
                <div className="border border-gray-200 rounded-lg p-2 bg-white">
                  {editingStates[`question_modal_${currentQuestionData.lessonIndex}_${currentQuestionData.subHeadingIndex}`] ? (
                    <MathInput
                      value={currentSubHeadingItem.question}
                      onChange={(value) =>
                        updateSubHeadingItem(
                          currentQuestionData.lessonIndex,
                          currentQuestionData.subHeadingIndex,
                          "question",
                          value
                        )
                      }
                      editing={true}
                      onSave={() => {
                        setEditingStates(prev => ({
                          ...prev,
                          [`question_modal_${currentQuestionData.lessonIndex}_${currentQuestionData.subHeadingIndex}`]: false
                        }));
                      }}
                      onCancel={() => {
                        setEditingStates(prev => ({
                          ...prev,
                          [`question_modal_${currentQuestionData.lessonIndex}_${currentQuestionData.subHeadingIndex}`]: false
                        }));
                      }}
                    />
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <MathInput
                          value={currentSubHeadingItem.question}
                          editing={false}
                          placeholder="Click edit to add question"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-blue-500"
                        onClick={() => setEditingStates(prev => ({
                          ...prev,
                          [`question_modal_${currentQuestionData.lessonIndex}_${currentQuestionData.subHeadingIndex}`]: true
                        }))}
                      >
                        <Edit size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Expected Answer Field - Math Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">
                  Expected Answer
                </label>
                <div className="border border-gray-200 rounded-lg p-2 bg-white">
                  {editingStates[`expectedAnswer_modal_${currentQuestionData.lessonIndex}_${currentQuestionData.subHeadingIndex}`] ? (
                    <MathInput
                      value={currentSubHeadingItem.expectedAnswer}
                      onChange={(value) =>
                        updateSubHeadingItem(
                          currentQuestionData.lessonIndex,
                          currentQuestionData.subHeadingIndex,
                          "expectedAnswer",
                          value
                        )
                      }
                      editing={true}
                      onSave={() => {
                        setEditingStates(prev => ({
                          ...prev,
                          [`expectedAnswer_modal_${currentQuestionData.lessonIndex}_${currentQuestionData.subHeadingIndex}`]: false
                        }));
                      }}
                      onCancel={() => {
                        setEditingStates(prev => ({
                          ...prev,
                          [`expectedAnswer_modal_${currentQuestionData.lessonIndex}_${currentQuestionData.subHeadingIndex}`]: false
                        }));
                      }}
                    />
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <MathInput
                          value={currentSubHeadingItem.expectedAnswer}
                          editing={false}
                          placeholder="Click edit to add expected answer"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-blue-500"
                        onClick={() => setEditingStates(prev => ({
                          ...prev,
                          [`expectedAnswer_modal_${currentQuestionData.lessonIndex}_${currentQuestionData.subHeadingIndex}`]: true
                        }))}
                      >
                        <Edit size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Hint Field - Math Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-600">
                  Hint
                </label>
                <div className="border border-gray-200 rounded-lg p-2 bg-white">
                  {editingStates[`hint_modal_${currentQuestionData.lessonIndex}_${currentQuestionData.subHeadingIndex}`] ? (
                    <MathInput
                      value={currentSubHeadingItem.hint}
                      onChange={(value) =>
                        updateSubHeadingItem(
                          currentQuestionData.lessonIndex,
                          currentQuestionData.subHeadingIndex,
                          "hint",
                          value
                        )
                      }
                      editing={true}
                      onSave={() => {
                        setEditingStates(prev => ({
                          ...prev,
                          [`hint_modal_${currentQuestionData.lessonIndex}_${currentQuestionData.subHeadingIndex}`]: false
                        }));
                      }}
                      onCancel={() => {
                        setEditingStates(prev => ({
                          ...prev,
                          [`hint_modal_${currentQuestionData.lessonIndex}_${currentQuestionData.subHeadingIndex}`]: false
                        }));
                      }}
                    />
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <MathInput
                          value={currentSubHeadingItem.hint}
                          editing={false}
                          placeholder="Click edit to add hint"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-gray-400 hover:text-blue-500"
                        onClick={() => setEditingStates(prev => ({
                          ...prev,
                          [`hint_modal_${currentQuestionData.lessonIndex}_${currentQuestionData.subHeadingIndex}`]: true
                        }))}
                      >
                        <Edit size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

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
                  Save Question
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