import axios from "axios";

// Base URL for the TopicInCourse API
const BASE_URL =
  "https://toto-academy-backend.onrender.com/api/v1/topic_in_subject";

/**
 * Service for handling topic-related API requests within a course
 */
const TopicInCourseService = {
  /**
   * Fetches all topics for a specific course
   * @param {string} courseId - The ID of the course
   * @returns {Promise} Promise containing topic data
   */
  getAllTopics: async (courseId) => {
    try {
      const response = await axios.get(`${BASE_URL}/getall`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
        params: {
          courseId,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to retrieve topics";
    }
  },

  /**
   * Fetches a specific topic by ID
   * @param {string} topicId - The ID of the topic
   * @returns {Promise} Promise with topic data
   */
  getTopicById: async (topicId) => {
    try {
      const response = await axios.get(`${BASE_URL}/get/${topicId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to retrieve topic";
    }
  },

  /**
   * Creates a new topic
   * @param {Object} topicData - Data for the new topic
   * @returns {Promise} Promise with created topic data
   */
  createTopic: async (topicData) => {
    try {
      const response = await axios.post(`${BASE_URL}/create`, topicData, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to create topic";
    }
  },

  /**
   * Updates an existing topic
   * @param {string} topicId - The ID of the topic
   * @param {Object} topicData - Updated data for the topic
   * @returns {Promise} Promise with updated topic data
   */
  updateTopic: async (topicId, topicData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/update/${topicId}`,
        topicData,
        {
          headers: {
            Authorization: `Bearer ${getAuthToken()}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to update topic";
    }
  },

  /**
   * Deletes a topic
   * @param {string} topicId - The ID of the topic
   * @returns {Promise} Promise with deletion result
   */
  deleteTopic: async (topicId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/delete/${topicId}`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to delete topic";
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

export default TopicInCourseService;
