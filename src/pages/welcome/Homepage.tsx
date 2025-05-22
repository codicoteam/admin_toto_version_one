import React, { useEffect, useState } from 'react'
import logo from "@/assets/logo2.png";
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowRightCircle, ArrowRightFromLine, Award, BookOpen, Clock, ExternalLink, Facebook, Instagram, LogIn, Mail, MapPin, Moon, Phone, Star, Sun, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CourseCard, { CourseCardProps } from '@/components/CourseCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Homepage = () => {

    const navigate = useNavigate();
    const toast = useToast()
    const popularCourses = [
        {
            id: "1",
            title: "Advanced Mathematics",
            description: "Master calculus, algebra, and geometry with our comprehensive math program.",
            thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            students: 1245,
            duration: "12 weeks",
            level: "Intermediate"
        },
        {
            id: "2",
            title: "Computer Science",
            description: "Learn programming, algorithms, and data structures from industry experts.",
            thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            students: 1893,
            duration: "16 weeks",
            level: "Beginner"
        },
        {
            id: "3",
            title: "World Geography",
            description: "Explore the physical and cultural landscapes of our planet.",
            thumbnailUrl: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            students: 876,
            duration: "8 weeks",
            level: "All Levels"
        },
        {
            id: "4",
            title: "Financial Accounting",
            description: "Master the principles of financial reporting and analysis.",
            thumbnailUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            students: 1102,
            duration: "10 weeks",
            level: "Intermediate"
        },
        {
            id: "5",
            title: "Modern Physics",
            description: "Dive into quantum mechanics, relativity, and particle physics.",
            thumbnailUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            students: 743,
            duration: "14 weeks",
            level: "Advanced"
        },
        {
            id: "6",
            title: "English Literature",
            description: "Explore classic and contemporary works of English literature.",
            thumbnailUrl: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            students: 932,
            duration: "10 weeks",
            level: "All Levels"
        },
    ];

    // const popularCourses = [
    //     {
    //         id: "1",
    //         title: "Mathematics",
    //         thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    //         students: 18,
    //     },
    //     {
    //         id: "2",
    //         title: "Computer Science",

    //         thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    //         students: 18,
    //     },
    //     {
    //         id: "3",
    //         title: "Geography",
    //         thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    //         students: 18,
    //     },
    //     {
    //         id: "3",
    //         title: "Accounting",
    //         thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    //         students: 18,
    //     },
    //     {
    //         id: "3",
    //         title: "Physics",

    //         thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
    //         students: 18,
    //     },
    //     {
    //         id: "3",
    //         title: "English Language",
    //         thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",

    //         students: 18,
    //     },

    // ]


    const features = [
        {
            icon: <BookOpen className="w-8 h-8" />,
            title: "Interactive Courses",
            description: "Engaging multimedia content with quizzes and assignments"
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: "Certification",
            description: "Earn recognized certificates upon course completion"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Expert Instructors",
            description: "Learn from industry professionals and academic experts"
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "Flexible Learning",
            description: "Study at your own pace, anytime, anywhere"
        }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Computer Science Student",
            content: "Toto Academy transformed my learning experience. The courses are well-structured and the instructors are incredibly knowledgeable.",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            name: "Michael Chen",
            role: "High School Teacher",
            content: "I've used Toto Academy to supplement my classroom teaching. The resources are excellent and my students love the interactive elements.",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            name: "Emma Rodriguez",
            role: "Lifelong Learner",
            content: "As an adult learner, I appreciate the flexibility Toto Academy offers. I can balance my studies with my full-time job.",
            avatar: "https://randomuser.me/api/portraits/women/63.jpg"
        }
    ];

    return (
        <div className="">
            <section className="relative py-16">

                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="hero-blur w-96 h-96 bg-blue-500 rounded-full -top-20 -right-20"></div>
                    <div className="hero-blur w-96 h-96 bg-purple-500 rounded-full bottom-10 -left-20"></div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }} className="absolute bottom-0 left-0 right-0 hidden md:block -scale-x-100">
                    <svg
                        viewBox="0 0 1200 300"
                        preserveAspectRatio="none"
                        className="absolute bottom-0 left-0 w-full h-[200px] md:h-[400px]"
                    >
                        <path
                            d="M0,150 C150,300 450,50 750,200 C1050,350 1200,100 1200,150 L1200,300 L0,300 Z"
                            fill="#002157"
                            className="dark:fill-[#002157]/80"
                            opacity="0.2"
                        ></path>
                        <path
                            d="M0,200 C150,350 450,100 750,250 C1050,400 1200,150 1200,200 L1200,300 L0,300 Z"
                            fill="#002157"
                            className="dark:fill-[#002157]/80"
                            opacity="0.4"
                        ></path>
                        <path
                            d="M0,250 C150,400 450,150 750,300 C1050,450 1200,200 1200,250 L1200,300 L0,300 Z"
                            fill="#002157"
                            className="dark:fill-[#002157]/80"
                        ></path>
                    </svg>
                </motion.div>
                <div className=" sm:max-w-screen-xl  mx-auto">


                    <section className="relative overflow-hidden">
                        <div className="max-w-screen-xl mx-auto px-4 md:text-left text-center">
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
                                <div className='space-y-16 py-12 md:py-24'>
                                    <motion.h1
                                        className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-50 "
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        Welcome to <br />
                                        <span className='text-[#002157]'>Toto Academy</span> <br />
                                        E-Learning Platform
                                    </motion.h1>
                                    <motion.p
                                        className='text-md leading-8 text-gray-600 dark:text-gray-300'
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                    >
                                        Your gateway to knowledge starts here! Discover interactive courses, expert instructors, and a vibrant learning community - all designed to make your educational experience enjoyable and effective.
                                    </motion.p>

                                    <motion.div
                                        className="flex flex-wrap gap-4 justify-center md:justify-start"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                    >
                                        <Button
                                            onClick={() => navigate('/register')}
                                            className='bg-[#002157] hover:bg-[#003182]  px-12 py-8 text-lg dark:text-gray-50'
                                        >
                                            <strong>Get Started</strong>
                                        </Button>

                                    </motion.div>
                                </div>
                                <div className="relative flex items-end justify-center h-full">
                                    {/* Students Image */}
                                    <img
                                        className="relative md:w-[45vw] object-cover"
                                        src={'./student.png'}
                                        alt="Students"
                                    />
                                </div>
                            </div>


                        </div>
                    </section>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Why Choose Toto Academy?</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            We provide the best learning experience with cutting-edge technology and proven teaching methods.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="h-full bg-white dark:bg-gray-700 hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F7C23C]/10 dark:bg-[#F7C23C]/20 flex items-center justify-center text-[#F7C23C]">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{feature.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            {/* Popular Courses Section */}
            <section className='py-16 bg-white dark:bg-gray-900'>
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Our Popular Courses</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Explore our most sought-after courses designed to help you achieve your learning goals.
                        </p>
                    </div>

                    <Carousel className="mb-12">
                        <CarouselContent>
                            {[0, 3].map((startIndex) => (
                                <CarouselItem key={startIndex}>
                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                        {popularCourses.slice(startIndex, startIndex + 3).map((course) => (
                                            <motion.div
                                                key={course.id}
                                                whileHover={{ y: -5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                                                    <div className="relative aspect-video overflow-hidden">
                                                        <img
                                                            src={course.thumbnailUrl}
                                                            alt={course.title}
                                                            className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                                                        />
                                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                                            <span className="text-sm text-white bg-[#F7C23C] px-2 py-1 rounded">{course.level}</span>
                                                        </div>
                                                    </div>
                                                    <CardContent className="p-6">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h3 className="text-xl font-semibold line-clamp-2">{course.title}</h3>
                                                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                                                <Users className="w-4 h-4 mr-1" /> {course.students}
                                                            </span>
                                                        </div>
                                                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{course.description}</p>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                                                <Clock className="w-4 h-4 mr-1" /> {course.duration}
                                                            </span>
                                                            <Button
                                                                variant="outline"
                                                                className="border-[#002157] text-[#002157] dark:border-[#F7C23C] dark:text-[#F7C23C]"
                                                                onClick={() => navigate(`/courses/${course.id}`)}
                                                            >
                                                                View Details
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="mt-6 flex justify-center gap-4">
                            <CarouselPrevious className="relative top-0 left-0 translate-x-0 translate-y-0" />
                            <CarouselNext className="relative top-0 left-0 translate-x-0 translate-y-0" />
                        </div>
                    </Carousel>

                    <div className="text-center">
                        <Button
                            className="px-8 py-6 bg-[#002157] hover:bg-[#003182] rounded-lg text-lg dark:text-gray-50"
                            onClick={() => navigate('/courses')}
                        >
                            View All Courses
                            <ArrowRight className='w-5 h-5 ml-2' />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-[#002157] dark:bg-[#0a1a3a] text-white">
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2 text-[#F7C23C]">50+</div>
                            <div className="text-lg">Courses Available</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2 text-[#F7C23C]">10K+</div>
                            <div className="text-lg">Students Enrolled</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2 text-[#F7C23C]">100+</div>
                            <div className="text-lg">Expert Instructors</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <div className="text-4xl md:text-5xl font-bold mb-2 text-[#F7C23C]">95%</div>
                            <div className="text-lg">Satisfaction Rate</div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">What Our Students Say</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Hear from our community of learners who have transformed their skills with our courses.
                        </p>
                    </div>

                    <Carousel className="max-w-4xl mx-auto">
                        <CarouselContent>
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5 }}
                                        viewport={{ once: true }}
                                    >
                                        <Card className="bg-white dark:bg-gray-700 ">

                                            <div className=' animate-fade-in rounded-2xl p-2 bg-background grid grid-cols-4'>
                                                <div className=" aspect-square overflow-hidden rounded-lg">
                                                    <img
                                                        src={testimonial.avatar}
                                                        alt={testimonial.name}
                                                        className="object-cover w-full  h-full transition-transform duration-300 hover:scale-105 "
                                                    />

                                                </div>
                                                <CardContent className="pt-4 col-span-3">
                                                    <h1 className="font-semibold text-2xl mb-2 line-clamp-2">{testimonial.name}</h1>
                                                    <h3 className="text-sm">{testimonial.role}</h3>
                                                    <hr className='my-2' />
                                                    <p className='text-sm leading-6'>
                                                        {testimonial.content}
                                                    </p>
                                                    <div className='mt-2 flex gap-1'>
                                                        <motion.div
                                                            initial={{ opacity: .8, y: 4 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 1, }}>
                                                            <Star fill='#F7C23C' className="h-5 w-5 text-transparent" />
                                                        </motion.div>
                                                        <motion.div
                                                            initial={{ opacity: .8, y: 8 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 1, }}>
                                                            <Star fill='#F7C23C' className="h-5 w-5 text-transparent" />
                                                        </motion.div>
                                                        <motion.div
                                                            initial={{ opacity: .8, y: 12 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 1, }}>
                                                            <Star fill='#F7C23C' className="h-5 w-5 text-transparent" />
                                                        </motion.div>
                                                        <motion.div
                                                            initial={{ opacity: .8, y: 16 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 1, }}>
                                                            <Star fill='#F7C23C' className="h-5 w-5 text-transparent" />
                                                        </motion.div>
                                                        <motion.div
                                                            initial={{ opacity: .8, y: 20 }}
                                                            whileInView={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 1, }}>
                                                            <Star fill='#F7C23C' className="h-5 w-5 text-transparent" />
                                                        </motion.div>

                                                    </div>

                                                </CardContent>


                                            </div>
                                            {/* <div className="flex flex-col md:flex-row items-center gap-6">
                                                <img
                                                    src={testimonial.avatar}
                                                    alt={testimonial.name}
                                                    className="w-20 h-20 rounded-full object-cover border-4 border-[#F7C23C]"
                                                />
                                                <div className="text-center md:text-left">
                                                    <div className="flex items-center justify-center md:justify-start mb-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg key={i} className="w-5 h-5 text-[#F7C23C]" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <p className="text-lg italic mb-4 text-gray-700 dark:text-gray-300">"{testimonial.content}"</p>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800 dark:text-gray-100">{testimonial.name}</h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </Card>
                                    </motion.div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <div className="mt-6 flex justify-center gap-4">
                            <CarouselPrevious className="relative top-0 left-0 translate-x-0 translate-y-0" />
                            <CarouselNext className="relative top-0 left-0 translate-x-0 translate-y-0" />
                        </div>
                    </Carousel>
                </div>
            </section>

            {/* <section id='about' className="relative overflow-hidden">
                <div className="max-w-screen-xl mx-auto px-4 ">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
                        <div className='space-y-6 py-12 md:py-24'>
                            <motion.h1
                                className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-50 mb-14"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                About
                                <span className='text-[#F7C23C]'> Us</span> <br />
                            </motion.h1>
                            <motion.p
                                className='text-md leading-8 text-gray-600 dark:text-gray-300'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <strong>Toto Academy </strong>is an E-Learning Platform designed to make education more accessible through digital platforms. We offer structured learning via multimedia content combined with a community driven Q&A System for deeper understandings.
                                <br />
                            </motion.p>
                            <motion.p
                                className='text-md leading-8 text-gray-600 dark:text-gray-300'
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <strong>We are passionate about empowering learners Worldwide</strong> with high-quality, accessible & engaging education. Our mission is simple: Empower every student to learn, connect and succeed!


                            </motion.p>

                            <motion.div
                                className="flex flex-wrap gap-10 "
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <Button
                                    onClick={() => navigate('/about')}
                                    className='bg-[#002157] hover:bg-[#003182]  px-12 py-8 text-md dark:text-gray-50 mt-14'
                                >
                                    More About Us
                                    <ArrowRight className="h-5 w-5" />
                                </Button>
                                <Button
                                    onClick={() => navigate('/contact')}
                                    className='bg-[#002157] hover:bg-[#003182] rounded-full px-12 py-8 text-md dark:text-gray-50 mt-14'
                                >
                                    <strong>Contact Us</strong>
                                </Button>

                            </motion.div>
                        </div>
                        <div className="ml-32">
                            <div className="relative flex items-end justify-center h-full ">
                                {/* Yellow Circle Background */}
            {/* <motion.div
                                    initial={{ opacity: .8, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 1, }}
                                    className="absolute w-[34vw] h-[28.5vw] bg-toto-light-blue rounded-full">

                                </motion.div>

            Students Image 
            <img
                className="relative w-[45vw] object-cover"
                src={'./chillbro.png'}
                alt="bro"
            />
        </div>
                        </div >
                    </div >


                </div >
            </section > */}

            {/* <section id='testimonials' className='bg-white dark:bg-gray-900 py-20 bottom-1 shadow-inner '>
                <div className=" max-w-screen-xl  mx-auto">
                    <motion.div
                        initial={{ opacity: .8, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, }}>
                        <h1 className="mt-8 text-6xl font-bold text-center text-gray-800 dark:text-gray-100">
                            Testimonials
                        </h1>
                        <p className='mt-8 text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident odio suscipit eum a fugiat.</p>
                        <Carousel className='max-w-screen-md  mx-auto'>
                            <CarouselNext />
                            <CarouselPrevious />
                            <CarouselContent>
                                {popularCourses.map((course) =>

                                    <CarouselItem>
                                      
                                    </CarouselItem>
                                )}
                            </CarouselContent>
                        </Carousel>

                    </motion.div>


                </div>
            </section> */}










            {/* CTA Section */}
            <section className="py-16 bg-[#F7C23C] dark:bg-[#d9a82c]">
                <div className="max-w-screen-xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Ready to Start Learning?</h2>
                    <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
                        Join thousands of students advancing their careers with our courses.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            onClick={() => navigate('/register')}
                            className="bg-[#002157] hover:bg-[#003182] rounded-lg px-8 py-6 text-lg text-white"
                        >
                            <strong>Create Free Account</strong>
                        </Button>
                        <Button
                            onClick={() => navigate('/courses')}
                            variant="outline"
                            className="rounded-lg px-8 py-6 text-lg border-gray-800 text-gray-800 hover:bg-white/10"
                        >
                            Browse Courses
                        </Button>
                    </div>
                </div>
            </section>

            <section className="py-28 bg-white dark:bg-gray-900">
                <div className="max-w-screen-xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">Contact Us</h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                                Have questions? Our team is here to help you with any inquiries about our courses or platform.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-[#F7C23C]/10 dark:bg-[#F7C23C]/20 text-[#F7C23C]">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-100">Email Us</h4>
                                        <p className="text-gray-600 dark:text-gray-400">info@totoacademy.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-[#F7C23C]/10 dark:bg-[#F7C23C]/20 text-[#F7C23C]">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-100">Call Us</h4>
                                        <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-[#F7C23C]/10 dark:bg-[#F7C23C]/20 text-[#F7C23C]">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-gray-100">Visit Us</h4>
                                        <p className="text-gray-600 dark:text-gray-400">123 Education Street, Learning City, LC 12345</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <Card className="border border-gray-200 dark:border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-gray-800 dark:text-gray-100">Send Us a Message</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                                <Input id="name" placeholder="Your name" className="dark:bg-gray-800" />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                                <Input id="email" type="email" placeholder="Your email" className="dark:bg-gray-800" />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                                            <Input id="subject" placeholder="Subject" className="dark:bg-gray-800" />
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                            <Textarea id="message" placeholder="Your message" rows={4} className="dark:bg-gray-800" />
                                        </div>
                                        <Button type="submit" className="bg-[#002157] hover:bg-[#003182] w-full py-6 text-lg dark:text-gray-50">
                                            Send Message
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>


        </div >
    )
}

export default Homepage