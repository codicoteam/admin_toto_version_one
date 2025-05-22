import { useState, useRef } from 'react';
import { Upload, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BookUploadForm() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [bookData, setBookData] = useState({
    level: '',
    author: '',
    description: ''
  });
  const fileInputRef = useRef(null);

  // Handle drag events
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
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    // Just handle the first file for simplicity
    setFile(files[0]);
  };

  // Handle click on browse button
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  // Handle text inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Create form data for submission
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    formData.append('level', bookData.level);
    formData.append('author', bookData.author);
    formData.append('description', bookData.description);
    
    console.log('Form submitted:', {
      file: file ? file.name : 'No file selected',
      ...bookData
    });
    
    // Here you would typically send formData to your backend
    // For example: await fetch('/api/upload-book', { method: 'POST', body: formData });
    
    // Reset form after submission (optional)
    setFile(null);
    setBookData({ level: '', author: '', description: '' });
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4"> {/* Added wrapper div */}
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
              accept=".pdf,.epub,.mobi" 
            />
            
            <Upload size={32} className={`mb-3 ${isDragging ? 'text-blue-500' : file ? 'text-green-500' : 'text-gray-400'}`} />
            
            <div className="text-center">
              {file ? (
                <p className="text-green-600 font-medium">File selected: {file.name}</p>
              ) : isDragging ? (
                <p className="text-blue-600 font-medium">Drop your file here</p>
              ) : (
                <>
                  <p className="text-gray-700 font-medium">Drag and drop file</p>
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
              
              {/* Blue circle in top right */}
              <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center">
                <div className="text-white text-xs">•••</div>
              </div>
              
              {/* Character illustration */}
              <div className="absolute bottom-0 right-0 transform translate-y-1/2">
                <div className="flex">
                  <div className="bg-pink-500 w-6 h-12 rounded-t-lg"></div>
                  <div className="bg-purple-600 w-6 h-14 rounded-t-lg"></div>
                </div>
              </div>
              
              {/* Home button */}
              <div className="absolute bottom-0 right-16 bg-blue-400 rounded-full w-10 h-10 flex items-center justify-center transform translate-y-1/2">
                <Home size={20} className="text-white" />
              </div>
              
              {/* Other colorful elements */}
              <div className="absolute bottom-0 left-0 bg-yellow-400 w-8 h-8 rounded-full transform translate-y-1/2"></div>
              <div className="absolute bottom-4 left-10 bg-green-400 w-6 h-6 rounded-full"></div>
            </div>
          </div>

          {/* Book Details Fields */}
          <div className="space-y-4 mt-8">
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <input
                type="text"
                id="level"
                name="level"
                value={bookData.level}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter book level"
              />
            </div>
            
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                type="text"
                id="author"
                name="author"
                value={bookData.author}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter author name"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                value={bookData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter book description"
              ></textarea>
            </div>
          </div>
          
          {/* Update Button */}
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="w-full py-2 bg-blue-600 text-white rounded-md font-medium transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              UPLOAD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}