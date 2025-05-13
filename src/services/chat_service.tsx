import axios from "axios";

const BASE_URL = "https://toto-academy-backend.onrender.com/api/v1";

/**
 * Service for handling chat-related API requests
 */
const ChatService = {
  /**
   * Fetches all chat groups and students data from the backend
   * @returns {Promise} Promise containing chat groups and students data
   */
  getAllChatGroups: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/community_service/getall`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to retrieve chat groups";
    }
  },
};

/**
 * Helper function to get authentication token from localStorage
 * @returns {string} Authentication token
 */
const getAuthToken = () => {
  return localStorage.getItem("authToken") || "";
};

export default ChatService;