import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRightCircle, ExternalLink, Facebook, Instagram, LogIn, Mail, Moon, StretchHorizontal, Sun, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'

const WelcomeLayout = () => {
    const { isAuthenticated } = useAuth();
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/student')
            return;
        }
    }, [])

    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
    const [scrolled, setScrolled] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
        console.log(window.document.documentElement.scrollWidth);

        // Clean up the event listener on component unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
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

    const toggleMobileNav = () => {
        setMobileNavOpen(!mobileNavOpen);
    };

    return (
        <div className=''>
            <AnimatePresence mode="wait">
                <motion.header
                    initial={{ opacity: 0, }}
                    animate={{ opacity: 1, }}
                    transition={{ duration: 1, delay: 0.4 }}
                    key={'background'}
                    className={`fixed top-0 p-1 w-full z-40 transition-all  ${scrolled ? 'bg-background/60  backdrop-blur border-b shadow-lg' : 'bg-transparent'}`}>
                    <div className=" max-w-screen-xl  mx-auto">
                        <div className='flex justify-between items-center'>
                            <Link to={'/welcome/'}>
                                <img
                                    className="w-16 my-2"
                                    src={'./logo.png'}
                                    alt="Students"
                                />
                            </Link>

                            <nav className="hidden md:flex items-center space-x-1 gap-4">
                                <NavLink to={'/welcome/'} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                                    Home
                                </NavLink>
                                <NavLink to={'/welcome/about'} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                                    About us
                                </NavLink>
                                <NavLink to={'/welcome/courses'} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                                    Courses
                                </NavLink>
                                <NavLink to={'/welcome/pricing'} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                                    Pricing
                                </NavLink>
                                <NavLink to={'/welcome/contact'} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                                    Contact
                                </NavLink>
                                <Link to={'/register'} className='border-[#002157] border rounded-full      p-2 px-5 dark:text-gray-50 flex text-sm items-center'>
                                    <p className=''>Sign Up</p>
                                </Link>
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
                            {/* <Button className="md:hidden z-40" variant="ghost" size="icon" onClick={toggleMobileNav}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="4" x2="20" y1="12" y2="12" />
                                <line x1="4" x2="20" y1="6" y2="6" />
                                <line x1="4" x2="20" y1="18" y2="18" />
                            </svg>
                        </Button> */}

                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full md:hidden z-40 bg-transparent hover:bg-transparent"
                                onClick={() => {
                                    toggleMobileNav();
                                }}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={mobileNavOpen ? "dark" : "light"}
                                        initial={{ scale: 0.5, opacity: 0, x: -20 }}
                                        animate={{ scale: 1, opacity: 1, x: 0 }}
                                        exit={{ scale: 0.5, opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {!mobileNavOpen ? (
                                            <StretchHorizontal className="h-5 w-5" />
                                        ) : (
                                            <X className="h-5 w-5" />
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </Button>
                            {mobileNavOpen && (
                                <nav className="absolute top-0 left-0 w-full h-screen bg-background/90 z-30 flex flex-col items-center justify-center space-y-4">
                                    <NavLink to={'/welcome/'} className="text-lg font-semibold" onClick={() => setMobileNavOpen(false)}>
                                        Home
                                    </NavLink>
                                    <NavLink to={'/welcome/about'} className="text-lg font-semibold" onClick={() => setMobileNavOpen(false)}>
                                        About Us
                                    </NavLink>
                                    <NavLink to={'/welcome/courses'} className="text-lg font-semibold" onClick={() => setMobileNavOpen(false)}>
                                        Courses
                                    </NavLink>
                                    <NavLink to={'/welcome/pricing'} className="text-lg font-semibold" onClick={() => setMobileNavOpen(false)}>
                                        Pricing
                                    </NavLink>
                                    <NavLink to={'/welcome/contact'} className="text-lg font-semibold" onClick={() => setMobileNavOpen(false)}>
                                        Contact
                                    </NavLink>
                                    <NavLink to={'/welcome/login'} className="bg-[#002157] rounded-full text-white p-2 px-5 dark:text-gray-50 flex text-sm items-center" onClick={() => setMobileNavOpen(false)}>
                                        <p>Login</p>
                                        <LogIn className="h-4" />
                                    </NavLink>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full"
                                        onClick={() => {
                                            toggleTheme();
                                            setMobileNavOpen(false);
                                        }}
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
                            )}
                        </div>
                    </div>
                </motion.header>
            </AnimatePresence>
            <div >
                <Outlet />
            </div>

            <footer className="bg-slate-100 dark:bg-gray-800 border-t border-border">
                <div className="max-w-screen-xl mx-auto px-4 py-20">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <img src="./logo-full.png" className='h-32' alt="logo" />
                            <p className="text-muted-foreground max-w-md">
                                Empowering learners worldwide with quality education and innovative learning solutions.
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
                                <Link to="/chat" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Chat
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
                            <h3 className="text-lg font-semibold mb-4">Courses</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Mathematics</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Computer Science</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Business</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Science</a></li>
                                <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Humanities</a></li>
                            </ul>
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


                    <div className="border-t  border-border/50  mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-muted-foreground">
                        <p>© {new Date().getFullYear()} Toto Academy. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default WelcomeLayout