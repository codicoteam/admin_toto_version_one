import React from 'react'
import logo from "@/assets/logo2.png";
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CourseCard, { CourseCardProps } from '@/components/CourseCard';
import { CardContent } from '@/components/ui/card';
import { Carousel } from '@/components/ui/carousel';

const Homepage = () => {
    const navigate = useNavigate();

    const popularCourses = [
        {
            id: "1",
            title: "Mathematics",
            thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            students: 18,
        },
        {
            id: "2",
            title: "Computer Science",

            thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            students: 18,
        },
        {
            id: "3",
            title: "Geography",
            thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            students: 18,
        },
        {
            id: "3",
            title: "Accounting",
            thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            students: 18,
        },
        {
            id: "3",
            title: "Physics",

            thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",
            students: 18,
        },
        {
            id: "3",
            title: "English Language",
            thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80",

            students: 18,
        },

    ]


    return (
        <div className="">
            <section className="">
                <div className='sticky top-0 p-1 w-full backdrop-blur z-40'>
                    <div className=" max-w-screen-xl  mx-auto">
                        <div className='flex justify-between items-center'>
                            <img
                                className="w-24"
                                src={'./logo.png'}
                                alt="Students"
                            />

                            <div className='flex justify-between'>
                                <Button onClick={() => navigate('/login')} className='bg-transparent hover:bg-[#002157] rounded-none hover:text-white text-slate-950 p-5'>
                                    <p className=''>Login</p>
                                    <LogIn className='' />
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>
                <div className=" max-w-screen-xl  mx-auto">


                    <div className='grid-cols-2 grid h-full items-center min-h-screen  animate-fade-in'>
                        <div className='gap-8 '>
                            <h1 className="mt-8 text-6xl font-bold  text-gray-800">
                                Welcome to <br />
                                <span className='text-[#F7C23C]'>Toto Academy</span> <br />
                                E-Learning Platform
                            </h1>

                            <Button className='bg-[#002157] rounded-none p-8 my-16'>
                                <strong className='text-xl'>
                                    Get Started
                                </strong>
                            </Button>
                        </div>
                        <div className="relative flex items-end justify-center h-full">
                            {/* Yellow Circle Background */}
                            <div className="absolute w-[34vw] h-[28.5vw] bg-[#F7C23C] rounded-t-full"></div>

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


            <section className='bg-white py-20 bottom-1 shadow-inner '>
                <div className=" max-w-screen-xl  mx-auto">
                    <h1 className="mt-8 text-6xl font-bold text-center text-gray-800">
                        Our Popular Courses
                    </h1>

                    <div className='grid grid-cols-2 gap-4 my-16' >
                        {/* <Carousel> */}

                        {popularCourses.map((course) =>
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
                        {/* </Carousel> */}

                    </div>


                </div>
            </section>
        </div>
    )
}

export default Homepage