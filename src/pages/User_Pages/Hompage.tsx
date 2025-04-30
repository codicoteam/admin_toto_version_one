import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import home from "@/assets/home.png";
import logo from "@/assets/logo.png";

const Homepage = () => {
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
    <div className="w-full min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <header className="bg-white dark:bg-gray-900 py-4 px-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img className="h-20 w-20" src={logo} alt="Toto" />
            </div>
            <nav className="hidden md:flex space-x-8 items-center">
              <a href="#" className="font-semibold text-m">
                HOME
              </a>
              <a href="#" className="font-semibold  text-m ">
                ABOUT US
              </a>
              <a href="#" className="font-semibold  text-m ">
                COURSES
              </a>
              <a href="#" className="font-semibold text-m ">
                LIBRARY
              </a>
              <a href="#" className="font-semibold  text-m ">
                CHAT
              </a>
              <a href="#" className="font-semibold  text-m ">
                CONTACT
              </a>
            </nav>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => navigate("/signup")}
                className="bg-white text-gray-900 border border-gray-300 rounded-full hover:bg-gray-100 px-6 py-1 h-9 text-sm font-medium"
              >
                SIGN UP
              </Button>
              <Button
                onClick={() => navigate("/login")}
                className=" bg-blue-600 text-white rounded-full hover:bg-blue-900 px-6 py-1 h-9 text-sm font-medium"
              >
                LOGIN
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={toggleTheme}
              >
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
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col ">
        <section className="flex- relative overflow-hidden">
          <div className="max-w-screen-xl mx-auto my-auto overflow-hidden  h-full">
            <div className="flex flex-col md:flex-row items-center h-full pt-8 pb-24">
              {/* Left Content */}
              <div className="md:w-1/2 z-10">
                <h1 className="mt-10 text-5xl md:text-7xl font-bold text-black dark:text-white leading-tight">
                  Welcome to
                  <br />
                  <span className="text-blue-900 dark:text-blue-700">
                    Toto Academy
                  </span>
                  <br />
                  E-Learning Platform
                </h1>

                <div className="mt-20 space-x-16">
                  <Button className="text-lg bg-blue-600 border border-gray-300 hover:bg-blue-400 text-white rounded-full px-8 py-2 font-bold">
                    Subscribe
                  </Button>
                  <Button className="text-lg bg-white   hover:bg-blue-300 text-black rounded-full px-8 py-2 font-bold">
                    View Profile
                  </Button>
                </div>
                <h1 className="mt-20 text-xl md:text-2xl font-bold text-white dark:text-white ">
                  Empowering Minds, Once Course at a Time
                </h1>
              </div>

              {/* Right Content with Image */}
              <div className="md:w-2/3 relative mt-10 md:mt-0 z-10 ">
                <img
                  src={home}
                  alt="Student with laptop"
                  className="w-full h-auto object-contain relative z-10 mx-48"
                />
              </div>
            </div>
          </div>

          {/* Slanted Blue Background */}
          <div className="absolute bottom-0 left-0 right-0 z-0 overflow-hidden">
            <svg
              className="w-full h-auto"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
              style={{ display: "block" }}
            >
              <path
                fill="#0A2463"
                d="M0,160 L1440,0 L1440,320 L0,320 Z"
                className="transform-gpu"
              ></path>
            </svg>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;
