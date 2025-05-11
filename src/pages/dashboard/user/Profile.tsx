import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pencil, User as UserIcon, Mail, Phone, Home, School, Book, Shield, Users } from "lucide-react";
import SectionTitle from "@/components/SectionTitle";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
    const { user } = useAuth();
    const [isEditDialogOpen, setEditDialogOpen] = useState(false); // State for dialog
    const [editFormData, setEditFormData] = useState({
        fullName: `${user?.firstName || ""} ${user?.lastName || ""}`,
        email: user?.email || "",
        phoneNumber: user?.phone_number || "",
        address: user?.address || "",
    });

    const handleEditChange = (name, value) => {
        setEditFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = () => {
        console.log("Saving changes:", editFormData);
        setEditDialogOpen(false);
        // Add logic to save changes
    };

    if (!user) {
        return <div>Loading user data...</div>;
    }

    return (
        <div className="max-w-screen-xl mx-auto py-4 md:py-6">
            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Account</DialogTitle>
                    </DialogHeader>
                    <form className="space-y-4">
                        <div>
                            <Label htmlFor="fullName" className="mb-2 text-sm font-bold">
                                Full Name
                            </Label>
                            <Input
                                id="fullName"
                                type="text"
                                value={editFormData.fullName}
                                onChange={(e) => handleEditChange("fullName", e.target.value)}
                                placeholder="Enter Full Name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email" className="mb-2 text-sm font-bold">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={editFormData.email}
                                onChange={(e) => handleEditChange("email", e.target.value)}
                                placeholder="Enter Email"
                            />
                        </div>
                        <div>
                            <Label htmlFor="phoneNumber" className="mb-2 text-sm font-bold">
                                Phone Number
                            </Label>
                            <Input
                                id="phoneNumber"
                                type="tel"
                                value={editFormData.phoneNumber}
                                onChange={(e) => handleEditChange("phoneNumber", e.target.value)}
                                placeholder="Enter Phone Number"
                            />
                        </div>
                        <div>
                            <Label htmlFor="address" className="mb-2 text-sm font-bold">
                                Address
                            </Label>
                            <Input
                                id="address"
                                type="text"
                                value={editFormData.address}
                                onChange={(e) => handleEditChange("address", e.target.value)}
                                placeholder="Enter Address"
                            />
                        </div>
                    </form>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveChanges}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column - Profile Info */}
                <div className="w-full md:w-1/3 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-col items-center pb-4">
                            <div className="relative">
                                {/* <img
                                    src={user.profile_picture || "/default-avatar.png"}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="h-32 w-32 rounded-full object-cover border-4 border-primary/10"
                                /> */}
                                <Avatar className="h-32 w-32  cursor-pointer">
                                    <AvatarImage src={user?.profile_picture} />
                                    <AvatarFallback className="text-4xl">{user.firstName.slice(0, 1) + user.lastName.slice(0, 1)}</AvatarFallback>
                                </Avatar>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="absolute bottom-0 right-0 rounded-full bg-background"
                                    onClick={() => {
                                        // Logic to edit profile photo
                                        console.log("Edit profile photo clicked");
                                    }}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </div>
                            <h2 className="text-2xl font-bold mt-4">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-muted-foreground">{user.level} Student</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button onClick={() => setEditDialogOpen(true)} variant="outline" className="w-full">
                                Edit Profile
                            </Button>
                            <Button className="w-full">Upgrade Subscription</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <SectionTitle title="Account Information" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p>{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p>{user.phone_number}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Subscription</p>
                                    <p className="capitalize">
                                        {user.subscription_status || "Not subscribed"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Additional Details */}
                <div className="w-full md:w-2/3 space-y-6">
                    <Card>
                        <CardHeader>
                            <SectionTitle title="Personal Information" />
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        First Name
                                    </h3>
                                    <p>{user.firstName}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Last Name
                                    </h3>
                                    <p>{user.lastName}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Education Level
                                    </h3>
                                    <p>{user.level}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        Address
                                    </h3>
                                    <p>{user.address || "Not provided"}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">
                                        School
                                    </h3>
                                    <p>{user.school || "Not provided"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {user.subjects && user.subjects.length > 0 && (
                        <Card>
                            <CardHeader>
                                <SectionTitle title="Subjects" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {user.subjects.map((subject) => (
                                        <span
                                            key={subject}
                                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                        >
                                            {subject}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <SectionTitle title="Next of Kin" />
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Full Name
                                </h3>
                                <p>{user.next_of_kin_full_name || "Not provided"}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">
                                    Phone Number
                                </h3>
                                <p>{user.next_of_kin_phone_number || "Not provided"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button variant="outline" asChild>
                            <Link to="/">Back to Dashboard</Link>
                        </Button>
                        <Button>Save Changes</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;