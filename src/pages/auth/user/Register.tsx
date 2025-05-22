import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Eye, EyeOff, Phone } from "lucide-react";
import logimage from "@/assets/log.jpg";
import logo from "@/assets/logo2.png";
import backgroundImage from "@/assets/bg.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Login = () => {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",

  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const error = await login(formData);
    if (error) {
      toast({
        title: "Login Error",
        description: error,
        variant: "destructive",
      });
    } else (
      toast({
        title: "Login success",
        // description: error,
        variant: "default",
      })
    )
    setIsLoading(false);
  };

  return (
    //outer div
    <div
      className="w-full h-screen flex justify-center"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 m-auto sm:max-w-screen-lg w-[90%] shadow-2xl rounded-2xl overflow-hidden border"
      >
        <div className=" p-4 flex flex-col items-center justify-center w-full bg-background  ">
          <div className="text-center items-center justify-center mb-4">
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}>

              <Link to={'/'}>
                <img src={'./logo-full.png'} alt="Toto Academy Logo" className="h-24 mx-auto my-4" />
              </Link>
            </motion.div>
            <motion.h1
              className="text-sm font-bold text-gray-800 dark:text-gray-50"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .8, delay: 0.4 }}>
              Sign into your account
            </motion.h1>
          </div>
          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col p-6 mx-auto space-y-4">
            <div className="mb-4 w-full space-y-6">
              <div>

                <Label className="w-full mb-2 text-sm font-bold flex items-center gap-1">
                  <Mail className="h-4" />
                  Email
                </Label>
                <Input
                  className=""
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"

                />
              </div>


              <Label className="w-full mb-2 text-sm font-bold flex items-center gap-1">
                <Lock className="h-4" />
                Password
              </Label>
              <div className="relative border border-input rounded-md">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  required
                />

              </div>
            </div>

            <Link
              to="/Forgot_Password"
              className="text-gray-400 hover:underline text-right text-sm font-semibold"
            >
              forgot password?
            </Link>

            <Button
              variant="ghost"
              type="submit"
              disabled={isLoading} // Disable button when loading
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-400"></span>
                  Loading...
                </div>
              ) : (
                "LOGIN"
              )}
            </Button>

            <p className="text-center text-xs font-semibold">
              Don't have an account?
              <Link
                to="/register"
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


      </motion.div>
    </div>
  );

};

export default Login;
