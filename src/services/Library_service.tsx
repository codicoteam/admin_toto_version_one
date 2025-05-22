import axios from "axios";

const BASE_URL = "https://toto-academy-backend.onrender.com/api/v1/library_book";

/**
 * Service for handling library book-related API requests
 */
const LibraryService = {
  /**
   * Fetches all books from the backend
   * @returns {Promise} Promise containing book data
   */
  getAllBooks: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getall`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to retrieve books";
    }
  },

  /**
   * Get a specific book by ID
   * @param {string} id - book ID
   * @returns {Promise} Promise with book data
   */
  getBookById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/getbook/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to retrieve book";
    }
  },
  /**
     * Create a new group
     * @param {Object} BookData - Data to create group
     * @returns {Promise} Promise with created group data
     */
    createBook: async (BookData) => {
      console.log(BookData);
      try {
        const response = await axios.post(
          `${BASE_URL}/create`,
          JSON.stringify(BookData),
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        throw error.response?.data || "Failed to create group";
      }
    },
  

  /**
   * Delete a book
   * @param {string} id - Book ID to delete
   * @returns {Promise} Promise with deletion result
   */
  deleteBook: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to delete book";
    }
  },
};

/**
 * Helper function to get authentication token from local storage
 * @returns {string} Authentication token
 */
const getAuthToken = () => {
  return localStorage.getItem("adminToken");
};

export default LibraryService;