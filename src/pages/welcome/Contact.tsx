
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
    Mail,
    MessageSquare,
    Phone,
    MapPin,
    Github,
    Linkedin,
    Twitter,
    Send,
    User,
    AtSign,
    FileText,
    Instagram,
} from "lucide-react";

const Contact: React.FC = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);


        try {
            // emailjs
            //     .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData, {
            //         publicKey: 'YOUR_PUBLIC_KEY',
            //     })
            //     .then(
            //         () => {
            //             toast({
            //                 title: "Message sent!",
            //                 description: "Thank you for your message. I'll get back to you soon.",
            //             });
            //         },
            //         (error) => {
            //             toast({
            //                 title: "Message not sent!",
            //                 description: " Please Retry later",
            //             });
            //             console.log('FAILED...', error.text);
            //         },
            //     );
            throw new Error("Error yaitika");



        } catch (error) {
            toast({
                title: "Message not sent!",
                description: " Please Retry later",
            });
        }


        setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
        });

        setIsSubmitting(false);
    };

    const contactInfo = {
        email: 'toto@eachMonthOfInterval.com',
        phone: '0772772772',
        location: 'Zimbabwe, Harare',
        socials: {
            twitter: 'x.com/toto-academy'
        }

    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-20 relative overflow-hidden">


                <div className="container mx-auto px-4">
                    <motion.div
                        className="max-w-4xl mx-auto text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >


                        <motion.h1
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            Contact Us Today
                        </motion.h1>

                        <motion.p
                            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >

                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16 bg-secondary/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                            {/* Contact Info */}
                            <motion.div
                                className="lg:col-span-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <div className="bg-background rounded-xl p-8 border border-border shadow-sm h-full">
                                    <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

                                    <div className="space-y-6">
                                        <div className="flex items-start">
                                            <div className="bg-primary/10 rounded-full p-3 mr-4">
                                                <Mail className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                                                <a href={`mailto:${contactInfo.email}`} className="text-foreground hover:text-primary transition-colors">
                                                    {contactInfo.email}
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="bg-primary/10 rounded-full p-3 mr-4">
                                                <Phone className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Phone</h3>
                                                <a href={`tel:${contactInfo.phone}`} className="text-foreground hover:text-primary transition-colors">
                                                    {contactInfo.phone}
                                                </a>
                                            </div>
                                        </div>


                                        <div className="flex items-start">
                                            <div className="bg-primary/10 rounded-full p-3 mr-4">
                                                <MapPin className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
                                                <p className="text-foreground">{contactInfo.location}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <h3 className="text-lg font-semibold mb-4">Connect with Us</h3>
                                        <div className="flex space-x-4">

                                            <a
                                                href={contactInfo.socials.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full p-3 transition-colors"
                                            >
                                                <Twitter className="h-5 w-5" />
                                            </a>
                                            <a
                                                href={contactInfo.socials.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full p-3 transition-colors"
                                            >
                                                <Instagram className="h-5 w-5" />
                                            </a>
                                        </div>
                                    </div>


                                </div>
                            </motion.div>

                            {/* Contact Form */}
                            <motion.div
                                className="lg:col-span-3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <div className="bg-background rounded-xl p-8 border border-border shadow-sm h-full">
                                    <h2 className="text-2xl font-bold mb-6">Send me a message</h2>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium flex items-center">
                                                    <User className="h-4 w-4 mr-2" />
                                                    Your Name
                                                </label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium flex items-center">
                                                    <AtSign className="h-4 w-4 mr-2" />
                                                    Your Email
                                                </label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="john@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium flex items-center">
                                                <MessageSquare className="h-4 w-4 mr-2" />
                                                Subject
                                            </label>
                                            <Input
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                placeholder="Project Inquiry"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium flex items-center">
                                                <Mail className="h-4 w-4 mr-2" />
                                                Your Message
                                            </label>
                                            <Textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="Tell me about your project, idea, or question..."
                                                rows={6}
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full md:w-auto rounded-full"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <motion.div
                                                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full mr-2"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                                    />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="mr-2 h-4 w-4" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
