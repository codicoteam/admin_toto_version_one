import { useEffect, useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import logo from "@/assets/logo.png";
import { LogIn, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const Navrbar = () => {
  const [nav, setNav] = useState(false);

  const handleClick = () => setNav(!nav);

  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    // Apply the initial theme on mount
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="w-screen h-[80px] z-10 bg-zinc-200  dark:bg-gray-900 fixed drop-shadow-lg">
      <div className="px-2 flex justify-between items-center w-full h-full">
        <div className="flex items-center">
          <div className="flex items-center">
            <img className="h-20 w-20 mr-2 ml-7 " src={logo} alt="Toto" />
            <h1 className="text-3xl font-bold mr-4 sm:text-4xl">
              Toto Academy
            </h1>
            <ul className="hidden md:flex ml-28 font-bold text-base text-black dark:text-white">
              <li className="mx-2 hover:text-blue-500 transition">
                <Link to="/homepage">Home</Link>
              </li>
              <li className="mx-2 hover:text-blue-500 transition">
                <Link to="/aboutpage">About Us</Link>
              </li>
              <li className="mx-2 hover:text-blue-500 transition">S</li>
              <li className="mx-2 hover:text-blue-500 transition">Library</li>
              <li className="mx-2 hover:text-blue-500 transition">Chat</li>
              <li className="mx-2 hover:text-blue-500 transition">Contact</li>
            </ul>
          </div>
          <div className="hidden md:flex pr-4">
            <button className="border-none bg-blue-600 rounded-full text-white px-3 py-1 mx-4">
              Sign up
            </button>
            <button className="border-2 border-blue-600 bg-transparent text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-1  rounded-full  transition">
              Login
            </button>
            <Button className="rounded-full" onClick={toggleTheme}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={darkMode ? "dark" : "light"}
                  initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  {darkMode ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
        <div className="md:hidden" onClick={handleClick}>
          {!nav ? <MenuIcon className="w-7" /> : <XIcon className="w-7" />}
        </div>
      </div>

      <ul className={!nav ? "hidden" : "absolute bg-zinc-200 w-full px-8"}>
        <li className="border-b-2 border-zinc-300 w-full">Home</li>
        <li className="border-b-2 border-zinc-300 w-full">About Us</li>
        <li className="border-b-2 border-zinc-300 w-full">Courses</li>
        <li className="border-b-2 border-zinc-300 w-full">Library</li>
        <li className="border-b-2 border-zinc-300 w-full">Chat</li>
        <li className="border-b-2 border-zinc-300 w-full">Contact</li>
        <div className="mt-2 flex flex-col my-4">
          <button className="border-none bg-blue-600 rounded-full text-white px-4 py-2  mb-2">
            Sign Up
          </button>
          <button className="border-2 border-blue-600 bg-transparent text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2  mb-2 rounded-full  transition">
            Login
          </button>
        </div>
      </ul>
    </div>
  );
};

export default Navrbar;
