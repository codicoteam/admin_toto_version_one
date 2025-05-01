import React from "react";
import Navrbar from "@/components/Navbar";
import home from "@/assets/home1.png";

const Aboutpage = () => {
  return (
    <div className="w-full h-screen bg-zinc-200 flex  dark:bg-gray-900 flex-col justify-between relative overflow-hidden">
      <Navrbar />
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-xl dark:bg-blue-600"></div>
      <div className="absolute top-40 right-20 w-40 h-40 bg-purple-400 rounded-full opacity-20 blur-xl dark:bg-purple-600"></div>
      <div className="absolute bottom-20 left-1/4 w-52 h-52 bg-indigo-400 rounded-full opacity-20 blur-xl dark:bg-indigo-600"></div>
      {/* Wave Background */}
      <div className="absolute bottom-0 left-0 right-0 z-0 overflow-hidden">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          <path
            fill="#3B82F6"
            fillOpacity="0.2"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,229.3C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          <path
            fill="#1E3A8A"
            fillOpacity="0.3"
            d="M0,256L48,261.3C96,267,192,277,288,282.7C384,288,480,288,576,256C672,224,768,160,864,138.7C960,117,1056,139,1152,160C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
      {/* Slanted Blue Background - moved BEFORE content so it appears behind
      <div className="absolute bottom-0 left-0 right-0 z-0 overflow-hidden">
        <svg
          className="w-full h-auto blur-sm"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ display: "block" }}
        >
          <path
            fill="#9CA3AF"
            d="M0,160 L1440,0 L1440,320 L0,320 Z"
            className="transform-gpu"
          ></path>
        </svg>
      </div> */}

      <div className="grid md:grid-cols-2 max-w-[1240px] m-auto relative z-10">
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            About <span className="text-blue-600">Toto Academy</span>
          </h1>

          <div className="w-20 h-1 bg-blue-600"></div>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Toto Academy is an E-Learning Platform designed to make education
            more accessible through digital platforms. We offer structured
            learning via multimedia content combined with a community driven Q&A
            System for deeper understandings.
          </p>

          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            We are passionate about empowering learners Worldwide with
            high-quality, accessible & engaging education. Our mission is
            simple: Empower every student to learn, connect and succeed!
          </p>
          <div className="mt-8">
            <button className="py-3 px-10 text-white font-medium bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a1 1 0 01-1.4 1.287l-5-1.5a1 1 0 01-.043-1.91L14.243 5.757z"
                  clipRule="evenodd"
                />
              </svg>
              Contact Us
            </button>
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

export default Aboutpage;
