import axios from "axios";

const BASE_URL =
  "https://toto-academy-backend.onrender.com/api/v1/student_route";

/**
 * Service for handling student-related API requests
 */
const StudentService = {
  /**
   * Fetches all students from the backend
   * @returns {Promise} Promise containing student data
   */
  getAllStudents: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getallstudents`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to retrieve students";
    }
  },

  /**
   * Get a specific student by ID
   * @param {string} id - Student ID
   * @returns {Promise} Promise with student data
   */
  getStudentById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/getstudent/${id}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to retrieve student";
    }
  },

   deleteStudent: async (id) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/deletestudent/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
          },
        }
      );
      return response.data;  // Returns { message: "Student deleted successfully" }
    } catch (error) {
      throw error.response?.data || "Failed to delete student";
    }
  },

  // Commented out as per your code but kept for future implementation
  /*
  postStudent: async (studentData) => {
    try {
      const response = await axios.post(`${BASE_URL}/create`, studentData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to create student";
    }
  },
  */
};

/**
 * Helper function to get authentication token from local storage
 * @returns {string} Authentication token
 */
const getAuthToken = () => {
  console.log(localStorage.getItem("adminToken"));
  return localStorage.getItem("adminToken");
};

export default StudentService;
