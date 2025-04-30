import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

const authLayout = () => {
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
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
        <div className='relative'>
            <Button
                variant="ghost"
                size="icon"
                className="ml-2 rounded-full absolute top-4 z-50 right-4 bg-background"
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
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="hero-blur w-96 h-96 bg-blue-500 rounded-full -top-20 -right-20"></div>
                <div className="hero-blur w-96 h-96 bg-purple-500 rounded-full bottom-10 -left-20"></div>
            </div>
            <Outlet />
        </div>
    )
}

export default authLayout