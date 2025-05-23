import Sidebar from "@/components/Sidebar";
import { toast } from "@/hooks/use-toast";
import ChatService from "@/services/chat_service";
import {
  ChevronDown,
  ChevronUp,
  Info,
  Menu,
  Plus,
  Search,
  Send,
  UserCircle2,
  Users,
  X,
  Trash2,
  Star,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ChatApp = (ChatServiceData: any) => {
  const [activeGroup, setActiveGroup] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi", time: "10:00", sender: "other" },
    { id: 2, text: "How are you", time: "10:00", sender: "other" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    files: true,
    photos: true,
    videos: false,
    audio: false,
    documents: false,
    links: false,
  });

  const [profilePic, setProfilePic] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [groupsListOpen, setGroupsListOpen] = useState(false);
  const [infoSidebarOpen, setInfoSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isMediumScreen, setIsMediumScreen] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [groupSubject, setGroupSubject] = useState("General");
  const [groupLevel, setGroupLevel] = useState("Beginner");
  const [groupDescription, setGroupDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [groups, setGroups] = useState([]);
  const [isSending, setIsSending] = useState(false);

  // Add these state variables near the other state declarations
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updatedGroupName, setUpdatedGroupName] = useState("");
  const [updatedGroupSubject, setUpdatedGroupSubject] = useState("");
  const [updatedGroupLevel, setUpdatedGroupLevel] = useState("");

  // inside your component:
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("chatFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (groupId: string) => {
    setFavorites((prev) => {
      if (prev.includes(groupId)) {
        return prev.filter((id) => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  };

  const isFavorite = (groupId: string) => {
    return favorites.includes(groupId);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateCommunities = (data: any) => {
    setCommunities(data);
  };

  const fetchChatGroups = async (): Promise<void> => {
    try {
      setLoading(true);
      const result = await ChatService.getAllChatGroups();
      const chatData = result.data || [];
      updateCommunities(chatData);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch chat groups:", err);
      setError("Failed to load chat groups. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load chat groups. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Group name cannot be empty",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const apiGroupData = {
        name: newGroupName.trim(),
        profilePicture: "https://example.com/images/group3.jpg",
        Level: "Form 3",
        subject: "681c67c388b9909f563ee689",

        students: ["681374a1a32332081e3da351", "680f9e902aba5e42cfb4770b"],
      };

      console.log("Sending group data to API:", apiGroupData);

      const result = await ChatService.createGroup(apiGroupData);
      console.log("API response:", result);

      if (result.success) {
        toast({
          title: "Success",
          description: "Group created successfully",
        });

        setNewGroupName("");
        setGroupSubject("");
        setGroupLevel("");
        setProfilePic("");

        setShowNewGroupModal(false);

        fetchChatGroups();
      }
    } catch (error) {
      console.error("Failed to create group:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create group. Please try again.";

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this function with the other handler functions
  const handleUpdateGroup = async () => {
    if (!activeGroup?._id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No active group selected.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        name: updatedGroupName.trim() || activeGroup.name,
        subject: updatedGroupSubject || activeGroup.subject,
        Level: updatedGroupLevel || activeGroup.Level,
      };

      const result = await ChatService.updateGroup(activeGroup._id, updateData);

      if (result?.message) {
        toast({
          title: "Success",
          description: "Group updated successfully",
        });

        setUpdatedGroupName("");
        setUpdatedGroupSubject("");
        setUpdatedGroupLevel("");
        setShowUpdateModal(false);

        fetchChatGroups();
      } else {
        throw new Error(result?.message || "Failed to update group.");
      }
    } catch (err) {
      console.error("Failed to update group:", err);

      toast({
        variant: "destructive",
        title: "Error",
        description:
          err?.message || "Failed to update group. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlecreateMessage = async () => {
    if (!newMessage.trim() || !activeGroup?._id || isSending) return;

    setIsSending(true);

    try {
      const messageData = {
        content: newMessage.trim(),
        senderId: "currentUserId", // Replace with actual user ID from your auth
        senderName: "Current User", // Replace with actual username
        timestamp: new Date().toISOString(),
      };

      // Call the API
      await ChatService.createMessage(activeGroup._id, messageData);

      // Update local state
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(), // Using timestamp as temporary ID
          text: newMessage,
          time: getCurrentTime(),
          sender: "user",
        },
      ]);

      setNewMessage("");
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Failed to send message",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Add this function to open the update modal
  const openUpdateModal = (group) => {
    setUpdatedGroupName(group.name);
    setUpdatedGroupSubject(group.subject?.subjectName || "");
    setUpdatedGroupLevel(group.Level || "");
    setShowUpdateModal(true);
  };

  const openDeleteConfirmModal = (group) => {
    setGroupToDelete(group);
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete?._id) return;

    try {
      const result = await ChatService.deletegroup(groupToDelete._id);
      console.log(
        "---deleted code--------deleted code----------------",
        result?.message
      );

      if (result?.message == "Community deleted successfully") {
        toast({
          title: "Success",
          description: "Group deleted successfully",
        });

        if (activeGroup?._id === groupToDelete._id) {
          setActiveGroup(null);
        }

        toggleFavorite(groupToDelete._id);

        setShowDeleteConfirmModal(false);
        setGroupToDelete(null);

        fetchChatGroups();
      } else {
        toast({
          variant: "destructive",
          title: "Failed",
          description: result?.message || "Could not delete the group.",
        });
      }
    } catch (err) {
      console.error("Failed to delete group:", err);

      toast({
        variant: "destructive",
        title: "Error",
        description:
          err?.response?.data?.message ||
          "Failed to delete group. Please try again.",
      });
    }
  };

  const handleExitGroup = async () => {
    if (!activeGroup || !activeGroup._id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No active group selected.",
      });
      return;
    }

    try {
      const result = await ChatService.exitGroup(activeGroup._id);

      if (result?.success) {
        toast({
          title: "Success",
          description: "You have left the group successfully",
        });

        toggleFavorite(activeGroup._id);
        setActiveGroup(null);
        setShowExitConfirmModal(false);
        fetchChatGroups();
      } else {
        throw new Error(result?.message || "Failed to leave group.");
      }
    } catch (err) {
      console.error("Failed to exit group:", err);

      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Failed to leave group. Please try again.",
      });
    }
  };

  useEffect(() => {
    fetchChatGroups();
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const checkScreenSize = () => {
      const isLarge = window.innerWidth >= 1024;
      const isMedium = window.innerWidth >= 768;
      setIsLargeScreen(isLarge);
      setIsMediumScreen(isMedium);
      setSidebarOpen(isMedium);

      if (isLarge) {
        setInfoSidebarOpen(true);
        setGroupsListOpen(true);
      } else if (isMedium) {
        setGroupsListOpen(true);
        setInfoSidebarOpen(false);
      } else {
        setGroupsListOpen(false);
        setInfoSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-8 pr-10 bg-purple-50 text-gray-700 rounded-md"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <button
                onClick={() => setShowNewGroupModal(true)}
                className="absolute right-2 top-2.5 h-4 w-4 text-gray-500"
              >
                <Plus />
              </button>
            </div>
          </div>

          {/* Group List */}
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
              communities
                .filter((community) =>
                  community.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((community) => (
                  <div key={community._id} className="group relative">
                    <button
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
                      <div className="flex items-center justify-between">
                        <span>{community.name}</span>
                        {isFavorite(community._id) && (
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        )}
                      </div>
                    </button>
                  </div>
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
            <div className="flex-1">
              {activeGroup?.name || "Select a group"}
            </div>
            {activeGroup && isFavorite(activeGroup._id) && (
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
            )}
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

          {/* Members List */}
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
                  {activeGroup &&
                    activeGroup.students?.map((student) => (
                      <div
                        key={student._id}
                        className="bg-white p-2 rounded border"
                      >
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
            <button
              onClick={() => activeGroup && toggleFavorite(activeGroup._id)}
              className={`w-full py-2 px-4 border rounded font-medium flex items-center justify-center ${
                activeGroup && isFavorite(activeGroup._id)
                  ? "bg-yellow-100 border-yellow-500 text-yellow-700"
                  : "border-blue-500 text-blue-500"
              } hover:bg-yellow-50 transition-colors`}
              disabled={!activeGroup}
            >
              {activeGroup && isFavorite(activeGroup._id) ? (
                <>
                  <Star className="h-4 w-4 mr-2 fill-yellow-500 text-yellow-500" />
                  Favorited
                </>
              ) : (
                <>
                  <Star className="h-4 w-4 mr-2" />
                  Add to favorites
                </>
              )}
            </button>
            <button
              onClick={() => setShowExitConfirmModal(true)}
              className="w-full py-2 px-4 bg-red-500 text-white rounded font-medium hover:bg-red-600 transition-colors"
              disabled={!activeGroup}
            >
              Exit Group
            </button>
            {activeGroup && (
              <button
                onClick={() => openDeleteConfirmModal(activeGroup)}
                className="w-full py-2 px-4 bg-red-700 text-white rounded font-medium flex items-center justify-center hover:bg-red-800 transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Group
              </button>
            )}
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

      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Group</h3>
              <button
                onClick={() => setShowNewGroupModal(false)}
                className="hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Group Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Group Name
              </label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter group name"
              />
            </div>

            {/* Profile Picture */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePic(e.target.files[0])}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Level Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">O Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Form 1</option>
                <option value="beginner">Form 2</option>
                <option value="intermediate">Form 3</option>
                <option value="advanced">Form 4</option>
              </select>
            </div>

            {/* Students Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Students</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select student</option>
                <option value="john_doe">John Doe</option>
                <option value="jane_smith">Jane Smith</option>
                <option value="alex_johnson">Alex Johnson</option>
              </select>
            </div>

            {/* Subject Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select subject</option>
                <option value="math">Maths</option>
                <option value="science">Science</option>
                <option value="history">Electronics</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNewGroupModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Group Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Update Group</h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Group Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Group Name
              </label>
              <input
                type="text"
                value={updatedGroupName}
                onChange={(e) => setUpdatedGroupName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter new group name"
              />
            </div>

            {/* Subject */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                value={updatedGroupSubject}
                onChange={(e) => setUpdatedGroupSubject(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter new subject"
              />
            </div>

            {/* Level */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Level</label>
              <select
                value={updatedGroupLevel}
                onChange={(e) => setUpdatedGroupLevel(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="Form 1">Form 1</option>
                <option value="Form 2">Form 2</option>
                <option value="Form 3">Form 3</option>
                <option value="Form 4">Form 4</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateGroup}
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">
                Delete Group
              </h3>
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to delete/Update the group "
                <span className="font-semibold">{groupToDelete?.name}</span>"?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              {activeGroup && (
                <button
                  onClick={() => openUpdateModal(activeGroup)}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
                >
                  Update Group
                </button>
              )}
              <button
                onClick={() => setShowDeleteConfirmModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteGroup}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Modal */}
      {showExitConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-600">
                Exit Group
              </h3>
              <button
                onClick={() => setShowExitConfirmModal(false)}
                className="hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-700">
                Are you sure you want to exit the group "
                <span className="font-semibold">{activeGroup?.name}</span>"?
              </p>
              <p className="text-sm text-gray-500 mt-2">
                You won't be able to see group messages anymore.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowExitConfirmModal(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExitGroup}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Yes, Exit Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
