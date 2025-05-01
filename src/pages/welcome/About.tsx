import React from 'react';
import { Users, BookOpen, Award, Globe, GraduationCap, Lightbulb, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const About = () => {
    const navigate = useNavigate();

    const stats = [
        { value: '10,000+', label: 'Students Enrolled', icon: <Users className="w-8 h-8" /> },
        { value: '100+', label: 'Courses Available', icon: <BookOpen className="w-8 h-8" /> },
        { value: '95%', label: 'Satisfaction Rate', icon: <Award className="w-8 h-8" /> },
        { value: '50+', label: 'Countries Worldwide', icon: <Globe className="w-8 h-8" /> }
    ];

    const values = [
        {
            icon: <GraduationCap className="w-8 h-8 text-[#F7C23C]" />,
            title: "Excellence in Education",
            description: "We maintain the highest standards for all our courses and learning materials."
        },
        {
            icon: <Lightbulb className="w-8 h-8 text-[#F7C23C]" />,
            title: "Innovative Learning",
            description: "We constantly evolve our teaching methods to incorporate the latest educational technologies."
        },
        {
            icon: <Users className="w-8 h-8 text-[#F7C23C]" />,
            title: "Community Focus",
            description: "We believe learning happens best in a supportive, engaged community environment."
        },
        {
            icon: <Shield className="w-8 h-8 text-[#F7C23C]" />,
            title: "Accessibility",
            description: "We're committed to making quality education available to everyone, everywhere."
        }
    ];

    const team = [
        {
            name: "Dr. Sarah Johnson",
            role: "Founder & CEO",
            bio: "Education pioneer with 15+ years experience in curriculum development",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
        },
        {
            name: "Michael Chen",
            role: "CTO",
            bio: "Tech innovator specializing in educational platforms",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
        },
        {
            name: "Emma Rodriguez",
            role: "Head of Instruction",
            bio: "Award-winning educator with a passion for student success",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
        },
        {
            name: "David Kim",
            role: "Student Success",
            bio: "Dedicated to ensuring every learner achieves their goals",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Hero Section */}
            <section className="relative bg-[#002157] dark:bg-[#0a1a3a] text-white pt-32">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="md:w-1/2 space-y-6">
                            <motion.h1
                                className="text-4xl md:text-5xl font-bold"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8 }}
                            >
                                About <span className="text-[#F7C23C]">Toto Academy</span>
                            </motion.h1>
                            <motion.p
                                className="text-xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                Transforming education through innovative technology and proven teaching methodologies.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <Button
                                    onClick={() => navigate('/courses')}
                                    className="bg-[#F7C23C] hover:bg-[#d9a82c] text-gray-900 px-8 py-6 text-lg"
                                >
                                    Explore Our Courses
                                </Button>
                            </motion.div>
                        </div>
                        <div className="md:w-1/2">
                            <motion.img
                                src="./students.png"
                                alt="Students learning together"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Our Story
                        </h2>
                        <div className="w-24 h-1 bg-[#F7C23C] mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <motion.img
                                src="./chillbro.png"
                                alt="Founder of Toto Academy"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                            />
                        </div>
                        <div className="space-y-6">
                            <motion.h3
                                className="text-2xl font-bold text-gray-800 dark:text-gray-100"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                viewport={{ once: true }}
                            >
                                Founded in 2015 with a vision to democratize education
                            </motion.h3>
                            <motion.p
                                className="text-gray-600 dark:text-gray-300"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                viewport={{ once: true }}
                            >
                                Toto academy is an innovative e-learning wb application designed to make quality education more accessible to students through digital platforms.
                                a multimedia content—including videos, audio lessons, and detailed text explanations—combined with interactive quizzes and a community-driven Q&A system for deeper engagement.
                                
Unlike traditional e-learning apps, Toto Academy integrates a wallet-based subscription model, allowing students to manage their course enrollments flexibly and affordably. Built with a mobile-first, scalable design, Toto Academy focuses on delivering fast, user-friendly access to educational resources while fostering collaboration among learners.
                                
This MVP (Minimum Viable Product) aims to validate the core experience:
Smooth student registration and subscription
                                Access to rich multimedia lessons
                                Active student interaction through quizzes and Q&A
                                Secure, wallet-driven payment system
                                
                                Our mission is simple: Empower every student to learn, connect, and succeed — anytime, anywhere.
                            </motion.p>
                                                            <motion.p
                                className="text-gray-600 dark:text-gray-300"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                viewport={{ once: true }}
                            >
                                Our mission is simple: to make high-quality education accessible, affordable, and engaging for everyone, regardless of their location or background.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                viewport={{ once: true }}
                            >
                                <Button
                                    onClick={() => navigate('/contact')}
                                    variant="outline"
                                    className="border-[#002157] text-[#002157] dark:border-[#F7C23C] dark:text-[#F7C23C] px-8 py-6 text-lg"
                                >
                                    Learn More About Our Mission
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="text-[#002157] dark:text-[#F7C23C] mb-4 flex justify-center">
                                    {stat.icon}
                                </div>
                                <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                    {stat.value}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Our Core Values
                        </h2>
                        <div className="w-24 h-1 bg-[#F7C23C] mx-auto"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow hover:shadow-lg transition-shadow"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="mb-4">
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            {/* <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                            Meet Our Team
                        </h2>
                        <div className="w-24 h-1 bg-[#F7C23C] mx-auto"></div>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-4">
                            Passionate educators and innovators dedicated to your success
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                className="bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                        {member.name}
                                    </h3>
                                    <p className="text-[#002157] dark:text-[#F7C23C] mb-2">
                                        {member.role}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {member.bio}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* CTA Section */}
            <section className="py-16 bg-[#F7C23C] dark:bg-[#d9a82c]">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Ready to start your learning journey?
                    </h2>
                    <p className="text-xl text-gray-800 mb-8">
                        Join thousands of students achieving their goals with Toto Academy
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            onClick={() => navigate('/register')}
                            className="bg-[#002157] hover:bg-[#003182] rounded-lg px-8 py-6 text-lg text-white"
                        >
                            Create Free Account
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
        </div>
    );
};

export default About;