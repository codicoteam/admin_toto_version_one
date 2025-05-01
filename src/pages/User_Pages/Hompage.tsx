import React, { useEffect, useState } from "react";
import Navrbar from "@/components/Navbar";
import home from "@/assets/home1.png";

const Home_page = () => {
  return (
    <div className="w-full h-screen bg-zinc-200 flex  dark:bg-gray-900 flex-col justify-between relative overflow-hidden">
      {/* Nav bar */}
      <Navrbar />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-xl dark:bg-blue-600"></div>
      <div className="absolute top-40 right-20 w-40 h-40 bg-purple-400 rounded-full opacity-20 blur-xl dark:bg-purple-600"></div>
      <div className="absolute bottom-20 left-1/4 w-52 h-52 bg-indigo-400 rounded-full opacity-20 blur-xl dark:bg-indigo-600"></div>

      {/* Slanted Blue Background - moved BEFORE content so it appears behind */}
      <div className="absolute bottom-0 left-0 right-0 z-0 overflow-hidden">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          <path
            fill="#0A2463"
            d="M0,160 L1440,0 L1440,320 L0,320 Z"
            className="transform-gpu"
          ></path>
        </svg>
      </div>

      <div className="grid md:grid-cols-2 max-w-[1240px] m-auto relative z-10">
        <div className="flex flex-col justify-center md:items-start w-full px-2 py-8">
          <p className="text-6xl font-semibold text-black mt-16">Welcome To</p>
          <h1 className="py-3 text-7xl md:text-7xl font-bold text-blue-950">
            Toto Academy
          </h1>
          <p className="text-6xl font-semibold mb-20">E-Learing Platform</p>
          <div>
            <button className="mt-3 py-2 px-4 text-white mr-16 bg-blue-950 rounded-full">
              Subscribe
            </button>
            <button className="mt-3 py-2 px-4 text-blue-950 border-2 border-blue-950  bg-transparent rounded-full">
              View Profile
            </button>
            <h1 className="mt-20 text-xl md:text-2xl font-bold text-white dark:text-white ">
              Empowering Minds, One Course at a Time
            </h1>
          </div>
        </div>

        <div className="relative z-10 animate-float">
          <img className="w-full" src={home} alt="Home illustration" />
        </div>

        {/* Add floating animation keyframes */}
        <style>{`
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Home_page;
