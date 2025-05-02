import { useState, useRef } from 'react';
import { Upload, Home } from 'lucide-react';

 function ReserourceUpload() {
  const fileInputRef = useRef(null);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInput = (e) => {
    // Handle file selection here
    console.log(Array.from(e.target.files));
  };

  const returnToLibrary = () => {
    // In a real app, this would navigate to the library
    console.log('Returning to library');
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Header */}
      <div className="w-full bg-black text-white p-4 font-bold">
        CLICK ON UPLOAD RESOURCES
      </div>
      
      {/* Main Content */}
      <div className="flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-md w-full max-w-2xl">
          <div className="flex">
            {/* Left Side - Upload Area */}
            <div className="w-1/2 flex flex-col items-center justify-center p-8">
              {/* Upload Icon */}
              <div className="mb-6 relative">
                <div className="w-16 h-12 border-2 border-gray-800 rounded-b-lg flex items-center justify-center">
                  <Upload className="text-gray-800" size={24} />
                </div>
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-8 h-2 border-t-2 border-l-2 border-r-2 border-gray-800 rounded-t-lg" />
              </div>
              
              {/* Text */}
              <div className="text-gray-900 text-center mb-6">
                <p className="text-xl font-bold mb-1">Drag and drop file</p>
                <p className="text-xl">or</p>
              </div>
              
              {/* Browse Button */}
              <button 
                onClick={handleBrowseClick} 
                className="bg-dark to-blue-950-900-500-900 text-white py-2 px-12 rounded font-semibold mb-6"
              >
                BROWSE
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileInput} 
                className="hidden" 
                multiple 
              />
              
              {/* Return to Library Link */}
              <button 
                onClick={returnToLibrary} 
                className="text-blue-800 hover:underline"
              >
                Return to Library
              </button>
            </div>
            
            {/* Vertical Blue Line Divider */}
            <div className="w-px h-full bg-blue-500"></div>
            
            {/* Right Side - Illustration */}
            <div className="w-1/2 p-6 flex items-center justify-center">
              <div className="relative">
                {/* Chat Bubble with Update */}
                <div className="bg-blue-400 rounded-lg p-3 mb-4 relative">
                  <div className="flex items-center mb-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mx-1"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full mx-1"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full mx-1"></div>
                  </div>
                  <div className="bg-white text-blue-500 text-sm font-bold py-1 px-2 rounded w-min whitespace-nowrap">
                    UPDATE
                  </div>
                  <div className="h-2 bg-blue-300 rounded mt-2 w-full"></div>
                  
                  {/* Loading Spinner */}
                  <div className="absolute -top-6 -right-6 bg-blue-400 rounded-full w-12 h-12 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </div>
                
                {/* Person and Desk Illustration - Exact match to reference image */}
                <div className="flex items-end">
                  {/* Person */}
                  <div className="relative mr-4">
                    {/* Head */}
                    <div className="w-10 h-10 bg-blue-900 rounded-full"></div>
                    {/* Body/Shirt */}
                    <div className="w-16 h-24 bg-pink-400 rounded-lg mt-1"></div>
                    {/* Arm - reaching toward laptop */}
                    <div className="absolute top-12 left-8 w-12 h-4 bg-pink-400 rounded"></div>
                  </div>
                  
                  {/* Desk and Computer */}
                  <div className="relative">
                    {/* Laptop screen */}
                    <div className="absolute -top-16 left-0 w-20 h-12 bg-gray-700 rounded-t-sm"></div>
                    {/* Laptop base/keyboard */}
                    <div className="absolute -top-4 left-4 w-12 h-4 bg-gray-600 rounded-sm"></div>
                    {/* Desk surface */}
                    <div className="w-36 h-4 bg-yellow-700 rounded"></div>
                    {/* Desk leg */}
                    <div className="h-12 w-4 bg-yellow-800 rounded-b-sm mx-auto"></div>
                  </div>
                  
                  {/* Plant */}
                  <div className="ml-6 mb-2">
                    {/* Plant pot */}
                    <div className="w-6 h-8 bg-yellow-600 rounded-lg"></div>
                    {/* Plant leaves */}
                    <div className="w-10 h-6 bg-green-400 rounded-full -mt-6 -ml-2"></div>
                    <div className="w-8 h-5 bg-green-500 rounded-full -mt-2 ml-1"></div>
                  </div>
                </div>
                
                {/* Home Button */}
                <div className="absolute bottom-0 right-0 bg-blue-400 rounded-full w-12 h-12 flex items-center justify-center">
                  <Home className="text-white" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ReserourceUpload;
