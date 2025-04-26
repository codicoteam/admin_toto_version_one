import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ChevronDown, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import logimage from "@/assets/log.jpg";
import logo from "@/assets/logo2.png";
import backgroundImage from "@/assets/bg.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    phoneNumber: "",
    email: "",
    level: "",
    school: "",
    password: "",
    confirmPassword: "",
    subjects: [], // Array for multiple subjects
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle subject selection for custom dropdown
  const toggleSubject = (subject) => {
    setFormData((prevState) => {
      // If subject is already selected, remove it
      if (prevState.subjects.includes(subject)) {
        return {
          ...prevState,
          subjects: prevState.subjects.filter((item) => item !== subject),
        };
      }
      // Otherwise add it
      else {
        return {
          ...prevState,
          subjects: [...prevState.subjects, subject],
        };
      }
    });
  };

  // Remove a selected subject
  const removeSubject = (subject) => {
    setFormData((prevState) => ({
      ...prevState,
      subjects: prevState.subjects.filter((item) => item !== subject),
    }));
  };

  // Move to next step
  const nextStep = (e) => {
    e.preventDefault();
    // Basic validation for first step
    if (
      !formData.firstName ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.level ||
      !formData.school
    ) {
      alert("Please fill all fields");
      return;
    }

    setCurrentStep(2);
  };

  // Go back to first step
  const prevStep = () => {
    setCurrentStep(1);
  };

  // Final submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate second step
    if (
      !formData.password ||
      !formData.confirmPassword ||
      formData.subjects.length === 0
    ) {
      alert("Please complete all fields");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      setIsLoading(false);
      return;
    }

    // Simulate signup
    setTimeout(() => {
      setIsLoading(false);
      console.log("Form submitted:", formData);
      navigate("/");
    }, 1000);
  };

  // Available subjects for selection
  const availableSubjects = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Art",
    "Music",
  ];

  return (
    <div
      className="w-full h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 m-auto h-[700px] shadow-lg sm:max-w-[1300px]
        bg-white rounded-xl overflow-hidden"
      >
        {/* Left image container */}
        <div className="w-full h-[700px] hidden md:block">
          <img
            className="w-full h-full object-cover"
            src={logimage}
            alt="Login background"
          />
        </div>

        {/* Right form container */}
        <div className="p-4 flex flex-col items-center justify-center w-full bg-gradient-to-b from-white to-blue-200 rounded-xl rounded-l-none">
          <div className="flex items-center justify-center mb-2">
            <img src={logo} alt="Toto Academy Logo" className="w-16 h-16" />
            <p className="text-3xl font-semibold text-blue-950 text-center ml-2">
              Welcome to Toto Academy
            </p>
          </div>

          <p className="text-xl text-blue-950 font-bold text-center">
            Sign up to get started
          </p>

          <p className="text-sm  text-blue-700 font-medium">
            Step {currentStep} of 2
          </p>

          {/* Step indicator */}
          <div className="flex w-64 mb-3">
            <div
              className={`h-2 flex-1 rounded-l-full ${currentStep === 1 ? "bg-blue-500" : "bg-blue-300"
                }`}
            ></div>
            <div
              className={`h-2 flex-1 rounded-r-full ${currentStep === 2 ? "bg-blue-500" : "bg-blue-300"
                }`}
            ></div>
          </div>

          {/* Step 1 Form - Personal Information */}
          {currentStep === 1 && (
            <form
              className="w-full max-w-md flex flex-col p-4 mx-auto"
              onSubmit={nextStep}
            >
              <div className="mb-2 w-full">
                <label className="block mb-1 text-m font-bold text-black">
                  First Name
                </label>
                <input
                  className="bg-transparent border border-black text-black p-2 rounded-md w-full mb-3 placeholder-black"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter First Name"
                  required
                />

                <label className="block mb-1 text-m font-bold text-black">
                  Phone Number
                </label>
                <input
                  className="bg-transparent border border-black text-black p-2 rounded-md w-full mb-3 placeholder-black"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  required
                />

                <label className="block mb-1 text-m font-bold text-black">
                  Email
                </label>
                <input
                  className="bg-transparent border border-black text-black p-2 rounded-md w-full mb-3 placeholder-black"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  required
                />

                <label className="block mb-1 text-m font-bold text-black">
                  Level
                </label>
                <select
                  className="bg-transparent border border-black text-black p-2 rounded-md w-full mb-3"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled hidden>
                    Select Level
                  </option>
                  <option value="upper">Upper Level</option>
                  <option value="lower">Lower Level</option>
                </select>

                <label className="block mb-1 text-m font-bold text-black">
                  School
                </label>
                <input
                  className="bg-transparent border border-black text-black p-2 rounded-md w-full mb-3 placeholder-black"
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="Enter School Name"
                  required
                />
              </div>

              <button
                type="submit"
                className="font-sans text-white font-bold w-full p-2 my-3 bg-yellow-600 hover:bg-yellow-200 rounded-xl"
              >
                NEXT
              </button>
            </form>
          )}

          {/* Step 2 Form - Subject Selection and Password */}
          {currentStep === 2 && (
            <form
              className="w-full max-w-md flex flex-col p-4 mx-auto"
              onSubmit={handleSubmit}
            >
              <div className="mb-2 w-full">
                <label className="block mb-1 text-m font-bold text-black">
                  Subjects
                </label>
                {/* Custom Multi-Select Dropdown */}
                <div className="relative mb-3">
                  {/* Selected subjects display */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {formData.subjects.map((subject) => (
                      <div
                        key={subject}
                        className="bg-blue-100 rounded-full px-2 py-1 flex items-center text-sm"
                      >
                        {subject}
                        <button
                          type="button"
                          onClick={() => removeSubject(subject)}
                          className="ml-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Dropdown trigger */}
                  <div
                    className="bg-transparent border border-black text-black p-2 rounded-md w-full flex justify-between items-center cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <span
                      className={
                        formData.subjects.length === 0 ? "text-gray-500" : ""
                      }
                    >
                      {formData.subjects.length === 0
                        ? "Select Subjects"
                        : `${formData.subjects.length} subject${formData.subjects.length !== 1 ? "s" : ""
                        } selected`}
                    </span>
                    <ChevronDown size={20} />
                  </div>

                  {/* Dropdown menu */}
                  {dropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {availableSubjects.map((subject) => (
                        <div
                          key={subject}
                          className={`p-2 hover:bg-blue-100 cursor-pointer ${formData.subjects.includes(subject)
                            ? "bg-blue-50"
                            : ""
                            }`}
                          onClick={() => toggleSubject(subject)}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.subjects.includes(subject)}
                              onChange={() => { }}
                              className="mr-2"
                            />
                            {subject}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <label className="block mb-1 text-m font-bold text-black">
                  Password
                </label>
                <div className="relative mb-4">
                  <input
                    className="bg-transparent border border-black text-black p-2 rounded-md w-full placeholder-black"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <label className="block mb-1 text-m font-bold text-black">
                  Confirm Password
                </label>
                <div className="relative mb-4">
                  <input
                    className="bg-transparent border border-black text-black p-2 rounded-md w-full placeholder-black"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="font-sans font-semibold w-1/2 p-2 my-4 bg-transparent border border-yellow-600 rounded-xl"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  className="font-sans text-white font-bold w-1/2 p-2 my-4 bg-yellow-600 hover:bg-yellow-400 rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? "SIGNING UP..." : "SIGN UP"}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm font-semibold">
            ALREADY HAVE AN ACCOUNT?
            <Link
              to="/Register"
              className="text-yellow-600 hover:underline px-4"
            >
              SIGN IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
