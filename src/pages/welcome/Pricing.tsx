import React from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing = () => {
    const navigate = useNavigate();
    return (
        <div className="">
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
                                </motion.span>

                                <motion.h1
                                    className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                >
                                    Pricing
                                </motion.h1>
                                <motion.p
                                    className="text-xs md:text-sm font-normal mb-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                >
                                    How Our Pricing Works
                                </motion.p>

                                <ol className="space-y-8 my-16">
                                    <li className="flex items-start">
                                        <span className="bg-toto-light-blue w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">1</span>
                                        <div className=''>
                                            <h3 className="font-bold text-xl mb-2">Suggested Price Range</h3>
                                            <p className="text-gray-700">
                                                Our system calculates a suggested price range based on distance, time of day, and current demand – giving you a baseline for negotiations.
                                            </p>
                                        </div>
                                    </li>

                                    <li className="flex items-start">
                                        <span className="bg-toto-light-blue w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">2</span>
                                        <div>
                                            <h3 className="font-bold text-xl mb-2">Make Your Offer</h3>
                                            <p className="text-gray-700">
                                                As a passenger, you can make an offer within or outside this range. Drivers can see your offer and decide to accept or counter.
                                            </p>
                                        </div>
                                    </li>

                                    <li className="flex items-start">
                                        <span className="bg-toto-light-blue w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">3</span>
                                        <div>
                                            <h3 className="font-bold text-xl mb-2">Direct Negotiation</h3>
                                            <p className="text-gray-700">
                                                Passengers and drivers can negotiate directly until they reach a mutually agreeable price – no algorithms deciding for you.
                                            </p>
                                        </div>
                                    </li>

                                    <li className="flex items-start">
                                        <span className="bg-toto-light-blue w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">4</span>
                                        <div>
                                            <h3 className="font-bold text-xl mb-2">Transparent Fee Structure</h3>
                                            <p className="text-gray-700">
                                                ClearTaxGo takes a small, transparent service fee from each transaction – typically lower than our competitors.
                                            </p>
                                        </div>
                                    </li>
                                </ol>






                            </div>
                        </motion.div>
                    </div>
                </section>
                <section className='bg-white dark:bg-gray-900 py-20 bottom-1 shadow-inner '>
                    <motion.h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-28"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        Choose Your Plan
                    </motion.h1>

                    <div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
                            <div className="bg-background p-6 border-b">
                                <h3 className="text-2xl font-bold text-center">Standard</h3>
                                <div className="flex justify-center items-center mt-4">
                                    <span className="text-4xl font-bold">Free</span>
                                </div>
                            </div>
                            <div className="p-6 bg-white dark:bg-background ">
                                <ul className="space-y-4">
                                    <li className="flex items-center">
                                        <CheckCircle size={20} className="text-neon mr-2" />
                                        <span>Direct price negotiation</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle size={20} className="text-neon mr-2" />
                                        <span>Basic ride features</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle size={20} className="text-neon mr-2" />
                                        <span>Standard customer support</span>
                                    </li>
                                    <li className="flex items-center">
                                        <XCircle size={20} className="text-gray-400 mr-2" />
                                        <span className="text-gray-500">Priority matching</span>
                                    </li>
                                    <li className="flex items-center">
                                        <XCircle size={20} className="text-gray-400 mr-2" />
                                        <span className="text-gray-500">Loyalty rewards</span>
                                    </li>
                                </ul>
                                <button onClick={() => navigate('/dashboard')} className="mt-6 w-full py-3 px-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
                                    Get Started
                                </button>
                            </div>
                        </motion.div>


                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-white border-2 border-toto-orange rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 relative">
                            <div className="absolute top-4 right-4">
                                <span className="bg-toto-light-orange dark:text-slate-900 px-3 py-1 rounded-full text-sm font-bold">Popular</span>
                            </div>
                            <div className="bg-gray-900 text-white p-6 ">
                                <h3 className="text-2xl font-bold text-center">Premium</h3>
                                <div className="flex justify-center items-center mt-4">
                                    <span className="text-4xl font-bold">$9.99</span>
                                    <span className="ml-1 text-gray-300">/month</span>
                                </div>
                            </div>
                            <div className="p-6 bg-white dark:bg-background  ">
                                <ul className="space-y-4">
                                    <li className="flex items-center">
                                        <CheckCircle size={20} className="text-neon mr-2" />
                                        <span>Direct price negotiation</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle size={20} className="text-neon mr-2" />
                                        <span>Advanced ride features</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle size={20} className="text-neon mr-2" />
                                        <span>Priority customer support</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle size={20} className="text-neon mr-2" />
                                        <span>Priority matching with drivers</span>
                                    </li>
                                    <li className="flex items-center">
                                        <CheckCircle size={20} className="text-neon mr-2" />
                                        <span>Loyalty rewards and discounts</span>
                                    </li>
                                </ul>
                                <button className="mt-6 w-full py-3 px-4 bg-neon  rounded-full hover:bg-toto-orange/90 transition-colors">
                                    Get Premium
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className='my-36'>
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>

                    <div className="max-w-3xl mx-auto space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-xl mb-2">Are there any hidden fees?</h3>
                            <p className="text-gray-700">
                                No, we believe in full transparency. The price you agree on with your driver is what you'll pay, plus a small service fee that is clearly shown before you confirm your ride.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-xl mb-2">What if I can't agree on a price with any driver?</h3>
                            <p className="text-gray-700">
                                Our suggested price range is based on current market conditions and is designed to be fair to both parties. Most rides are matched quickly, but you can always adjust your offer if needed.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            whileInView={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-xl mb-2">How does the Premium subscription work?</h3>
                            <p className="text-gray-700">
                                Premium subscribers enjoy additional benefits like priority matching with drivers, dedicated customer support, and loyalty rewards that can be redeemed for discounts on future rides.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            whileInView={{ opacity: 1, y: 0 }} className="bg-white rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-xl mb-2">Can I cancel a ride after agreeing on a price?</h3>
                            <p className="text-gray-700">
                                Yes, you can cancel a ride, but cancellation fees may apply depending on how close to the pickup time you cancel. The fee structure is clearly shown in the app before you confirm cancellation.
                            </p>
                        </motion.div>
                    </div>
                </section>
            </div >
        </div >
    )
}

export default Pricing