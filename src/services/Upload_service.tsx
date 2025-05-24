// Upload_service.js
import axios from "axios";

const BASE_URL =
  "https://toto-academy-backend.onrender.com/api/v1/library_book";

/**
 * Service for handling file upload and update operations
 */
const UploadService = {
  /**
   * Upload a new book
   * @param {FormData} formData - Form data containing file and book info
   * @returns {Promise} Promise with upload result
   */
  uploadBook: async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/create`, formData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to upload book";
    }
  },

  /**
   * Update an existing book
   * @param {string} id - Book ID to update
   * @param {FormData} formData - Form data containing updated book info
   * @returns {Promise} Promise with update result
   */
  updateBook: async (id, formData) => {
    try {
      const response = await axios.put(`${BASE_URL}/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to update book";
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

export default UploadService;
