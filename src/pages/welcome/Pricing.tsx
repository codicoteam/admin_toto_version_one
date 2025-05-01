import React from 'react';
import { Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

const Pricing = () => {
    const navigate = useNavigate();

    const pricingPlans = [
        {
            name: "Free",
            price: "$0",
            duration: "forever",
            description: "Perfect for getting started with basic learning",
            features: [
                "Access to 5 basic courses",
                "Community support",
                "Limited quizzes",
                "Basic progress tracking",
                "Email notifications"
            ],
            cta: "Get Started",
            popular: false,
            color: "bg-gray-100 dark:bg-gray-800"
        },
        {
            name: "Basic",
            price: "$9",
            duration: "per month",
            description: "Great for regular learners who want more content",
            features: [
                "Access to 20+ courses",
                "Priority support",
                "Unlimited quizzes",
                "Advanced progress tracking",
                "Downloadable resources",
                "Email & chat support"
            ],
            cta: "Start Learning",
            popular: false,
            color: "bg-blue-50 dark:bg-blue-900/30"
        },
        {
            name: "Pro",
            price: "$29",
            duration: "per month",
            description: "For serious learners who want full access",
            features: [
                "Access to all 100+ courses",
                "24/7 priority support",
                "Certificates of completion",
                "Personalized learning paths",
                "Offline access",
                "Exclusive webinars",
                "Monthly coaching session"
            ],
            cta: "Go Pro",
            popular: true,
            color: "bg-[#002157]/10 dark:bg-[#002157]/20"
        },
        {
            name: "Enterprise",
            price: "Custom",
            duration: "",
            description: "Tailored solutions for organizations and schools",
            features: [
                "Unlimited access for teams",
                "Dedicated account manager",
                "Custom learning paths",
                "Advanced analytics",
                "API access",
                "Single sign-on (SSO)",
                "Custom certifications",
                "On-site training available"
            ],
            cta: "Contact Sales",
            popular: false,
            color: "bg-purple-50 dark:bg-purple-900/30"
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 py-20">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                    Simple, transparent pricing
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Choose the perfect plan for your learning journey. Start for free, upgrade anytime.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {pricingPlans.map((plan, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 * index }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: .6 }}
                            viewport={{ once: true }}
                            key={index}
                            className={`relative rounded-2xl h-full p-6 shadow-lg hover:scale-105 transition-all hover:shadow-xl flex-col ${plan.color} ${plan.popular ? "ring-2 ring-[#F7C23C]" : ""}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#F7C23C] text-gray-900 px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                                    <Star className="w-4 h-4 mr-1" />
                                    Most Popular
                                </div>
                            )}

                            <div className="text-center pt-2">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                                    {plan.name}
                                </h3>
                                <div className="flex items-center justify-center mb-2">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                        {plan.price}
                                    </span>
                                    {plan.duration && (
                                        <span className="text-gray-600 dark:text-gray-300 ml-1">
                                            /{plan.duration}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                                    {plan.description}
                                </p>
                            </div>
                            <hr />
                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                onClick={() => plan.name === "Enterprise" ? navigate('/contact') : navigate('/register')}
                                className={`w-full mt-auto py-6 text-lg ${plan.popular ? "bg-[#F7C23C] hover:bg-[#d9a82c] text-gray-900" : "bg-[#002157] hover:bg-[#003182] text-white"}`}
                            >
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto px-4 pb-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    {[
                        {
                            question: "Can I switch plans later?",
                            answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated based on your current billing cycle."
                        },
                        {
                            question: "Do you offer discounts for students?",
                            answer: "Absolutely! We offer a 50% discount for verified students. Contact our support team with your student ID to get your discount."
                        },
                        {
                            question: "Is there a free trial for paid plans?",
                            answer: "Yes, all paid plans come with a 14-day free trial. You can cancel anytime during the trial period without being charged."
                        },
                        {
                            question: "How does the Enterprise plan work?",
                            answer: "Our Enterprise plan is customized for each organization. We'll work with you to create the perfect solution for your team's learning needs."
                        },
                        {
                            question: "What payment methods do you accept?",
                            answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans. Enterprise plans can also be paid via invoice."
                        }
                    ].map((faq, index) => (
                        <motion.div
                            initial={{ opacity: 0, y: 10 * index }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: .6 }} key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                                {faq.question}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {faq.answer}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-[#F7C23C] dark:bg-[#d9a82c] py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Still have questions?
                    </h2>
                    <p className="text-xl text-gray-800 mb-8">
                        Our team is happy to help you choose the right plan for your needs.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            onClick={() => navigate('/contact')}
                            className="bg-[#002157] hover:bg-[#003182] rounded-lg px-8 py-6 text-lg text-white"
                        >
                            Contact Support
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
            </div>
        </div>
    );
};

export default Pricing;