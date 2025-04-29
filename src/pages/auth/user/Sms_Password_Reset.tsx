import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import logimage from "@/assets/log.jpg";
import logo from "@/assets/logo2.png";
import backgroundImage from "@/assets/bg.jpg";

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    //outer div
    <div
      className="w-full h-screen flex"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* box div */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 m-auto h-[700px] shadow-[0_4px_6px_rgba(255,255,255,0.3)] sm:max-w-[1300px]
     bg-white rounded-xl"
      >
        {/* image container div left*/}
        <div className="w-full h-[700px] hidden md:block">
          <img
            className="w-full h-full rounded-xl rounded-r-none"
            src={logimage}
          />
        </div>
        {/* image div end */}

        <div className=" p-4 flex flex-col items-center justify-center w-full  bg-gradient-to-b from-white to-blue-200  rounded-xl rounded-l-none  ">
          <div className="flex items-center justify-center mb-4">
            <img
              src={logo}
              alt="Toto Academy Logo"
              className=" w-17 h-16 mb-6"
            />
            <p className="text-3xl font-semibold mb-6 text-blue-950 text-center">
              Welcome Back
            </p>
          </div>

          <p className="text-xl mb-8 text-blue-950 font-bold text-center">
            Enter New Credentials
          </p>

          {/* Form now centered with mx-auto and wider inputs */}
          <form className="w-full max-w-md flex flex-col p-6 mx-auto bg">
            <div className="mb-4 w-full">
              <label className="w-full block mb-2 text-m font-bold text-black">
                New Password
              </label>
              <input
                className="bg-transparent border border-black text-black p-2 rounded-md w-full mb-6 placeholder-black"
                type="text"
                placeholder="Enter New Password......."
              />

              <label className="w-full block mb-2 text-m font-bold text-black">
                Confirm Password
              </label>
              <input
                className="bg-transparent border border-black text-black p-2 rounded-md w-full mb-6 placeholder-black"
                type="text"
                placeholder="Confirm Password......"
              />
            </div>

            <button className="font-sans text-white font-semibold w-full p-2 my-4 bg-yellow-600 hover:bg-yellow-400 rounded-xl">
              CONTINUE
            </button>

            <Link
              to="/forgot_password"
              className="text-yellow-600 hover:underline text-right"
            >
              Back
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
