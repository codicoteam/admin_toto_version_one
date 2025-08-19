import React, { useState, useEffect } from "react";
import { BookOpen, Loader2, Menu, X } from "lucide-react";
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-900" />
        
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
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
            {books.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <BookOpen className="text-blue-900 mr-2" size={18} />
                    <h3 className="text-lg font-semibold">
                      {book.subject?.subjectName}
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-1">
                    <strong>Level:</strong> {book.level}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Author:</strong> {book.authorFullName}
                  </p>
                  <p className="text-gray-600 mb-3">{book.description}</p>
                  <div className="flex justify-between items-center">
                    <a
                      href={book.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button className="bg-blue-900 hover:bg-blue-800 text-white">
                        Download
                      </Button>
                    </a>
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={() => openDeleteConfirmation(book._id)}
                    >
                      Delete
                    </Button>
                  </div>
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
