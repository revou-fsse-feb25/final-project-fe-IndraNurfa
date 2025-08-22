"use client";

import { SiteHeader } from "@/components/admin/site-header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createApiClient } from "@/lib/api";
import { Court, CourtType } from "@/types";
import { Edit, MoreHorizontal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminManagementPage() {
  const title = "Service Management";
  const { data: session } = useSession();
  const [courtTypes, setCourtTypes] = useState<CourtType[]>([]);
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    type: "court-type" | "court" | null;
    item: CourtType | Court | null;
  }>({
    isOpen: false,
    type: null,
    item: null,
  });
  const [editForm, setEditForm] = useState<{
    name: string;
    price?: string;
  }>({
    name: "",
    price: "",
  });

  const fetchCourtTypes = useCallback(async () => {
    if (!session) return;

    try {
      const client = createApiClient(session);
      const response = await client.get("/courts/master-court-types");

      const courtTypesWithDates = response.data.data.map(
        (
          courtType: CourtType & { created_at?: string; updated_at?: string },
        ) => ({
          ...courtType,
          created_at: courtType.created_at
            ? new Date(courtType.created_at)
            : undefined,
          updated_at: courtType.updated_at
            ? new Date(courtType.updated_at)
            : undefined,
        }),
      );

      setCourtTypes(courtTypesWithDates);
    } catch (error: unknown) {
      console.error("Error fetching court types:", error);
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to fetch court types");
      }
    }
  }, [session]);

  const fetchCourts = useCallback(async () => {
    if (!session) return;

    try {
      const client = createApiClient(session);
      const response = await client.get("/courts");

      const courtsWithDates = response.data.data.map(
        (court: Court & { created_at?: string; updated_at?: string }) => ({
          ...court,
          created_at: court.created_at ? new Date(court.created_at) : undefined,
          updated_at: court.updated_at ? new Date(court.updated_at) : undefined,
        }),
      );

      setCourts(courtsWithDates);
    } catch (error: unknown) {
      console.error("Error fetching courts:", error);
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Failed to fetch courts");
      }
    }
  }, [session]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchCourtTypes(), fetchCourts()]);
    setLoading(false);
  }, [fetchCourtTypes, fetchCourts]);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session, fetchData]);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const handleEditCourtType = (courtType: CourtType) => {
    setEditDialog({
      isOpen: true,
      type: "court-type",
      item: courtType,
    });
    setEditForm({
      name: courtType.name,
      price: courtType.price.toString(),
    });
  };

  const handleEditCourt = (court: Court) => {
    setEditDialog({
      isOpen: true,
      type: "court",
      item: court,
    });
    setEditForm({
      name: court.name,
    });
  };

  const handleSaveEdit = async () => {
    if (!editDialog.item || !session) return;

    setSaving(true);
    try {
      const client = createApiClient(session);

      if (editDialog.type === "court-type") {
        const courtType = editDialog.item as CourtType;
        await client.patch(`/courts/master-court-types/${courtType.id}`, {
          name: editForm.name,
          price: parseInt(editForm.price || "0"),
        });
        toast.success("Court type updated successfully");
        await fetchCourtTypes();
      } else if (editDialog.type === "court") {
        const court = editDialog.item as Court;
        await client.patch(`/courts/master-courts/${court.id}`, {
          name: editForm.name,
        });
        toast.success("Court updated successfully");
        await fetchCourts();
      }

      setEditDialog({ isOpen: false, type: null, item: null });
      setEditForm({ name: "", price: "" });
    } catch (error: unknown) {
      console.error("Error updating:", error);
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (axiosError.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(axiosError.response?.data?.message || "Failed to update");
      }
    } finally {
      setSaving(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-background min-h-screen">
        <SiteHeader title={title} />
        <main className="container mx-auto p-6">
          <div className="flex h-64 items-center justify-center">
            <p className="text-gray-500">Please login to access admin panel</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <SiteHeader title={title} />
      <main className="container mx-auto px-4 lg:px-6">
        <div className="py-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Service Management</h1>
            <p className="mt-2 text-gray-600">
              Manage court types and courts for your facility
            </p>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : (
            <Tabs defaultValue="court-types" className="space-y-6">
              <TabsList>
                <TabsTrigger value="court-types">Court Types</TabsTrigger>
                <TabsTrigger value="courts">Courts</TabsTrigger>
              </TabsList>

              <TabsContent value="court-types">
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle>Court Types</CardTitle>
                      <CardDescription>
                        Manage different types of courts and their pricing
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-hidden rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {courtTypes.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="py-8 text-center text-gray-500"
                              >
                                No court types found
                              </TableCell>
                            </TableRow>
                          ) : (
                            courtTypes.map((courtType) => (
                              <TableRow key={courtType.id}>
                                <TableCell className="font-medium">
                                  {courtType.id}
                                </TableCell>
                                <TableCell>{courtType.name}</TableCell>
                                <TableCell className="font-medium">
                                  {formatPrice(courtType.price)}
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                      >
                                        <span className="sr-only">
                                          Open menu
                                        </span>
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleEditCourtType(courtType)
                                        }
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="courts">
                <Card>
                  <CardHeader>
                    <div>
                      <CardTitle>Courts</CardTitle>
                      <CardDescription>
                        Manage individual courts and their availability
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-hidden rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {courts.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                className="py-8 text-center text-gray-500"
                              >
                                No courts found
                              </TableCell>
                            </TableRow>
                          ) : (
                            courts.map((court) => (
                              <TableRow key={court.id}>
                                <TableCell className="font-medium">
                                  {court.id}
                                </TableCell>
                                <TableCell>{court.name}</TableCell>
                                <TableCell className="font-mono text-sm">
                                  {court.slug}
                                </TableCell>
                                <TableCell>
                                  {court.master_court_types.name}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      court.is_active ? "default" : "secondary"
                                    }
                                    className={
                                      court.is_active
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }
                                  >
                                    {court.is_active ? "Active" : "Inactive"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                      >
                                        <span className="sr-only">
                                          Open menu
                                        </span>
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() => handleEditCourt(court)}
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* Edit Dialog */}
        <AlertDialog
          open={editDialog.isOpen}
          onOpenChange={(open) =>
            setEditDialog((prev) => ({ ...prev, isOpen: open }))
          }
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Edit {editDialog.type === "court-type" ? "Court Type" : "Court"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Update the{" "}
                {editDialog.type === "court-type" ? "court type" : "court"}{" "}
                information below.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder={
                    editDialog.type === "court-type"
                      ? "Enter court type name"
                      : "Enter court name"
                  }
                />
              </div>
              {editDialog.type === "court-type" && (
                <div>
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    placeholder="Enter price"
                  />
                </div>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={saving}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSaveEdit} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
