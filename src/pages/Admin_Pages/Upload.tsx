import { useState, useRef } from 'react';
import { Upload, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import UploadService from '@/services/Upload_service';
import LibraryService from '@/services/Library_service';
import { toast } from '@/components/ui/use-toast';

export default function BookUploadForm() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookTitle, setBookTitle] = useState("");
  const fileInputRef = useRef(null);
  const [groupLevel, setGroupLevel] = useState("Form 4");
  const [groupSubject, setGroupSubject] = useState("6650ac3c0f9e2b7b4b012344");
  const [authorFullName, setAuthorFullName] = useState("");
  const [description, setDescription] = useState("");

  // Accepted file types
  const acceptedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];

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
      setError('Please upload a PDF, Word, or PowerPoint file');
      return;
    }
    
    setFile(selectedFile);
    setBookTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    setError(null); // Clear any previous errors
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    if (!bookTitle || !authorFullName || !description) {
      setError('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. First upload the file
      const formData = new FormData();
      formData.append('file', file); // Changed back to 'file' as it's more standard
      
      // Add progress monitoring if needed
      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`${percentCompleted}% uploaded`);
        }
      };
      
      const uploadResponse = await UploadService.uploadBook(formData);
      
      if (!uploadResponse?.success) {
        throw new Error(uploadResponse?.message || 'File upload failed');
      }

      // 2. Then create the book record
      const bookData = {
        title: bookTitle,
        level: groupLevel,
        subject: groupSubject,
        authorFullName: authorFullName,
        filePath: uploadResponse.filePath || `/uploads/books/${file.name}`,
        description: description,
        fileType: file.type // Store the file type for reference
      };
      
      const createResponse = await LibraryService.createBook(bookData);
      
      if (!createResponse?.success) {
        throw new Error(createResponse?.message || 'Book creation failed');
      }
      
      // Reset form
      setFile(null);
      setBookTitle("");
      setAuthorFullName("");
      setDescription("");
      
      toast({
        title: "Success",
        description: "Book uploaded successfully!",
        variant: 'default'
      });
      
    } catch (err) {
      console.error('Upload error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Upload failed. Please try again.';
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
    if (!file) return '';
    if (file.type === 'application/pdf') return 'PDF';
    if (file.type.includes('word')) return 'Word';
    if (file.type.includes('powerpoint')) return 'PowerPoint';
    return file.type.split('/').pop().toUpperCase();
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="flex w-full max-w-3xl mx-auto">
        {/* Left Panel - Upload Section */}
        <div className="w-1/2 border-r border-gray-200 p-8 bg-white">
          <div 
            className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 h-64 ${
              isDragging 
                ? 'border-blue-500 bg-blue-50' 
                : file 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-blue-400'
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
            
            <Upload size={32} className={`mb-3 ${isDragging ? 'text-blue-500' : file ? 'text-green-500' : 'text-gray-400'}`} />
            
            <div className="text-center">
              {file ? (
                <>
                  <p className="text-green-600 font-medium">{file.name}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {getFileTypeDisplay(file)} • {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </>
              ) : isDragging ? (
                <p className="text-blue-600 font-medium">Drop your file here</p>
              ) : (
                <>
                  <p className="text-gray-700 font-medium">Drag and drop file</p>
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
            <Link to="/library" className="text-blue-600 hover:underline cursor-pointer text-sm">
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
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
              <input
                type="text"
                id="title"
                name="title"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter book title"
                required
              />
            </div>
            
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">Level*</label>
              <select
                id="level"
                name="level"
                value={groupLevel}
                onChange={(e) => setGroupLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Form 1">Form 1</option>
                <option value="Form 2">Form 2</option>
                <option value="Form 3">Form 3</option>
                <option value="Form 4">Form 4</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author*</label>
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter book description"
                required
              ></textarea>
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {/* Submit Button */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-2 ${isLoading ? 'bg-blue-400' : 'bg-blue-600'} text-white rounded-md font-medium transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  UPLOADING...
                </span>
              ) : 'UPLOAD BOOK'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}