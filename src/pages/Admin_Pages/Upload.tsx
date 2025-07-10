import { useState, useRef, useEffect } from "react";
import { Upload, Home } from "lucide-react";
import { Link } from "react-router-dom";
import LibraryService from "@/services/Library_service";
import SubjectService from "@/services/Admin_Service/Subject_service";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/helper/SupabaseClient";

export default function BookUploadForm() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookTitle, setBookTitle] = useState("");
  const fileInputRef = useRef(null);
  const [groupLevel, setGroupLevel] = useState("Form 4");
  const [groupSubject, setGroupSubject] = useState("");
  const [authorFullName, setAuthorFullName] = useState("");
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // New state for subjects
  const [subjects, setSubjects] = useState([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);

  // Accepted file types
  const acceptedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoadingSubjects(true);
        const data = await SubjectService.getAllSubjects();

        // Handle different response structures
        let subjectsArray = [];
        if (Array.isArray(data)) {
          subjectsArray = data;
        } else if (data && Array.isArray(data.subjects)) {
          subjectsArray = data.subjects;
        } else if (data && Array.isArray(data.data)) {
          subjectsArray = data.data;
        } else {
          console.error("Unexpected data structure:", data);
          subjectsArray = [];
        }

        setSubjects(subjectsArray);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setSubjects([]);
      } finally {
        setIsLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, []);

  // Sanitize filenames for Supabase compatibility
  const sanitizeFilename = (filename) => {
    return filename
      .replace(/[^a-zA-Z0-9!\-_.*'()]/g, '_') // Replace invalid chars with underscore
      .replace(/~+/g, '_')                      // Replace tildes specifically
      .replace(/\s+/g, '_')                     // Replace spaces with underscores
      .replace(/_{2,}/g, '_');                  // Replace multiple underscores with single
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const selectedFile = files[0];

    // Check if file type is allowed
    if (!acceptedFileTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF, Word, or PowerPoint file");
      return;
    }

    setFile(selectedFile);
    setBookTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    setError(null);
    setUploadProgress(0);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  // Helper function to validate and clean string inputs
  const validateAndCleanString = (value, fieldName) => {
    if (!value || typeof value !== "string") {
      throw new Error(`${fieldName} is required`);
    }
    const cleaned = value.trim();
    if (cleaned.length === 0) {
      throw new Error(`${fieldName} cannot be empty`);
    }
    return cleaned;
  };

  // Helper function to validate ObjectId
  const validateObjectId = (value, fieldName) => {
    if (!value || typeof value !== "string") {
      throw new Error(`${fieldName} is required`);
    }
    const cleaned = value.trim();
    if (cleaned.length === 0) {
      throw new Error(`${fieldName} cannot be empty`);
    }
    // Basic ObjectId format validation (24 hex characters)
    if (!/^[0-9a-fA-F]{24}$/.test(cleaned)) {
      throw new Error(`${fieldName} has invalid format`);
    }
    return cleaned;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setUploadProgress(0);

    try {
      // Pre-validation before starting upload
      if (!file) {
        throw new Error("Please select a file to upload");
      }

      // Validate all form fields before proceeding
      const cleanedAuthor = validateAndCleanString(
        authorFullName,
        "Author name"
      );
      const cleanedLevel = validateAndCleanString(groupLevel, "Level");
      const cleanedSubject = validateObjectId(groupSubject, "Subject");
      const cleanedDescription = description.trim();

      console.log("Pre-validation passed:", {
        author: cleanedAuthor,
        level: cleanedLevel,
        subject: cleanedSubject,
      });
    } catch (validationError) {
      setError(validationError.message);
      return;
    }

    setIsLoading(true);
    let filePath = "";

    try {
      // Sanitize filename before upload
      const sanitizedFileName = sanitizeFilename(file.name);
      const fileName = `${Date.now()}_${sanitizedFileName}`;
      
      console.log("Uploading to Supabase:", fileName);

      const { error: uploadError } = await supabase.storage
        .from("topics")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
          onProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          },
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        throw new Error(`File upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("topics")
        .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Failed to get file URL after upload");
      }

      filePath = publicUrlData.publicUrl;
      console.log("File uploaded successfully. URL:", filePath);

      // Prepare book data for JSON submission
      const bookData = {
        level: groupLevel.trim(),
        subject: groupSubject.trim(),
        authorFullName: authorFullName.trim(),
        filePath: filePath,
        description: description.trim(),
        showBook: true,
      };

      console.log("Submitting book data:", bookData);

      // Create book record
      const createResponse = await LibraryService.createBook(bookData);
      console.log("Book creation response:", createResponse);

      if (!createResponse || createResponse.error) {
        const errorMsg = createResponse?.message || "Book creation failed";
        console.error("Book creation failed:", createResponse);
        throw new Error(errorMsg);
      }

      // Reset form on success
      setFile(null);
      setBookTitle("");
      setAuthorFullName("");
      setDescription("");
      setGroupSubject("");
      setGroupLevel("Form 4");
      setUploadProgress(0);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast({
        title: "Success",
        description: "Book uploaded successfully!",
        variant: "default",
      });
    } catch (err) {
      console.error("Upload error:", err);

      // Detailed error handling
      let errorMsg = "Upload failed. Please try again.";
      if (err.message) errorMsg = err.message;
      if (err.response?.data?.error) errorMsg = err.response.data.error;
      if (err.response?.data?.message) errorMsg = err.response.data.message;

      setError(errorMsg);
      toast({
        variant: "destructive",
        title: "Upload Error",
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get file type display name
  const getFileTypeDisplay = (file) => {
    if (!file) return "";
    if (file.type === "application/pdf") return "PDF";
    if (file.type.includes("word")) return "Word";
    if (file.type.includes("powerpoint")) return "PowerPoint";
    return file.type.split("/").pop().toUpperCase();
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="flex w-full max-w-3xl mx-auto">
        {/* Left Panel - Upload Section */}
        <div className="w-1/2 border-r border-gray-200 p-8 bg-white">
          <div
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 h-64 ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : file
                ? "border-green-500 bg-green-50"
                : "border-gray-300 hover:border-blue-400"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx"
            />

            <Upload
              size={32}
              className={`mb-3 ${
                isDragging
                  ? "text-blue-500"
                  : file
                  ? "text-green-500"
                  : "text-gray-400"
              }`}
            />

            <div className="text-center">
              {file ? (
                <>
                  <p className="text-green-600 font-medium">{file.name}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {getFileTypeDisplay(file)} •{" "}
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                  
                  {/* Upload progress indicator */}
                  {isLoading && uploadProgress > 0 && (
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                      <p className="text-xs text-gray-500 mt-1">
                        Uploading: {uploadProgress}%
                      </p>
                    </div>
                  )}
                </>
              ) : isDragging ? (
                <p className="text-blue-600 font-medium">Drop your file here</p>
              ) : (
                <>
                  <p className="text-gray-700 font-medium">
                    Drag and drop file
                  </p>
                  <p className="text-gray-500 mt-1">PDF, Word, or PowerPoint</p>
                  <p className="text-gray-500 mt-1">or</p>
                </>
              )}

              <button
                type="button"
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded font-medium transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBrowseClick();
                }}
              >
                BROWSE
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Link
              to="/library"
              className="text-blue-600 hover:underline cursor-pointer text-sm"
            >
              return to library
            </Link>
          </div>
        </div>

        {/* Right Panel - Book Info & Illustration */}
        <div className="w-1/2 p-8 bg-gray-50 flex flex-col">
          {/* Illustration at top */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="bg-blue-100 rounded-lg p-4 w-48 mb-2">
                <div className="bg-blue-500 h-6 rounded w-16 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>

              <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center">
                <div className="text-white text-xs">•••</div>
              </div>

              <div className="absolute bottom-0 right-0 transform translate-y-1/2">
                <div className="flex">
                  <div className="bg-pink-500 w-6 h-12 rounded-t-lg"></div>
                  <div className="bg-purple-600 w-6 h-14 rounded-t-lg"></div>
                </div>
              </div>

              <div className="absolute bottom-0 right-16 bg-blue-400 rounded-full w-10 h-10 flex items-center justify-center transform translate-y-1/2">
                <Home size={20} className="text-white" />
              </div>

              <div className="absolute bottom-0 left-0 bg-yellow-400 w-8 h-8 rounded-full transform translate-y-1/2"></div>
              <div className="absolute bottom-4 left-10 bg-green-400 w-6 h-6 rounded-full"></div>
            </div>
          </div>

          {/* Book Details Fields */}
          <div className="space-y-4 mt-8">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title* (For Display Only)
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter book title"
              />
              <p className="text-xs text-gray-500 mt-1">
                This title is for form display only and won't be saved to the
                database
              </p>
            </div>

            <div>
              <label
                htmlFor="level"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Level*
              </label>
              <select
                id="level"
                name="level"
                value={groupLevel}
                onChange={(e) => setGroupLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select level</option>
                <option value="O Level">O Level</option>
                <option value="A Level">A Level</option>
                <option value="Form 1">Form 1</option>
                <option value="Form 2">Form 2</option>
                <option value="Form 3">Form 3</option>
                <option value="Form 4">Form 4</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject*
              </label>
              <select
                id="subject"
                name="subject"
                value={groupSubject}
                onChange={(e) => setGroupSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                disabled={isLoadingSubjects}
                required
              >
                <option value="">
                  {isLoadingSubjects ? "Loading subjects..." : "Select subject"}
                </option>
                {Array.isArray(subjects) &&
                  subjects.map((subject, index) => {
                    const subjectId = subject._id || subject.id;
                    const subjectName =
                      subject.subjectName || subject.name || "Unknown Subject";
                    return (
                      <option key={subjectId || index} value={subjectId}>
                        {subjectName}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Author*
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={authorFullName}
                onChange={(e) => setAuthorFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter author name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter book description (optional)"
              ></textarea>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded mt-4">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={isLoading || isLoadingSubjects}
              className={`w-full py-2 ${
                isLoading || isLoadingSubjects
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {uploadProgress > 0 ? `UPLOADING (${uploadProgress}%)` : "PROCESSING..."}
                </span>
              ) : isLoadingSubjects ? (
                "LOADING SUBJECTS..."
              ) : (
                "UPLOAD BOOK"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}