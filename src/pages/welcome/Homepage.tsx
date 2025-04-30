import React, { useEffect, useState } from 'react'
import logo from "@/assets/logo2.png";
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowRightCircle, ArrowRightFromLine, ExternalLink, Facebook, Instagram, LogIn, Mail, Moon, Star, Sun } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CourseCard, { CourseCardProps } from '@/components/CourseCard';
import { CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from '@/hooks/use-toast';

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


    return (
        <div className="">
            <section className="">

                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="hero-blur w-96 h-96 bg-blue-500 rounded-full -top-20 -right-20"></div>
                    <div className="hero-blur w-96 h-96 bg-purple-500 rounded-full bottom-10 -left-20"></div>
                </div>
                <div className=" max-w-screen-xl  mx-auto">


                    <section className="relative overflow-hidden">
                        <div className="max-w-screen-xl mx-auto px-4 ">
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-12 items-center'>
                                <div className='space-y-16 py-12 md:py-24'>
                                    <motion.h1
                                        className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-gray-50"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8 }}
                                    >
                                        Welcome to <br />
                                        <span className='text-[#F7C23C]'>Toto Academy</span> <br />
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
                                        className="flex flex-wrap gap-4"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.4 }}
                                    >
                                        <Button
                                            onClick={() => navigate('/register')}
                                            className='bg-[#002157] hover:bg-[#003182] rounded-none px-12 py-8 text-lg dark:text-gray-50'
                                        >
                                            <strong>Get Started</strong>
                                        </Button>

                                    </motion.div>
                                </div>
                                <div className="relative flex items-end justify-center h-full">
                                    {/* Yellow Circle Background */}
                                    <motion.div
                                        initial={{ opacity: .8, y: 400 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1, }}
                                        className="absolute w-[34vw] h-[28.5vw] bg-[#F7C23C] rounded-t-full">

                                    </motion.div>

                                    {/* Students Image */}
                                    <img
                                        className="relative w-[45vw] object-cover"
                                        src={'./students.png'}
                                        alt="Students"
                                    />
                                </div>
                            </div>


                        </div>
                    </section>
                </div>
            </section>


            <section className='bg-white dark:bg-gray-900 py-20 bottom-1 shadow-inner '>
                <div className=" max-w-screen-xl  mx-auto">
                    <motion.div
                        initial={{ opacity: .8, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, }}>
                        <h1 className="mt-8 text-6xl font-bold text-center text-gray-800 dark:text-gray-100">
                            Our Popular Courses
                        </h1>
                        <p className='mt-8 text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident odio suscipit eum a fugiat.</p>

                        <Carousel className='max-w-screen-lg  mx-auto'>
                            <CarouselNext />
                            <CarouselPrevious />
                            <CarouselContent>
                                <CarouselItem>
                                    <div className='grid grid-cols-3 gap-4 my-16' >

                                        {popularCourses.slice(0, 3).map((course) =>
                                            <div key={course.id} className=' animate-fade-in rounded-2xl p-2 bg-background'>
                                                <div className="aspect-s relative overflow-hidden rounded-lg">
                                                    <img
                                                        src={course.thumbnailUrl}
                                                        alt={course.title}
                                                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105 "
                                                    />

                                                </div>
                                                <CardContent className="pt-4">
                                                    <h1 className="font-semibold text-2xl mb-2 line-clamp-2">{course.title}</h1>
                                                    <h3 className="text-sm">Students Enrolled : {course.students}</h3>
                                                </CardContent>

                                            </div>
                                        )}

                                    </div>
                                </CarouselItem>
                                <CarouselItem>
                                    <div className='grid grid-cols-3 gap-4 my-16' >

                                        {popularCourses.slice(3, 6).map((course) =>
                                            <div key={course.id} className=' animate-fade-in rounded-2xl p-2 bg-background'>
                                                <div className="aspect-s relative overflow-hidden rounded-lg">
                                                    <img
                                                        src={course.thumbnailUrl}
                                                        alt={course.title}
                                                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105 "
                                                    />

                                                </div>
                                                <CardContent className="pt-4">
                                                    <h1 className="font-semibold text-2xl mb-2 line-clamp-2">{course.title}</h1>
                                                    <h3 className="text-sm">Students Enrolled : {course.students}</h3>
                                                </CardContent>

                                            </div>
                                        )}

                                    </div>
                                </CarouselItem>
                            </CarouselContent>
                        </Carousel>

                    </motion.div>
                    <motion.div
                        initial={{ opacity: .8, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, }}
                        className='flex justify-center'

                    >
                        <Button className='p-8 py-4 my-6 bg-[#002157] rounded-full dark:text-gray-50 mx-auto' onClick={() => navigate('/courses')}>
                            View Coursers
                            <ArrowRight className='size-12' />
                        </Button>
                    </motion.div>

                </div>
            </section>


            <section id='about' className="relative overflow-hidden">
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

                                </motion.div> */}

                                {/* Students Image */}
                                <img
                                    className="relative w-[45vw] object-cover"
                                    src={'./chillbro.png'}
                                    alt="bro"
                                />
                            </div>
                        </div>
                    </div>


                </div>
            </section>

            <section id='testimonials' className='bg-white dark:bg-gray-900 py-20 bottom-1 shadow-inner '>
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
                                        <div className=' my-16' >

                                            <div key={course.id} className=' animate-fade-in rounded-2xl p-2 bg-background grid grid-cols-2'>
                                                <div className="     relative overflow-hidden rounded-lg">
                                                    <img
                                                        src={course.thumbnailUrl}
                                                        alt={course.title}
                                                        className="object-cover w-full h-full transition-transform duration-300 hover:scale-105 "
                                                    />

                                                </div>
                                                <CardContent className="pt-4">
                                                    <h1 className="font-semibold text-2xl mb-2 line-clamp-2">{course.title}</h1>
                                                    <h3 className="text-sm">Student</h3>
                                                    <hr className='my-2' />
                                                    <p className='text-sm leading-6'>
                                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit earum nam aspernatur, reiciendis
                                                        exercitationem molestias odit ipsa, ratione perferendis deleniti temporibus necessitatibus sapiente
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

                                        </div>
                                    </CarouselItem>
                                )}
                            </CarouselContent>
                        </Carousel>

                    </motion.div>


                </div>
            </section>


        </div>
    )
}

export default Homepage