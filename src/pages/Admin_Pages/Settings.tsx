import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";

const SettingsPage = () => {
  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [language, setLanguage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Communication preferences
  const [optOutAll, setOptOutAll] = useState(false);
  const [weeklyRecommendations, setWeeklyRecommendations] = useState(true);
  const [promotionNotifications, setPromotionNotifications] = useState(true);
  const [surveyNotifications, setSurveyNotifications] = useState(true);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Account form handler
  const handleAccountSubmit = () => {
    console.log("Account settings saved");
  };

  // Password change handler
  const handlePasswordChange = () => {
    console.log("Password changed");
  };

  // Communication preferences handler
  const handleCommunicationSubmit = () => {
    console.log("Communication preferences saved");
  };

  // Log out all devices handler
  const handleLogoutAllDevices = () => {
    console.log("Logged out from all devices");
  };

  // Delete account handler
  const handleDeleteAccount = () => {
    console.log("Account deleted");
  };

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Update screen size state and handle sidebar visibility
  useEffect(() => {
    // Check initial screen size
    const checkScreenSize = () => {
      const isLarge = window.innerWidth >= 768;
      setIsLargeScreen(isLarge);
      setSidebarOpen(isLarge);
    };

    // Run on initial load
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-900 text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        {sidebarOpen && !isLargeScreen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar - Mobile: overlay, Desktop: static */}
      <div
        className={`
          ${
            sidebarOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          } 
          transition-all duration-300 ease-in-out 
          fixed md:relative z-40 md:z-auto w-64
        `}
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

      {/* Main Content */}
      <div className="flex-1 w-full">
        <div className="w-full min-h-screen p-4 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-blue-900">SETTINGS</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Account Settings */}
              <div className="bg-gray-100 p-6 rounded-md shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Language
                    </label>
                    <input
                      type="text"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <button
                      onClick={handleAccountSubmit}
                      className="bg-blue-900 text-white py-2 px-4 rounded text-sm"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Change */}
              <div className="bg-gray-100 p-6 rounded-md shadow-sm">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div>
                    <button
                      onClick={handlePasswordChange}
                      className="bg-blue-900 text-white py-2 px-4 rounded text-sm"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Connected Devices */}
              <div className="bg-gray-100 p-6 rounded-md shadow-sm">
                <h2 className="text-lg font-medium mb-2">Connected Devices</h2>
                <p className="text-sm mb-4">
                  If your account has been logged into on multiple devices, you
                  can log out here.
                </p>
                <button
                  onClick={handleLogoutAllDevices}
                  className="bg-blue-900 text-white py-2 px-4 rounded text-sm"
                >
                  Log out from all devices
                </button>
              </div>

              {/* Name Verification */}
              <div className="bg-white p-6 rounded-md shadow-sm">
                <h2 className="text-lg font-medium mb-2">Name Verification</h2>
                <p className="text-sm mb-4">
                  Verify your real name to make sure you're able to receive a
                  certificate when you complete a course.
                </p>
                <button className="bg-blue-900 text-white py-2 px-4 rounded text-sm">
                  Verify My Name
                </button>
              </div>

              {/* Delete Account */}
              <div className="bg-gray-100 p-6 rounded-md shadow-sm">
                <h2 className="text-lg font-medium mb-2">Delete Account</h2>
                <p className="text-sm mb-4">
                  If you delete your account, your personal information will be
                  wiped from Toto Academy's servers, all of your course activity
                  will be anonymized and any certificates will be deleted.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white py-2 px-4 rounded text-sm"
                >
                  Delete Account
                </button>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Display Settings */}
              <div className="bg-white p-6 rounded-md shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Display Settings</h2>
                {/* Display settings content will be added in the future */}
              </div>

              {/* Communication Preferences */}
              <div className="bg-white p-6 rounded-md shadow-sm">
                <h2 className="text-xl font-semibold mb-4">
                  Communication Preferences
                </h2>
                <div className="space-y-4">
                  <div className="mb-4">
                    <h3 className="text-base font-medium mb-1">
                      Email Notifications
                    </h3>
                    <p className="text-sm">
                      You can select the type of email notifications you want to
                      opt in and out of sent by Toto Academy.
                    </p>
                  </div>

                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="optOutAll"
                      checked={optOutAll}
                      onChange={(e) => setOptOutAll(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="optOutAll" className="text-sm">
                      Opt-out of all our emails (Optional)
                    </label>
                  </div>

                  <div className="mb-2">
                    <h3 className="text-base font-medium mb-1">
                      Notifications from Toto Academy
                    </h3>
                  </div>

                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="weeklyRecommendations"
                      checked={weeklyRecommendations}
                      onChange={(e) =>
                        setWeeklyRecommendations(e.target.checked)
                      }
                      className="mr-2"
                    />
                    <label htmlFor="weeklyRecommendations" className="text-sm">
                      Weekly personalized course recommendations.
                    </label>
                  </div>

                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="promotionNotifications"
                      checked={promotionNotifications}
                      onChange={(e) =>
                        setPromotionNotifications(e.target.checked)
                      }
                      className="mr-2"
                    />
                    <label htmlFor="promotionNotifications" className="text-sm">
                      Weekly notifications about promotions, new courses and
                      special events.
                    </label>
                  </div>

                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="surveyNotifications"
                      checked={surveyNotifications}
                      onChange={(e) => setSurveyNotifications(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="surveyNotifications" className="text-sm">
                      Surveys and invitations to help us improve Toto Academy
                      content and your experience
                    </label>
                  </div>

                  <div>
                    <button
                      onClick={handleCommunicationSubmit}
                      className="bg-blue-900 text-white py-2 px-4 rounded text-sm"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
