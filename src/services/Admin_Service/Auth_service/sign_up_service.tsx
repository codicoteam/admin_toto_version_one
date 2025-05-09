import axios from "axios";

const BASE_URL = "https://toto-academy-backend.onrender.com/api/v1/admin_route";

const SignUpAdmin = async (userData) => {
  try {
    // Log that we're using FormData
    console.log("Sending FormData to API with profile picture");

    // For FormData, we need to set the appropriate content type
    // But let axios set it automatically with the boundary parameter
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    // Make the API call
    const response = await axios.post(`${BASE_URL}/signup`, userData, config);

    // Extract the token from the response
    console.log("API Response:", response.data);
    console.log("Admin signup token:", response.data.token);

    // Store the token if it exists
    if (response.data.token) {
      localStorage.setItem("adminToken", response.data.token);
      console.log("Token stored successfully!");
    } else {
      console.warn("No token received during signup");
    }

    return response.data;
  } catch (error) {
    // Enhanced error logging
    console.error("Error signing up admin:", error);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }

    throw error;
  }
};

export default SignUpAdmin;
