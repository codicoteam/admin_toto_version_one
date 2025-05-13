import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  UserCircle2,
  Menu,
  Send,
  Users,
  Info,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ChatService from "@/services/chat_service"; // Import the ChatService

const ChatApp = () => {
  const [activeGroup, setActiveGroup] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi", time: "10:00", sender: "other" },
    { id: 2, text: "How are you", time: "10:00", sender: "other" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    files: true,
    photos: true,
    videos: false,
    audio: false,
    documents: false,
    links: false,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [groupsListOpen, setGroupsListOpen] = useState(false);
  const [infoSidebarOpen, setInfoSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [communities, setCommunities] = useState([]); // State for storing communities data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const messagesEndRef = useRef(null);

  // Fetch communities data on component mount
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        
        // Check if user is logged in by verifying token exists
        const token = localStorage.getItem("authToken");
        if (!token) {
          setError("You must be logged in to view communities");
          setLoading(false);
          return;
        }
        
        const response = await ChatService.getAllChatGroups();
        
        // Process the API response
        if (response && response.data) {
          setCommunities(response.data);
          console.log("Communities loaded:", response.data);
          
          // Set the first community as active if communities exist
          if (response.data.length > 0) {
            setActiveGroup(response.data[0]);
          }
        } else {
          setError("No communities found");
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load chat groups");
        setLoading(false);
        console.error("Error fetching communities:", err);
      }
    };
    
    fetchCommunities();
  }, []);

   

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: newMessage,
          time: getCurrentTime(),
          sender: "user",
        },
      ]);
      setNewMessage("");
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update screen size state and handle responsive layout
  useEffect(() => {
    const checkScreenSize = () => {
      const isLarge = window.innerWidth >= 1024;
      const isMedium = window.innerWidth >= 768;
      setIsLargeScreen(isLarge);
      setIsMediumScreen(isMedium);
      setSidebarOpen(isMedium);

      // On large screens, automatically show both sidebars
      if (isLarge) {
        setInfoSidebarOpen(true);
        setGroupsListOpen(true);
      } else if (isMedium) {
        // On medium screens, show groups list but not info sidebar
        setGroupsListOpen(true);
        setInfoSidebarOpen(false);
      } else {
        // On small screens, hide both by default
        setGroupsListOpen(false);
        setInfoSidebarOpen(false);
      }
    };

    // Run on initial load
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Main Navigation Sidebar */}
      <div
        className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          transition-transform duration-300 ease-in-out 
          fixed md:relative z-50 w-64 h-full
        `}
      >
        <Sidebar />
      </div>

      {/* Mobile Toggles for Navigation */}
      <div className="flex items-center bg-blue-900 text-white p-2 md:hidden fixed top-0 left-0 right-0 z-40 h-12">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 mr-2"
        >
          <Menu size={20} />
        </button>
        <div className="flex-1 text-center font-semibold">
          {!groupsListOpen && activeGroup?.name}
        </div>
        <div className="flex">
          <button
            onClick={() => setGroupsListOpen(!groupsListOpen)}
            className={`p-1 mr-2 ${
              groupsListOpen ? "bg-blue-800 rounded" : ""
            }`}
          >
            <Users size={20} />
          </button>
          <button
            onClick={() => setInfoSidebarOpen(!infoSidebarOpen)}
            className={`p-1 ${infoSidebarOpen ? "bg-blue-800 rounded" : ""}`}
          >
            <Info size={20} />
          </button>
        </div>
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {sidebarOpen && !isMediumScreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 overflow-hidden mt-12 md:mt-0">
        {/* Groups List */}
        <div
          className={`
            ${
              groupsListOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            } 
            transition-transform duration-300 ease-in-out
            fixed md:relative left-0 z-30 w-full md:w-64 md:min-w-64 bg-white h-[calc(100%-3rem)] md:h-full
            flex flex-col border-r
          `}
        >
          {/* Search Area */}
          <div className="p-3 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full py-2 pl-8 pr-10 bg-purple-50 text-gray-700 rounded-md"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Plus className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
            </div>
          </div>

          {/* Group List - Now using data from API */}
          <div className="p-3 space-y-2 flex-grow overflow-y-auto">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading groups...</div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : communities.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No groups available</div>
            ) : (
              communities.map((community) => (
                <button
                  key={community._id}
                  className={`w-full text-left py-2 px-4 rounded-md text-sm font-medium ${
                    activeGroup?._id === community._id
                      ? "bg-blue-900 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => {
                    setActiveGroup(community);
                    if (!isMediumScreen) {
                      setGroupsListOpen(false);
                    }
                  }}
                >
                  {community.name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Backdrop for Mobile Group List */}
        {groupsListOpen && !isMediumScreen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setGroupsListOpen(false)}
          />
        )}

        {/* Chat Area */}
        <div
          className={`
            flex-1 flex flex-col bg-gray-50 h-full
            ${
              (groupsListOpen && !isMediumScreen) ||
              (infoSidebarOpen && !isLargeScreen)
                ? "hidden md:flex"
                : "flex"
            }
          `}
        >
          <div className="hidden md:flex text-xl font-semibold p-4 border-b bg-white">
            {activeGroup?.name || "Select a group"}
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.sender === "other" && (
                    <div className="flex-shrink-0 mr-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <UserCircle2 className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-blue-200 text-blue-900"
                    }`}
                  >
                    <div className="mb-1">{message.text}</div>
                    <div
                      className={`text-xs ${
                        message.sender === "user"
                          ? "text-blue-100"
                          : "text-blue-700"
                      }`}
                    >
                      {message.time}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="p-3 bg-white border-t">
            <div className="relative flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type Message"
                className="flex-1 p-3 bg-blue-50 text-gray-700 rounded-lg pr-12"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                className="absolute right-2 text-blue-500 p-2"
                onClick={handleSendMessage}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Group Info */}
        <div
          className={`
            ${
              infoSidebarOpen
                ? "translate-x-0"
                : "translate-x-full lg:translate-x-0"
            } 
            transition-transform duration-300 ease-in-out
            fixed lg:relative right-0 z-30 w-full sm:w-80 lg:w-64 bg-white h-[calc(100%-3rem)] md:h-full
            flex flex-col border-l
          `}
        >
          <div className="p-4 bg-gray-200 flex justify-between items-center">
            <div className="font-semibold">Group Info</div>
            <button
              onClick={() => setInfoSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4 cursor-pointer" />
            </button>
          </div>

          {/* Display Subject Information */}
          {activeGroup && (
            <div className="p-4 border-b">
              <h3 className="font-medium mb-1">Subject</h3>
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-sm">{activeGroup.subject?.subjectName || "No subject information"}</p>
                <p className="text-xs text-gray-500">{activeGroup.subject?.Level || ""}</p>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium">Level</p>
                <p className="text-sm">{activeGroup.Level || "Not specified"}</p>
              </div>
            </div>
          )}

          {/* Group Info Sections */}
          <div className="p-2 flex-1 overflow-y-auto">
            <div className="border-b">
              <button
                className="w-full p-2 flex justify-between items-center"
                onClick={() => toggleSection("files")}
              >
                <span>Files</span>
                {expandedSections.files ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {expandedSections.files && (
                <div className="p-2 bg-white">
                  <p className="text-sm text-gray-500">No files shared</p>
                </div>
              )}
            </div>

            <div className="border-b">
              <button
                className="w-full p-2 flex justify-between items-center"
                onClick={() => toggleSection("photos")}
              >
                <span>Photos</span>
                {expandedSections.photos ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {expandedSections.photos && (
                <div className="p-2 bg-white">
                  <p className="text-sm text-gray-500">No photos shared</p>
                </div>
              )}
            </div>

            <div className="border-b">
              <button
                className="w-full p-2 flex justify-between items-center"
                onClick={() => toggleSection("videos")}
              >
                <span>Videos</span>
                {expandedSections.videos ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {expandedSections.videos && (
                <div className="p-2 bg-white">
                  <p className="text-sm text-gray-500">No videos shared</p>
                </div>
              )}
            </div>

            <div className="border-b">
              <button
                className="w-full p-2 flex justify-between items-center"
                onClick={() => toggleSection("audio")}
              >
                <span>Audio</span>
                {expandedSections.audio ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {expandedSections.audio && (
                <div className="p-2 bg-white">
                  <p className="text-sm text-gray-500">No audio shared</p>
                </div>
              )}
            </div>

            <div className="border-b">
              <button
                className="w-full p-2 flex justify-between items-center"
                onClick={() => toggleSection("documents")}
              >
                <span>Documents</span>
                {expandedSections.documents ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {expandedSections.documents && (
                <div className="p-2 bg-white">
                  <p className="text-sm text-gray-500">No documents shared</p>
                </div>
              )}
            </div>

            <div className="border-b">
              <button
                className="w-full p-2 flex justify-between items-center"
                onClick={() => toggleSection("links")}
              >
                <span>Links</span>
                {expandedSections.links ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              {expandedSections.links && (
                <div className="p-2 bg-white">
                  <p className="text-sm text-gray-500">No links shared</p>
                </div>
              )}
            </div>
          </div>

          {/* Members List - Display members from active community */}
          <div className="p-4">
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium">
                    {activeGroup
                      ? `${activeGroup.students?.length || 0} members`
                      : "0 members"}
                  </div>
                  <X className="h-4 w-4 cursor-pointer" />
                </div>

                <div className="space-y-2">
                  {activeGroup && activeGroup.students?.map(student => (
                    <div key={student._id} className="bg-white p-2 rounded border">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                        <span className="text-sm">{`${student.firstName} ${student.lastName}`}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="p-4 mt-auto space-y-2">
            <button className="w-full py-2 px-4 border border-blue-500 text-blue-500 rounded font-medium">
              Add to favourites
            </button>
            <button className="w-full py-2 px-4 bg-red-500 text-white rounded font-medium">
              Exit Group
            </button>
          </div>
        </div>

        {/* Backdrop for Mobile Info Sidebar */}
        {infoSidebarOpen && !isLargeScreen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setInfoSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ChatApp;