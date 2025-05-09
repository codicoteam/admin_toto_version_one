import axios from "axios";

const BASE_URL = "https://toto-academy-backend.onrender.com/api/v1/subject";

/**
 * Service for handling course-related API requests
 */
const CourseService = {
  /**
   * Fetches all courses from the backend
   * @returns {Promise} Promise containing course data
   */
  getAllCourses: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getall`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to retrieve courses";
    }
  },

  /**
   * Get a specific course by ID
   * @param {string} id - Course ID
   * @returns {Promise} Promise with course data
   */
  getCourseById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/getcourse/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to retrieve course";
    }
  },

  /**
   * Create a new course
   * @param {Object} courseData - Course data to create
   * @returns {Promise} Promise with created course data
   */
  createCourse: async (courseData) => {
    try {
      const response = await axios.post(`${BASE_URL}/create`, courseData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to create course";
    }
  },

  /**
   * Update an existing course
   * @param {string} id - Course ID to update
   * @param {Object} courseData - Updated course data
   * @returns {Promise} Promise with updated course data
   */
  updateCourse: async (id, courseData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/updatecourse/${id}`,
        courseData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to update course";
    }
  },

  /**
   * Delete a course
   * @param {string} id - Course ID to delete
   * @returns {Promise} Promise with deletion result
   */
  deleteCourse: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/deletecourse/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to delete course";
    }
  },
};

/**
 * Helper function to get authentication token from local storage
 * @returns {string} Authentication token
 */
const getAuthToken = () => {
  console.log(localStorage.getItem("adminToken"));
  return localStorage.getItem("adminToken");
};

export default CourseService;
