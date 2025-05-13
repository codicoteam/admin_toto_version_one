import axios from "axios";

const BASE_URL = "https://toto-academy-backend.onrender.com/api/v1";

/**
 * Helper function to get authentication token from localStorage
 * @returns {string} Authentication token 
 */ 
const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.warn("Authentication token not found in localStorage");
  }
  return token || "";
};

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
      const token = getAuthToken();
      
      // Check if token exists before making the request
      if (!token) {
        throw new Error("No authentication token available");
      }
      
      const response = await axios.get(`${BASE_URL}/community_service/getall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.status, error.response?.data || error.message);
      throw error.response?.data || error.message || "Failed to retrieve chat groups";
    }
  },
};

export default ChatService;