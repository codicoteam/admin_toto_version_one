import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo2.png";
import backgroundImage from "@/assets/bg.jpg";
import logimage from "@/assets/log.jpg";

// Import services
import loginAdmin from "@/services/Admin_Service/Auth_service/Admin_login_service";

// Import components (you may need to create these)
import CustomSpin from "@/components/customised_spins/customised_sprin";
import { showMessage } from "@/components/helper/feedback_message";

// Import reactstrap components if needed
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Col,
} from "reactstrap";

const Admin_login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call to your backend API
      const response = await loginAdmin(formData);

      // Handle successful response
      showMessage("success", "Login successful!");

      // Save auth token or user data to localStorage if needed
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Navigate to dashboard or home page
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      showMessage(
        "error",
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full h-screen flex"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 m-auto h-[700px] shadow-[0_4px_6px_rgba(255,255,255,0.3)] sm:max-w-[1300px]
     bg-white rounded-xl"
      >
        {/* Left side image */}
        <div className="w-full h-[700px] hidden md:block">
          <img
            className="w-full h-full rounded-xl rounded-r-none"
            src={logimage}
            alt="Login illustration"
          />
        </div>

        {/* Right side login form */}
        <div className="p-4 flex flex-col items-center justify-center w-full bg-gradient-to-b from-white to-blue-200 rounded-xl rounded-l-none">
          <div className="flex items-center justify-center mb-4">
            <img src={logo} alt="Company Logo" className="w-17 h-16" />
            <p className="text-3xl font-semibold text-blue-950 text-center">
              Welcome Back
            </p>
          </div>

          <p className="text-xl mb-8 text-blue-950 font-bold text-center">
            Sign into your account
          </p>

          <Form
            onSubmit={handleSubmit}
            className="w-full max-w-md flex flex-col p-6 mx-auto"
          >
            <FormGroup className="mb-4 w-full">
              <label className="w-full block mb-2 text-m font-bold text-black">
                Email
              </label>
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-transparent border border-black text-black p-2 pl-10 rounded-md w-full placeholder-black"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <label className="block mb-2 text-m font-bold text-black">
                Password
              </label>
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
                <Input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-transparent border border-black text-black p-2 pl-10 pr-10 rounded-md w-full placeholder-black"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  required
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </FormGroup>

            <Link
              to="/Forgot_Password"
              className="text-red-600 hover:underline text-right text-sm font-semibold"
            >
              FORGOT PASSWORD?
            </Link>

            <div className="text-center mt-4">
              {isLoading ? (
                <CustomSpin />
              ) : (
                <Button
                  type="submit"
                  className="font-sans font-bold text-white w-full p-2 my-4 bg-yellow-600 hover:bg-yellow-400 rounded-xl"
                >
                  LOGIN
                </Button>
              )}
            </div>

            <p className="text-center text-sm font-semibold">
              DON'T HAVE AN ACCOUNT?
              <Link
                to="/admin_register"
                className="text-yellow-600 hover:underline px-4"
              >
                SIGN UP
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Admin_login;
