import { MessageSquare, Users, Search, PlusCircle, ChevronLeft, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Chat = () => {
    const [communities, setCommunities] = useState<any[]>([]);
    const [activeCommunity, setActiveCommunity] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const { communityId } = useParams();
    const navigate = useNavigate();

    const { token, user, logout } = useAuth();
    const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
    const [createName, setCreateName] = useState("");
    const [createLevel, setCreateLevel] = useState("");
    const [createSubject, setCreateSubject] = useState("");
    const [createLoading, setCreateLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchCommunities = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    "https://toto-academy-backend.onrender.com/api/v1/community_service/getall",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCommunities(response.data.data || []);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load communities");
            } finally {
                setLoading(false);
            }
        };

        fetchCommunities();
    }, [token]);

    useEffect(() => {
        if (communityId) {
            const fetchCommunityDetails = async () => {
                setLoading(true);
                try {
                    const response = await axios.get(
                        `https://toto-academy-backend.onrender.com/api/v1/community_service/get/${communityId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setActiveCommunity(response.data.data);
                } catch (err: any) {
                    setError(err.response?.data?.message || "Failed to load community details");
                } finally {
                    setLoading(false);
                }
            };

            fetchCommunityDetails();
        } else {
            setActiveCommunity(null);
        }
    }, [communityId, token]);

    const handleCreateCommunity = async () => {
        if (!createName.trim() || !createLevel.trim() || !createSubject.trim()) {
            toast({
                title: "Validation Error",
                description: "Please provide name, level, and subject.",
                variant: "destructive",
            });
            return;
        }
        setCreateLoading(true);
        try {
            const response = await axios.post(
                "https://toto-academy-backend.onrender.com/api/v1/community_service/create",
                {
                    name: createName,
                    Level: createLevel,
                    subject: createSubject,
                    profilePicture: "https://example.com/images/group3.jpg",
                    students: [user._id],
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            toast({
                title: "Community Created",
                description: "Your community has been created successfully.",
                variant: "default",
            });
            setCreateDialogOpen(false);
            setCreateName("");
            setCreateLevel("");
            setCreateSubject("");
            // Optionally refresh communities
            setCommunities((prev) => [response.data.data, ...prev]);
        } catch (error: any) {
            toast({
                title: "Create Community Error",
                description: error?.response?.data?.message || error?.message || "An error occurred while creating community.",
                variant: "destructive",
            });
        } finally {
            setCreateLoading(false);
        }
    };

    const filteredCommunities = communities.filter(community =>
        community.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fetch subjects for select
    const [subjects, setSubjects] = useState<any[]>([]);
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get(
                    "https://toto-academy-backend.onrender.com/api/v1/subject/getall",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setSubjects(response.data.data || []);
            } catch (err) {
                setSubjects([]);
            }
        };
        if (isCreateDialogOpen) fetchSubjects();
    }, [isCreateDialogOpen, token]);

    if (loading && !activeCommunity) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                <TriangleAlert className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Error Loading Communities</h2>
                <p className="text-muted-foreground mb-4">{error}</p>
                {error?.toLowerCase().includes("invalid token") ? (
                    <Button onClick={logout}>
                        Log out and log in again
                    </Button>
                ) : (
                    <Button onClick={() => window.location.reload()}>Retry</Button>
                )}
            </div>
        );
    }

    if (activeCommunity) {
        return (
            <div className="max-w-6xl mx-auto py-4 md:py-6">
                <div className="flex items-center mb-6">
                    <Button variant="ghost" onClick={() => navigate("/communities")}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Communities
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Community Info */}
                    <div className="w-full md:w-1/3">
                        <Card>
                            <CardHeader className="flex flex-row items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={activeCommunity.profilePicture} />
                                    <AvatarFallback>{activeCommunity.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-xl font-bold">{activeCommunity.name}</h2>
                                    <p className="text-muted-foreground">{activeCommunity.Level}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold mb-2">Members</h3>
                                        <div className="space-y-2">
                                            {activeCommunity.students.map((student: any) => (
                                                <div key={student._id} className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback>
                                                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span>{student.firstName} {student.lastName}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Button className="w-full">
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Start Chat
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chat Area */}
                    <div className="w-full md:w-2/3">
                        <Card className="h-full">
                            <CardHeader className="border-b">
                                <h2 className="text-xl font-bold">Group Chat</h2>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                                    Chat feature coming soon!
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-4 md:py-6">
            {/* Create Community Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Community</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="block mb-1 font-medium">Community Name</label>
                            <Input
                                value={createName}
                                onChange={e => setCreateName(e.target.value)}
                                placeholder="Enter community name"
                                disabled={createLoading}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Level</label>
                            <Select
                                value={createLevel}
                                onValueChange={(value) => setCreateLevel(value)}
                                disabled={createLoading}
                            >
                                <SelectTrigger className="bg-transparent border border-input p-2 rounded-md w-full">
                                    <SelectValue placeholder="Select Education Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="O Level">Ordinary Level (O-Level)</SelectItem>
                                    <SelectItem value="A Level">Advanced Level (A-Level)</SelectItem>
                                    <SelectItem value="Form 1">Form 1</SelectItem>
                                    <SelectItem value="Form 2">Form 2</SelectItem>
                                    <SelectItem value="Form 3">Form 3</SelectItem>
                                    <SelectItem value="Form 4">Form 4</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Subject</label>
                            <Select
                                value={createSubject}
                                onValueChange={setCreateSubject}
                                disabled={createLoading}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select subject" />
                                </SelectTrigger>
                                <SelectContent>
                                    {subjects.map((subject) => (
                                        <SelectItem key={subject._id} value={subject._id}>
                                            {subject.subjectName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateDialogOpen(false)} disabled={createLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateCommunity} disabled={createLoading || !createName || !createLevel || !createSubject}>
                            {createLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-400"></span>
                                    Creating...
                                </span>
                            ) : (
                                "Create"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Student Communities</h1>
                    <p className="text-muted-foreground">Connect with fellow students in your classes</p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Community
                </Button>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search communities..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="all">
                <TabsList className="grid grid-cols-3 w-full md:w-auto mb-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="my">My Communities</TabsTrigger>
                    <TabsTrigger value="recommended">Recommended</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredCommunities.map((community) => (
                            <Card
                                key={community._id}
                                className="hover:shadow-md transition cursor-pointer"
                                onClick={() => navigate(`/chat/${community._id}`)}
                            >
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={community.profilePicture} />
                                        <AvatarFallback>{community.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold">{community.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {community.students.length} members • {community.Level}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="outline" className="w-full">
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Join Chat
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="my">
                    <div className="text-center py-12 text-muted-foreground">
                        <Users className="mx-auto h-8 w-8 mb-2" />
                        <p>You haven't joined any communities yet</p>
                    </div>
                </TabsContent>

                <TabsContent value="recommended">
                    <div className="text-center py-12 text-muted-foreground">
                        <Users className="mx-auto h-8 w-8 mb-2" />
                        <p>No recommendations available</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Chat;