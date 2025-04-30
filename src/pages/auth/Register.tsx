import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import logimage from "@/assets/log.jpg";
import logo from "@/assets/logo2.png";
import backgroundImage from "@/assets/bg.jpg";
import { motion, AnimatePresence } from "framer-motion";

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
      className="w-full h-screen flex justify-center"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <div
        className="grid grid-cols-1 md:grid-cols-2 m-auto max-w-screen-lg shadow-2xl rounded-2xl overflow-hidden border"
      >
        <div className=" p-4 flex flex-col items-center justify-center w-full bg-background  ">
          <div className="text-center items-center justify-center mb-4">
            <img src={'./logo-full.png'} alt="Toto Academy Logo" className="h-24 mx-auto my-4" />
            <motion.h1
              className="text-sm font-bold text-gray-800 dark:text-gray-50"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Sign into your account
            </motion.h1>
          </div>
          <form className="w-full max-w-md flex flex-col p-6 mx-auto space-y-4">
            <div className="mb-4 w-full space-y-6">
              <div>

                <Label className="w-full block mb-2 text-sm font-bold">
                  Phone Number
                </Label>
                <Input
                  className=""
                  type="text"
                  placeholder="Enter Phone number"

                />
              </div>


              <Label className="w-full block mb-2 text-sm font-bold">
                Password
              </Label>
              <Input
                type="text"
                id="PasswordInput"
                placeholder="Enter passsword"
              />

            </div>

            <Link
              to="/Forgot_Password"
              className="text-gray-400 hover:underline text-right text-sm font-semibold"
            >
              forgot password?
            </Link>

            <Button
              variant='ghost'
              onClick={() => navigate("/dashboard")}
            >
              LOGIN
            </Button>

            <p className="text-center text-sm font-semibold">
              Don't have an account?
              <Link
                to="/login"
                className="text-yellow-600 hover:underline px-2"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>

        <div className="w-full  hidden md:block  ">
          <img
            className="h-full object-cover "
            src={logimage}
          />
        </div>


      </div>
    </div>
  );
};

export default Register;
