import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logimage from "@/assets/log.jpg";
import logo from "@/assets/logo2.png";
import backgroundImage from "@/assets/bg.jpg";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Updated form state with the specified fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    profilePicture: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle file input for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        profilePicture: file,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.contactNumber ||
      !formData.password
    ) {
      alert("Please fill all required fields");
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

          <p className="text-xl text-blue-950 font-bold text-center mb-4">
            Sign up to get started
          </p>

          {/* Single-step form */}
          <form
            className="w-full max-w-md flex flex-col p-4 mx-auto"
            onSubmit={handleSubmit}
          >
            <div className="mb-2 w-full">
              {/* First Name */}
              <label className="block mb-1 text-m font-bold text-black">
                First Name
              </label>
              <input
                className="bg-transparent border border-black text-black p-2 rounded-md w-full  placeholder-black"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter First Name"
                required
              />

              {/* Last Name */}
              <label className="block mb-1 text-m font-bold text-black">
                Last Name
              </label>
              <input
                className="bg-transparent border border-black text-black p-2 rounded-md w-full  placeholder-black"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter Last Name"
                required
              />

              {/* Email */}
              <label className="block mb-1 text-m font-bold text-black">
                Email
              </label>
              <input
                className="bg-transparent border border-black text-black p-2 rounded-md w-full placeholder-black"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                required
              />

              {/* Contact Number */}
              <label className="block mb-1 text-m font-bold text-black">
                Contact Number
              </label>
              <input
                className="bg-transparent border border-black text-black p-2 rounded-md w-full  placeholder-black"
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Enter Contact Number"
                required
              />

              {/* Profile Picture */}
              <label className="block mb-1 text-m font-bold text-black">
                Profile Picture
              </label>
              <input
                className="bg-transparent border border-black text-black p-2 rounded-md w-full "
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleFileChange}
              />

              {/* Password */}
              <label className="block mb-1 text-m font-bold text-black">
                Password
              </label>
              <div className="relative mb-1">
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
            </div>

            <button
              type="submit"
              className="font-sans text-white font-bold w-full p-2  bg-yellow-600 hover:bg-yellow-400 rounded-xl"
              disabled={isLoading}
            >
              {isLoading ? "SIGNING UP..." : "SIGN UP"}
            </button>
          </form>

          <p className="text-center text-sm font-semibold">
            ALREADY HAVE AN ACCOUNT?
            <Link
              to="/Admin_login"
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

export default Register;
