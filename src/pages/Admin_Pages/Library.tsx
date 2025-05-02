import React, { useState, useEffect } from "react";
import { BookOpen, Calendar, Menu, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import { Link } from "react-router-dom";

const Library = () => {
  // Set initial sidebar state based on screen size
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

  // Library resources
  const resources = [
    { type: "VIDEO TUTORIALS", image: "/api/placeholder/400/200" },
    { type: "PDF BOOKS", image: "/api/placeholder/400/200" },
    { type: "AUDIO FILES", image: "/api/placeholder/400/200" },
    { type: "WEBSITE LINKS", image: "/api/placeholder/400/200" },
  ];

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
        <div className="w-full min-h-screen p-4 md:p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0 mt-10 md:mt-0">
            <h1 className="text-2xl font-bold text-blue-900">LIBRARY</h1>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <div key={index} className="flex flex-col">
                {/* Resource Image */}
                <div className="bg-gray-300 h-40 mb-1 rounded-t-md"></div>

                {/* Resource Info Bar */}
                <div className="bg-blue-900 text-white p-3 flex justify-between items-center rounded-b-md">
                  <span className="font-medium">{resource.type}</span>
                  <Button
                    size="sm"
                    className="bg-transparent hover:bg-blue-800 border border-white text-white text-xs"
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Resources Button */}
          <div className="flex justify-center mt-8">
            <Link to="/reserourceupload">
              <Button className="border-2 border-blue-900 bg-white hover:bg-blue-50 text-blue-900 px-10 py-2 rounded-md">
                UPLOAD RESOURCES
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
