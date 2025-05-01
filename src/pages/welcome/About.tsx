import React from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, FileText, GraduationCap } from 'lucide-react';

const About = () => {

    const aboutData = 'Toto Academy is an E-Learning Platform designed to make education more accessible through digital platforms. We offer structured learning via multimedia content combined with a community driven Q&A System for deeper understandings.\n\n  We are passionate about empowering learners Worldwide with high-quality, accessible & engaging education. Our mission is simple: Empower every student to learn, connect and succeed! Toto Academy is an E-Learning Platform designed to make education more accessible through digital platforms. We offer structured learning via multimedia content combined with a community driven Q&A System for deeper understandings.\n\n  We are passionate about empowering learners Worldwide with high-quality, accessible & engaging education. Our mission is simple: Empower every student to learn, connect and succeed!'
    return (
        <div className="pt-16">
            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="relative overflow-hidden">

                    <div className="container mx-auto px-4">
                        <motion.div
                            className="max-w-4xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="text-center mb-12">
                                <motion.span
                                    className="inline-block text-sm md:text-base px-3 py-1  text-stone-800 mb-4"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    About Us
                                </motion.span>

                                <motion.h1
                                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                >
                                    Toto Academy
                                </motion.h1>


                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Biography Section */}
                <section className="py-16 bg-secondary/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
                                <motion.div
                                    className="md:col-span-2"
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <div className="aspect-square rounded-2xl overflow-hidden relative bg-muted">
                                        <img
                                            src="./illustrationhome.jpg"
                                            alt="image"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="md:col-span-3 space-y-6"
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    <p className="text-lg text-muted-foreground leading-relaxed">

                                    </p>

                                    <div className="space-y-4">
                                        {aboutData.split('\n\n').map((paragraph, index) => (
                                            <p key={index} className="text-muted-foreground leading-relaxed">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>


                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>



                {/* CTA Section */}
                <section className="py-20 bg-primary/5 relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 overflow-hidden opacity-50">
                        <div className="absolute hero-blur w-96 h-96 bg-primary rounded-full -top-20 -right-20"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <motion.div
                            className="max-w-4xl mx-auto text-center"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Interested in working together?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos labore tempore quaerat cum tempora?
                            </p>
                            <Button asChild size="lg" className="rounded-full text-base px-8">
                                <Link to="/contact" className="inline-flex items-center">
                                    Let's Connect
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default About