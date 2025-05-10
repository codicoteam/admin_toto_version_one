import axios from "axios";

// Base URL for the TopicInCourse API
const BASE_URL =
  "https://toto-academy-backend.onrender.com/api/v1/topic_in_subject";

/**
 * Service for handling topic-related API requests within a course
 */
const TopicInCourseService = {
  /**
   * Fetches all topics
   * @returns {Promise} Promise containing topic data
   */
  getAllTopics: async (courseId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/getall`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || "Failed to retrieve topics";
    }
  },

  /**
   * Fetches all topics for a specific subject/course
   * @param {string} subjectId - The ID of the subject/course
   * @returns {Promise} Promise containing filtered topic data
   */
  // Enhanced filtering with debug logging
  getTopicsByCourseId: async (courseId: string) => {
    try {
      const response = await axios.get(`${BASE_URL}/getall`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      // Get all topics from response
      const allTopics = response.data.data || [];
      console.log(`Total topics fetched: ${allTopics.length}`);

      // Debug: Log the first few topics to see their structure
      if (allTopics.length > 0) {
        console.log("Example topic structure:", allTopics[0]);
      }

      // Filter topics by course ID with detailed logging
      const filteredTopics = allTopics.filter((topic) => {
        const matches =
          topic.subject_id === courseId ||
          topic.subjectId === courseId ||
          topic.course_id === courseId ||
          topic.courseId === courseId;

        if (matches) {
          console.log(`Found matching topic: ${topic.name || topic.title}`);
        }

        return matches;
      });

      console.log(
        `Filtered topics for course ${courseId}: ${filteredTopics.length}`
      );

      return {
        message: "Topics retrieved successfully",
        data: filteredTopics,
      };
    } catch (error) {
      throw error.response?.data || "Failed to retrieve topics";
    }
  },
  /**
   * Fetches a specific topic by ID
   * @param {string} topicId - The ID of the topic
   * @returns {Promise} Promise with topic data
   */
  getTopicById: async (topicId: string) => {
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
  createTopic: async (topicData: any) => {
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
  updateTopic: async (topicId: string, topicData: any) => {
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
  deleteTopic: async (topicId: string) => {
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
  return localStorage.getItem("adminToken") || "";
};

export default TopicInCourseService;
