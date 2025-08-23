import React, { useState, useEffect } from "react";
import { BookOpen, Loader2, Menu, X, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import { Link } from "react-router-dom";
import LibraryService from "@/services/Library_service";

const Library = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Update screen size state and handle sidebar visibility
  useEffect(() => {
    const checkScreenSize = () => {
      const isLarge = window.innerWidth >= 768;
      setIsLargeScreen(isLarge);
      setSidebarOpen(isLarge);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await LibraryService.getAllBooks();
        setBooks(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load books");
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const openDeleteConfirmation = (bookId) => {
    setConfirmDelete(bookId);
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const confirmDeleteBook = async () => {
    try {
      await LibraryService.deleteBook(confirmDelete);
      setBooks(books.filter((book) => book._id !== confirmDelete));
      setConfirmDelete(null);
    } catch (err) {
      alert("Failed to delete book");
      setConfirmDelete(null);
    }
  };

  // Loading shimmer component
  const BookCardShimmer = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="h-6 w-6 bg-gray-300 rounded-full mr-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
        <div className="flex justify-between">
          <div className="h-9 bg-gray-300 rounded w-24"></div>
          <div className="h-9 bg-gray-300 rounded w-24"></div>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-900 text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        {sidebarOpen && !isLargeScreen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
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

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this book?</p>
            <div className="flex justify-end space-x-3">
              <Button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                onClick={cancelDelete}
              >
                No
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmDeleteBook}
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 w-full">
        <div className="w-full min-h-screen p-4 md:p-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 space-y-4 md:space-y-0 mt-10 md:mt-0">
            <h1 className="text-2xl font-bold text-blue-900">LIBRARY</h1>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Show shimmer loaders while loading
              Array.from({ length: 6 }).map((_, index) => (
                <BookCardShimmer key={index} />
              ))
            ) : (
              // Show actual book cards when data is loaded
              books.map((book) => (
               <div
  key={book._id}
  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-100 w-full max-w-sm mx-auto sm:max-w-none"
>
  <div className="p-4 sm:p-6">
    {/* Subject Header */}
    <div className="flex items-center mb-4">
      <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-2 rounded-lg shadow-sm">
        <BookOpen className="text-blue-900" size={20} />
      </div>
      <h3 className="text-base sm:text-lg font-semibold ml-3 text-blue-900 truncate">
        {book.subject?.subjectName}
      </h3>
    </div>

    {/* Book Title */}
    <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 line-clamp-2 leading-tight">
      {book.title}
    </h4>

    {/* Book Details */}
    <div className="space-y-3 mb-6">
      <div className="flex items-start">
        <span className="font-medium text-gray-500 mr-2 text-sm min-w-[60px]">Level:</span>
        <span className="text-gray-700 text-sm font-medium bg-gray-100 px-2 py-1 rounded-full">
          {book.level}
        </span>
      </div>
      
      <div className="flex items-start">
        <span className="font-medium text-gray-500 mr-2 text-sm min-w-[60px]">Author:</span>
        <span className="text-gray-700 text-sm truncate">
          {book.authorFullName}
        </span>
      </div>
      
      <div className="flex items-start">
        <span className="font-medium text-gray-500 mr-2 text-sm min-w-[60px] flex-shrink-0">About:</span>
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
          {book.description}
        </p>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 pt-4 border-t border-gray-100">
      <a
        href={book.filePath}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1"
      >
        <Button className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center py-2.5">
          <Download size={16} className="mr-2" />
          <span className="font-medium">Download</span>
        </Button>
      </a>
      
      <Button
        className="flex-1 sm:flex-none bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 transition-all duration-200 flex items-center justify-center py-2.5"
        onClick={() => openDeleteConfirmation(book._id)}
      >
        <Trash2 size={16} className="mr-2" />
        <span className="font-medium">Delete</span>
      </Button>
    </div>
  </div>
</div>
              ))
            )}
          </div>

          {/* Empty State */}
          {!loading && books.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No books found</h3>
              <p className="mt-1 text-gray-500">Get started by uploading your first resource.</p>
            </div>
          )}

          {/* Upload Resources Button */}
          <div className="flex justify-center mt-8">
            <Link to="/reserourceupload">
              <Button className="border-2 border-blue-900 bg-white hover:bg-blue-50 text-blue-900 px-10 py-2 rounded-md font-medium">
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