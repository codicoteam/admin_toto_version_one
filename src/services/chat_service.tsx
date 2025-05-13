import axios from "axios";

const BASE_URL = "https://toto-academy-backend.onrender.com/api/v1";

/**
 * Service for handling community-related API requests
 */
const ChatService = {
  /**
   * Fetches all communities/chat groups from the backend
   * @returns {Promise} Promise containing communities data
   */
  getAllChatGroups: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/community_service/getall`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw new Error("Failed to retrieve chat groups");
    }
  }
};

export default ChatService;