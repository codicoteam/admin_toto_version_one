import { useState, useRef, useEffect } from "react";
import { Upload, Home, Menu, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

function ResourceUpload() {
  const fileInputRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Update screen size state and handle sidebar visibility
  useEffect(() => {
    // Check initial screen size
    const checkScreenSize = () => {
      const isLarge = window.innerWidth >= 768;
      setIsLargeScreen(isLarge);
      setSidebarOpen(isLarge);
    };

    // Run on initial load
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInput = (e) => {
    // Handle file selection here
    console.log(Array.from(e.target.files));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-900 text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        {sidebarOpen && !isLargeScreen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar - Mobile: overlay, Desktop: static */}
      <div
        className={`
        ${
          sidebarOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        } 
        transition-all duration-300 ease-in-out 
        fixed md:relative z-40 md:z-auto w-64
      `}
      >
        <Sidebar />
      </div>

      {/* Backdrop Overlay for Mobile */}
      {sidebarOpen && !isLargeScreen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 w-full">
        <div className="flex justify-center items-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-md w-full max-w-2xl">
            <div className="flex">
              {/* Left Side - Upload Area */}
              <div className="w-1/2 flex flex-col items-center justify-center p-8">
                {/* Upload Icon - Simplified */}
                <div className="mb-6">
                  <svg
                    width="60"
                    height="60"
                    viewBox="0 0 60 60"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M30 10V40M30 10L20 20M30 10L40 20"
                      stroke="#001F3F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 40V45C10 47.7614 12.2386 50 15 50H45C47.7614 50 50 47.7614 50 45V40"
                      stroke="#001F3F"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* Text */}
                <div className="text-gray-900 text-center mb-6">
                  <p className="text-xl font-bold mb-1">Drag and drop file</p>
                  <p className="text-xl">or</p>
                </div>

                {/* Browse Button */}
                <button
                  onClick={handleBrowseClick}
                  className="bg-blue-900 text-white py-2 px-12 rounded font-semibold mb-6 w-full"
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
                {/* <a
                  href="#"
                  className="text-blue-800 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Returning to library");
                  }}
                >
                  Return to Library
                </a> */}
                <div>
                  <Link to="/library">
                    <Button className="border-2 border-blue-900 bg-white hover:bg-blue-50 text-blue-900 px-10 py-2 rounded-md">
                      return to library
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Vertical Blue Line Divider */}
              <div className="w-px h-auto bg-blue-500"></div>

              {/* Right Side - Modern Illustration */}
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

                  {/* Person at Desk Illustration - More modern version */}
                  <div className="relative">
                    {/* Person */}
                    <div className="absolute left-6 bottom-6 z-10">
                      <div className="w-12 h-16 relative">
                        {/* Head */}
                        <div className="w-8 h-8 bg-indigo-900 rounded-full absolute -top-6 left-2"></div>
                        {/* Body */}
                        <div className="w-12 h-12 bg-pink-400 rounded-lg"></div>
                        {/* Legs */}
                        <div className="absolute bottom-0 left-1">
                          <div className="w-4 h-8 bg-indigo-900 rounded-b-lg"></div>
                        </div>
                        <div className="absolute bottom-0 right-1">
                          <div className="w-4 h-6 bg-indigo-900 rounded-b-lg"></div>
                        </div>
                        {/* Arm */}
                        <div className="absolute top-0 right-0 w-8 h-3 bg-pink-400 rounded-full transform rotate-45"></div>
                      </div>
                    </div>

                    {/* Desk */}
                    <div className="relative">
                      {/* Desk surface */}
                      <div className="w-40 h-4 bg-yellow-600 rounded"></div>
                      {/* Desk leg */}
                      <div className="h-10 w-4 bg-yellow-700 rounded-b-sm mx-auto"></div>

                      {/* Laptop */}
                      <div className="absolute -top-16 left-4">
                        {/* Screen */}
                        <div className="w-14 h-10 bg-gray-700 rounded-sm"></div>
                        {/* Base */}
                        <div className="w-14 h-2 bg-gray-500 mt-0 rounded-b-sm"></div>
                      </div>
                    </div>

                    {/* Plant */}
                    <div className="absolute bottom-4 right-0">
                      {/* Pot */}
                      <div className="w-6 h-6 bg-orange-300 rounded-t-sm"></div>
                      {/* Leaves */}
                      <div className="absolute -top-8 -left-2">
                        <div className="w-6 h-8 bg-green-400 rounded-full transform rotate-45"></div>
                        <div className="w-5 h-6 bg-green-500 rounded-full absolute -bottom-2 left-4 transform -rotate-15"></div>
                      </div>
                    </div>

                    {/* Home Button */}
                    <div className="absolute -bottom-4 right-0 bg-blue-400 rounded-full w-12 h-12 flex items-center justify-center">
                      <Home className="text-white" size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceUpload;
