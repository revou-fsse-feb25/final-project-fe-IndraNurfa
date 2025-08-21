"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SiteHeader } from "@/components/user/site-header";
import { createApiClient } from "@/lib/api";
import { UserData } from "@/types";
import { Edit, Mail, Save, Shield, User, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UserPage() {
  const title = "User Profile";
  const { data: session, update } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  async function callApi() {
    setLoading(true);
    try {
      const data = await createApiClient(session || undefined).get(
        "users/profile",
      );
      console.log("API result", data);
      const profile = data.data.data || {};
      setUserData({ ...profile });
      setEditForm({ name: profile.full_name, email: profile.email || "" });
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const api = createApiClient(session || undefined);
      const payload: UserData = {
        email: editForm.email,
        full_name: editForm.name,
      };
      await api.patch("users/profile", payload);
      const newUserData = { ...userData, ...payload };
      setUserData(newUserData);

      // Update session with new data
      await update({
        ...session,
        user: {
          ...session?.user,
          name: payload.full_name,
          email: payload.email,
        },
      });

      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile", error);
      const details = (error as { response?: { data?: { details?: string } } })
        ?.response?.data?.details;
      if (details) {
        toast.error(details);
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: userData?.full_name || "",
      email: userData?.email || "",
    });
    setIsEditing(false);
  };

  useEffect(() => {
    if (session) {
      callApi();
    }
  });

  return (
    <>
      <SiteHeader title={title} />
      <div className="from-background via-background to-primary/5 min-h-screen bg-gradient-to-br">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Header Section */}
            <div className="space-y-4 text-center">
              <h1 className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent">
                {title}
              </h1>
              <p className="text-muted-foreground text-lg">
                Manage your personal information and preferences
              </p>
            </div>

            {/* Main Profile Card */}
            <Card className="from-card to-card/50 w-full border-0 bg-gradient-to-br shadow-2xl backdrop-blur-sm">
              <CardHeader className="relative pb-8 text-center">
                {/* Background Pattern */}
                <div className="from-primary/10 to-primary/10 absolute inset-0 rounded-t-lg bg-gradient-to-r via-transparent" />

                <div className="relative">
                  <div className="mb-6 flex justify-center">
                    <div className="relative">
                      <Avatar className="ring-primary/20 h-40 w-40 shadow-xl ring-4">
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt={userData?.full_name || "User avatar"}
                          role="img"
                        />
                        <AvatarFallback className="from-primary/20 to-primary/10 text-primary bg-gradient-to-br text-3xl font-bold">
                          {userData?.full_name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {/* <Button
                        size="icon"
                        variant="secondary"
                        className="absolute right-2 bottom-2 h-10 w-10 rounded-full shadow-lg"
                      >
                        <Camera className="h-4 w-4" />
                      </Button> */}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-bold">
                      {userData?.full_name || "Loading..."}
                    </CardTitle>
                    <div className="flex justify-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        <Shield className="mr-1 h-3 w-3" />
                        Verified User
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-8 px-8 pb-8">
                {/* Profile Information */}
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label
                      htmlFor="name"
                      className="text-foreground/80 flex items-center gap-2 text-sm font-semibold"
                    >
                      <div className="bg-primary/10 rounded-md p-1.5">
                        <User className="text-primary h-4 w-4" />
                      </div>
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        placeholder="Enter your full name"
                        className="focus:border-primary/50 h-12 border-2 transition-colors"
                      />
                    ) : (
                      <div className="from-muted/50 to-muted/30 border-border/50 flex min-h-[3rem] items-center rounded-lg border bg-gradient-to-r p-4 font-medium">
                        {userData?.full_name || "No name provided"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="email"
                      className="text-foreground/80 flex items-center gap-2 text-sm font-semibold"
                    >
                      <div className="bg-primary/10 rounded-md p-1.5">
                        <Mail className="text-primary h-4 w-4" />
                      </div>
                      Email Address
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        placeholder="Enter your email address"
                        className="focus:border-primary/50 h-12 border-2 transition-colors"
                      />
                    ) : (
                      <div className="from-muted/50 to-muted/30 border-border/50 flex min-h-[3rem] items-center rounded-lg border bg-gradient-to-r p-4 font-medium">
                        {userData?.email || "No email provided"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="border-border/50 flex justify-center gap-4 border-t pt-8">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="from-primary to-primary/90 h-12 bg-gradient-to-r px-8 text-base font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
                      >
                        <Save className="mr-2 h-5 w-5" />
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                        className="hover:bg-muted/50 h-12 border-2 px-8 text-base font-semibold transition-all duration-200"
                      >
                        <X className="mr-2 h-5 w-5" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleEdit}
                      disabled={loading}
                      className="from-primary to-primary/90 h-12 bg-gradient-to-r px-8 text-base font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
                    >
                      <Edit className="mr-2 h-5 w-5" />
                      Edit Profile
                    </Button>
                  )}
                </div>

                {loading && !isEditing && (
                  <div className="py-8 text-center">
                    <div className="text-muted-foreground inline-flex items-center gap-3">
                      <div className="border-primary h-5 w-5 animate-spin rounded-full border-b-2"></div>
                      Loading profile data...
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
