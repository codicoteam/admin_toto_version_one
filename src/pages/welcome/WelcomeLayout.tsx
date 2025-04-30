import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRightCircle, ExternalLink, Facebook, Instagram, LogIn, Mail, Moon, Sun } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'

const WelcomeLayout = () => {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Check if page is scrolled beyond 20px
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

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
        <div className=''>
            <header className={`sticky top-0 p-1 w-full z-40  ${scrolled ? 'bg-background/60  backdrop-blur' : 'bg-transparent'}`}>
                <div className=" max-w-screen-xl  mx-auto">
                    <div className='flex justify-between items-center'>
                        <Link to={'/'}>
                            <img
                                className="w-16 my-2"
                                src={'./logo.png'}
                                alt="Students"
                            />
                        </Link>

                        <nav className="hidden md:flex items-center space-x-1 gap-4">
                            <NavLink to={'/'} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                                Home
                            </NavLink>
                            <NavLink to={'/about'} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                                About Us
                            </NavLink>
                            <NavLink to={'/courses'} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                                Courses
                            </NavLink>
                            <NavLink to={'/pricing'} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                                Pricing
                            </NavLink>
                            <NavLink to={'/contact'} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                                Contact
                            </NavLink>
                            <NavLink to={'/login'} className='bg-[#002157] rounded-full text-white  p-2 px-5 dark:text-gray-50 flex text-sm items-center'>
                                <p className=''>Login</p>
                                <LogIn className='h-4' />
                            </NavLink>
                            <Button
                                variant='outline'
                                size="icon"
                                className="ml-2 rounded-full"
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
                        </nav>
                        <Button className="md:hidden" variant="ghost" size="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" x2="20" y1="12" y2="12" />
                                <line x1="4" x2="20" y1="6" y2="6" />
                                <line x1="4" x2="20" y1="18" y2="18" />
                            </svg>
                        </Button>

                    </div>
                </div>
            </header>
            <div >
                <Outlet />
            </div>

            <footer className="bg-toto-light-blue dark:bg-secondary/30 border-t border-border">
                <div className="container mx-auto px-4 py-12 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="space-y-4">
                            <img src="./logo-full.png" className='h-32' alt="logo" />
                            <p className="text-muted-foreground max-w-md">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat enim id dolores facere.
                            </p>
                            <div className="flex space-x-4">

                                <Button variant="ghost" size="icon" className="rounded-full" asChild>
                                    <a href="" aria-label="Email">
                                        <Mail className="h-5 w-5" />
                                    </a>
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full" asChild>
                                    <a href="" aria-label="Email">
                                        <Facebook className="h-5 w-5" />
                                    </a>
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full" asChild>
                                    <a href="" aria-label="Email">
                                        <Instagram className="h-5 w-5" />
                                    </a>
                                </Button>

                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <nav className="flex flex-col space-y-2">
                                <Link to="/register" className="text-muted-foreground hover:text-foreground transition-colors flex gap-4">
                                    Register Now
                                    <ArrowRightCircle className="h-5 w-5" />
                                </Link>
                                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Home
                                </Link>
                                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                                    About
                                </Link>
                                <Link to="/Courses" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Courses
                                </Link>
                                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Contact
                                </Link>
                            </nav>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact</h3>
                            <div className="space-y-3">
                                <p className="text-muted-foreground">Email: toto@mail.com</p>
                                <p className="text-muted-foreground">Location:  Harare, Zimbabwe</p>
                                <Button className=" rounded-none my-6 ">
                                    <Link to="/contact" className="inline-flex items-center">
                                        <h1>
                                            Get in touch
                                        </h1>
                                        <ExternalLink className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-border/50 text-center text-sm text-muted-foreground">
                        <p>© {new Date().getFullYear()} Toto Academy. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default WelcomeLayout