import Sidebar from "@/components/Sidebar";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Resourcewalle() {
  const fileInputRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Update screen size state and handle sidebar visibility
  useEffect(() => {
    const checkScreenSize = () => {
      const isLarge = window.innerWidth >= 768;
      setIsLargeScreen(isLarge);
      setSidebarOpen(isLarge);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFileInput = (e) => {
    console.log(Array.from(e.target.files));
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-900 text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        {sidebarOpen && !isLargeScreen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        } transition-all duration-300 ease-in-out fixed md:relative z-40 md:z-auto w-64`}
      >
        <Sidebar />
      </div>

      {/* Backdrop Overlay for Mobile */}
      {sidebarOpen && !isLargeScreen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      <div className="bg-white w-full font-sans">
        {/* Header */}
        <div className="py-2 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">WALLET</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="p-2 rounded-full hover:bg-gray-100"
            ></button>
          </div>
        </div>

        {/* Balance Cards Row */}
        <div className="flex w-full mb-2 px-2">
          {/* Balance Card */}
          <div className="flex items-center p-2 mx-1 flex-1">
            <div className="bg-gray-800 p-2 rounded-md mr-2 flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="white" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
                <path d="M18 12a2 2 0 0 0 0 4h2v-4h-2z"></path>
              </svg>
            </div>
            <div>
              <p className="text-green-500 font-bold text-lg">$30000</p>
              <p className="text-sm text-gray-700">Balance</p>
            </div>
          </div>

          {/* Outstanding Card */}
          <div className="flex items-center p-2 mx-1 flex-1">
            <div className="bg-gray-200 p-2 rounded-md mr-2 w-10 h-10"></div>
            <div>
              <p className="text-red-600 font-bold text-lg">$1500</p>
              <p className="text-sm text-gray-700">Outstanding</p>
            </div>
          </div>

          {/* Deposit Card (Clickable) */}
          <div 
            className="flex items-center p-2 mx-1 flex-1 cursor-pointer hover:bg-gray-100 rounded-md transition" 
            onClick={() => alert("Deposit card clicked!")}
>
            <div className="bg-gray-200 p-2 rounded-md mr-2 w-10 h-10 flex items-center justify-center">
              <span className="text-lg">🗺️</span>
            </div>
            <div>
              <p className="text-slate-900 font-bold text-lg">$10000<sup className="text-green-500 text-xs"></sup></p>
              <p className="text-sm text-gray-700">Deposit</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex px-4 gap-4 mb-4">
          <div className="bg-gray-100 rounded-md h-16 w-1/3"></div>
          <div className="bg-gray-100 rounded-md h-16 w-1/3"></div>
          <div className="bg-gray-100 rounded-md h-16 w-1/3"></div>
        </div>

        {/* Two Column Layout */}
        <div className="flex flex-row px-4 gap-4">
          {/* Latest Transactions */}
          <div className="bg-gray-100 p-4 rounded-md w-7/12">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Latest Transactions</h2>
            <div className="mb-16">
              <p className="text-sm text-slate-700">Wed 30 Apr 2025</p>
              <div className="h-20"></div>
            </div>
            <div>
              <p className="text-sm text-slate-700">Tue 29 Apr 2025</p>
              <div className="h-20"></div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-5/12 flex flex-col gap-4">
            <div className="bg-gray-100 rounded-md h-44"></div>
            <div className="bg-gray-100 p-4 rounded-md">
              <h2 className="text-base font-semibold text-slate-900">Weekly Transaction Summary</h2>
              <div className="h-24"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resourcewalle;
