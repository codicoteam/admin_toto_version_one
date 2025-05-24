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
  Paperclip,
  File,
  Image,
  Film,
  FileAudio,
  FileText,
  CornerUpLeft,
  MoreVertical,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import ChatService from "@/services/chat_service"; // Import the ChatService

// Define interface for message object
interface MessageFile {
  name: string;
  type: string;
  size: number;
  url?: string;
}

interface Message {
  id: number;
  text: string;
  time: string;
  sender: string;
  file?: MessageFile; // Add optional file property
  replyTo?: number; // Reference to the message being replied to
}

const ChatApp = () => {
  const [activeGroup, setActiveGroup] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
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
  const [communities, setCommunities] = useState<any[]>([]); // State for storing communities data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false); // State for attachment menu
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // State for selected file
  const [filePreview, setFilePreview] = useState<string | null>(null); // State for file preview
  const [replyingTo, setReplyingTo] = useState<Message | null>(null); // New state for replying to a message

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

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
    if (newMessage.trim() || selectedFile) {
      const messageObj: Message = {
        id: messages.length + 1,
        text: newMessage.trim(),
        time: getCurrentTime(),
        sender: "user",
      };

      // Add reply information if replying to a message
      if (replyingTo) {
        messageObj.replyTo = replyingTo.id;
      }

      // Add file information if a file is selected
      if (selectedFile) {
        messageObj.file = {
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          url: filePreview || undefined,
        };
      }

      setMessages([...messages, messageObj]);
      setNewMessage("");
      setSelectedFile(null);
      setFilePreview(null);
      setReplyingTo(null); // Clear reply state after sending
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      // Create file preview URL
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }

      setShowAttachmentMenu(false);
    }
  };

  const handleAttachmentClick = (type: string) => {
    // Set accepted file types based on user selection
    let acceptedTypes = "";
    switch (type) {
      case "image":
        acceptedTypes = "image/*";
        break;
      case "video":
        acceptedTypes = "video/*";
        break;
      case "audio":
        acceptedTypes = "audio/*";
        break;
      case "document":
        acceptedTypes = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt";
        break;
      default:
        acceptedTypes = "*/*";
    }

    // Set the file input's accept attribute and trigger click
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptedTypes;
      fileInputRef.current.click();
    }
    setShowAttachmentMenu(false);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  // Function to handle replying to a message
  const handleReplyToMessage = (message: Message) => {
    setReplyingTo(message);

    // Focus on the message input after selecting a message to reply to
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  };

  // Cancel replying to a message
  const cancelReply = () => {
    setReplyingTo(null);
  };

  // Get the message being replied to
  const getReplyMessage = (replyId: number | undefined) => {
    if (!replyId) return null;
    return messages.find((msg) => msg.id === replyId);
  };

  // File type icon mapping
  const getFileIcon = (fileType?: string) => {
    if (fileType?.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (fileType?.startsWith("video/")) return <Film className="h-4 w-4" />;
    if (fileType?.startsWith("audio/"))
      return <FileAudio className="h-4 w-4" />;
    if (
      fileType?.includes("pdf") ||
      fileType?.includes("doc") ||
      fileType?.includes("ppt") ||
      fileType?.includes("xls")
    )
      return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Get a short preview of the message text for the reply context
  const getMessagePreview = (text: string, maxLength = 30) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
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

  // Close attachment menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showAttachmentMenu &&
        !(event.target as Element).closest(".attachment-menu-container")
      ) {
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAttachmentMenu]);

  // Message context menu for reply option
  const MessageContextMenu = ({ message }: { message: Message }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
      <div className="relative">
        <button
          className="p-1 text-gray-500 rounded-full hover:bg-gray-200 focus:outline-none"
          onClick={() => setShowMenu(!showMenu)}
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {showMenu && (
          <div className="absolute z-50 right-0 bottom-full mb-1 bg-white shadow-lg rounded-md py-1 w-32">
            <button
              className="flex items-center w-full px-3 py-2 text-left text-sm hover:bg-blue-50"
              onClick={() => {
                handleReplyToMessage(message);
                setShowMenu(false);
              }}
            >
              <CornerUpLeft className="h-4 w-4 mr-2" /> Reply
            </button>
          </div>
        )}
      </div>
    );
  };

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
              <div className="text-center py-4 text-gray-500">
                Loading groups...
              </div>
            ) : error ? (
              <div className="text-center py-4 text-red-500">{error}</div>
            ) : communities.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No groups available
              </div>
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

                  <div className="relative">
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-blue-200 text-blue-900"
                      }`}
                    >
                      {/* Reply context section */}
                      {message.replyTo && (
                        <div
                          className={`rounded-md px-2 py-1 mb-2 text-xs flex items-center ${
                            message.sender === "user"
                              ? "bg-blue-600"
                              : "bg-blue-300"
                          }`}
                        >
                          <CornerUpLeft className="h-3 w-3 mr-1 inline-block" />
                          <div className="flex-1 overflow-hidden">
                            <div className="font-medium">
                              {getReplyMessage(message.replyTo)?.sender ===
                              "user"
                                ? "You"
                                : "Them"}
                            </div>
                            <div className="truncate">
                              {getReplyMessage(message.replyTo)?.file &&
                                "[Media] "}
                              {getReplyMessage(message.replyTo)?.text
                                ? getMessagePreview(
                                    getReplyMessage(message.replyTo)?.text || ""
                                  )
                                : getReplyMessage(message.replyTo)?.file
                                ? "File"
                                : "Message"}
                            </div>
                          </div>
                        </div>
                      )}

                      {message.file && (
                        <div className="mb-2">
                          {message.file.type.startsWith("image/") ? (
                            <div className="mb-2">
                              <img
                                src={message.file.url}
                                alt={message.file.name}
                                className="rounded-md max-w-full max-h-40 object-contain"
                              />
                            </div>
                          ) : (
                            <div
                              className={`flex items-center p-2 rounded-md mb-2 ${
                                message.sender === "user"
                                  ? "bg-blue-600"
                                  : "bg-blue-300"
                              }`}
                            >
                              <div className="mr-2">
                                {getFileIcon(message.file.type)}
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <div className="text-sm truncate">
                                  {message.file.name}
                                </div>
                                <div
                                  className={`text-xs ${
                                    message.sender === "user"
                                      ? "text-blue-200"
                                      : "text-blue-700"
                                  }`}
                                >
                                  {formatFileSize(message.file.size)}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {message.text && (
                        <div className="mb-1">{message.text}</div>
                      )}
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

                    {/* Message actions - reply button */}
                    <div
                      className={`absolute ${
                        message.sender === "user" ? "left-0" : "right-0"
                      } top-1/2 transform ${
                        message.sender === "user"
                          ? "-translate-x-full"
                          : "translate-x-full"
                      }`}
                    >
                      <MessageContextMenu message={message} />
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Reply Indicator */}
          {replyingTo && (
            <div className="px-3 pt-3 bg-white border-t">
              <div className="flex items-center justify-between bg-blue-50 p-2 rounded-t-md">
                <div className="flex items-center">
                  <CornerUpLeft className="h-4 w-4 mr-2 text-blue-500" />
                  <div>
                    <div className="text-xs font-medium">
                      Replying to{" "}
                      {replyingTo.sender === "user" ? "yourself" : "them"}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {replyingTo.text
                        ? getMessagePreview(replyingTo.text)
                        : "Media"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={cancelReply}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* File Preview Area */}
          {selectedFile && (
            <div className="px-3 pt-3 bg-white border-t">
              <div className="flex items-center bg-blue-50 p-2 rounded-md">
                <div className="mr-2">{getFileIcon(selectedFile.type)}</div>
                <div className="flex-1 truncate">
                  <div className="text-sm truncate">{selectedFile.name}</div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(selectedFile.size)}
                  </div>
                </div>
                <button
                  onClick={removeSelectedFile}
                  className="ml-2 text-gray-500 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="p-3 bg-white border-t">
            <div className="relative flex items-center">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                style={{ display: "none" }}
              />

              {/* Attachment button */}
              <div className="attachment-menu-container relative">
                <button
                  className="text-blue-500 p-2"
                  onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                >
                  <Paperclip className="h-5 w-5" />
                </button>

                {/* Attachment menu */}
                {showAttachmentMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-md shadow-lg p-2 z-10">
                    <div className="space-y-1">
                      <button
                        onClick={() => handleAttachmentClick("image")}
                        className="flex items-center w-full px-3 py-2 text-left text-sm hover:bg-blue-50 rounded-md"
                      >
                        <Image className="h-4 w-4 mr-2 text-blue-500" /> Images
                      </button>
                      <button
                        onClick={() => handleAttachmentClick("video")}
                        className="flex items-center w-full px-3 py-2 text-left text-sm hover:bg-blue-50 rounded-md"
                      >
                        <Film className="h-4 w-4 mr-2 text-blue-500" /> Videos
                      </button>
                      <button
                        onClick={() => handleAttachmentClick("audio")}
                        className="flex items-center w-full px-3 py-2 text-left text-sm hover:bg-blue-50 rounded-md"
                      >
                        <FileAudio className="h-4 w-4 mr-2 text-blue-500" />{" "}
                        Audio
                      </button>
                      <button
                        onClick={() => handleAttachmentClick("document")}
                        className="flex items-center w-full px-3 py-2 text-left text-sm hover:bg-blue-50 rounded-md"
                      >
                        <FileText className="h-4 w-4 mr-2 text-blue-500" />{" "}
                        Documents
                      </button>
                      <button
                        onClick={() => handleAttachmentClick("all")}
                        className="flex items-center w-full px-3 py-2 text-left text-sm hover:bg-blue-50 rounded-md"
                      >
                        <File className="h-4 w-4 mr-2 text-blue-500" /> All
                        Files
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <input
                type="text"
                ref={messageInputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={replyingTo ? "Type your reply..." : "Type Message"}
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
                <p className="text-sm">
                  {activeGroup.subject?.subjectName || "No subject information"}
                </p>
                <p className="text-xs text-gray-500">
                  {activeGroup.subject?.Level || ""}
                </p>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium">Level</p>
                <p className="text-sm">
                  {activeGroup.Level || "Not specified"}
                </p>
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
                  <div className="grid grid-cols-3 gap-2">
                    {/* This would be populated with photos from the chat */}
                    <p className="text-sm text-gray-500 col-span-3">
                      No photos shared
                    </p>
                  </div>
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
                  <p className="text-sm text-gray-500">No audio files shared</p>
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

          {/* Members Section */}
          <div className="p-4 border-t">
            <h3 className="font-medium mb-2">Members</h3>
            <div className="space-y-2">
              {activeGroup?.members?.map((member) => (
                <div key={member._id} className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                    <UserCircle2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {member.name || "Unknown user"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {member.role || "Member"}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-gray-500">
                  No members information available
                </p>
              )}
            </div>
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
