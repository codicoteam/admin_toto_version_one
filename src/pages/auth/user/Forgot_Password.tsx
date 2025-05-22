import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import logimage from "@/assets/log.jpg";
import logo from "@/assets/logo2.png";
import backgroundImage from "@/assets/bg.jpg";

const ForgotPassword = () => {
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
            <img src={logo} alt="Toto Academy Logo" className=" w-17 h-16" />
            <p className="text-3xl font-semibold text-blue-950 text-center">
              Welcome Back
            </p>
          </div>

          <p className="text-xl mb-8 text-blue-950 font-bold text-center">
            FORGOT YOUR PASSWORD?
          </p>
          <p className="text-lg mb-8 text-blue-950  text-center">
            Select Which Contact Detail Should We Use To Reset Your Password
          </p>

          {/* Form now centered with mx-auto and wider inputs */}
          <form className="w-full max-w-md flex flex-col p-6 mx-auto bg">
            <Link
              to="/sms_password_reset"
              className="font-sans mb-6 text-white font-semibold px-4 py-2 border bg-blue-900 rounded-lg hover:bg-blue-700 inline-block text-center"
            >
              VIA SMS
            </Link>

            <Link
              to="/email_password_reset"
              className="font-sans  mb-6 text-white font-semibold px-4 py-2 border bg-blue-900 rounded-lg hover:bg-blue-700 inline-block text-center"
            >
              VIA EMAIL
            </Link>
            <Link
              to="/Register"
              className="text-white  px-4 py-1 border bg-yellow-600 hover:bg-yellow-400 inline-block w-[70px] rounded-xl"
            >
              Back
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
