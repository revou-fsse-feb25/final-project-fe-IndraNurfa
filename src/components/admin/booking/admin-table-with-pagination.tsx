"use client";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createApiClient } from "@/lib/api";
import { BookingDashboard } from "@/types";
import { Check, Eye, MoreHorizontal, X } from "lucide-react";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface AdminBookingTableProps {
  bookings: BookingDashboard[];
  currentPage: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  session: Session | null;
  onBookingUpdated: () => void;
}

export default function AdminTableWithPagination({
  bookings,
  currentPage,
  hasNextPage,
  onPageChange,
  session,
  onBookingUpdated,
}: AdminBookingTableProps) {
  const [loadingActions, setLoadingActions] = useState<{
    [key: string]: boolean;
  }>({});
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: "confirm" | "cancel" | null;
    booking: BookingDashboard | null;
  }>({
    isOpen: false,
    type: null,
    booking: null,
  });
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    const statusColors = {
      CONFIRMED: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      CANCELED: "bg-red-100 text-red-800",
    };
    return (
      <Badge
        className={
          statusColors[status as keyof typeof statusColors] ||
          "bg-gray-100 text-gray-800"
        }
      >
        {status}
      </Badge>
    );
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (time: Date | string) => {
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleConfirmBooking = async (booking: BookingDashboard) => {
    if (!session) {
      toast.error("Session expired. Please login again.");
      return;
    }

    // Open confirmation dialog
    setConfirmDialog({
      isOpen: true,
      type: "confirm",
      booking,
    });
  };

  const handleCancelBooking = async (booking: BookingDashboard) => {
    if (!session) {
      toast.error("Session expired. Please login again.");
      return;
    }

    // Open confirmation dialog
    setConfirmDialog({
      isOpen: true,
      type: "cancel",
      booking,
    });
  };

  const executeBookingAction = async () => {
    if (!confirmDialog.booking || !confirmDialog.type || !session) return;

    const { booking, type } = confirmDialog;
    const actionKey = `${type}-${booking.uuid}`;

    setLoadingActions((prev) => ({ ...prev, [actionKey]: true }));
    setConfirmDialog({ isOpen: false, type: null, booking: null });

    try {
      const client = createApiClient(session);
      const endpoint =
        type === "confirm"
          ? `/bookings/confirm/${booking.uuid}`
          : `/bookings/cancel/${booking.uuid}`;

      await client.patch(endpoint);

      toast.success(
        `Booking ${type === "confirm" ? "confirmed" : "canceled"} successfully`,
      );
      onBookingUpdated();
    } catch (error: unknown) {
      console.error(
        `Error ${type === "confirm" ? "confirming" : "canceling"} booking:`,
        error,
      );

      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (axiosError.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (axiosError.response?.status === 404) {
        toast.error("Booking not found");
      } else {
        toast.error(
          axiosError.response?.data?.message || `Failed to ${type} booking`,
        );
      }
    } finally {
      setLoadingActions((prev) => ({ ...prev, [actionKey]: false }));
    }
  };

  const handleViewDetails = (booking: BookingDashboard) => {
    router.push(`/admin/booking/${booking.uuid}`);
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Booking ID</TableHead>
              <TableHead className="text-center">Court</TableHead>
              <TableHead className="text-center">Date</TableHead>
              <TableHead className="text-center">Time</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-gray-500"
                >
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="text-center font-medium">
                    #{booking.uuid}
                  </TableCell>
                  <TableCell className="text-center">
                    Court {booking.court.name}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatDate(booking.booking_date)}
                  </TableCell>
                  <TableCell className="text-center">
                    {formatTime(booking.start_time)} -{" "}
                    {formatTime(booking.end_time)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(booking.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(booking)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {booking.status === "PENDING" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleConfirmBooking(booking)}
                              disabled={
                                loadingActions[`confirm-${booking.uuid}`]
                              }
                            >
                              <Check className="mr-2 h-4 w-4" />
                              {loadingActions[`confirm-${booking.uuid}`]
                                ? "Confirming..."
                                : "Confirm Booking"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCancelBooking(booking)}
                              disabled={
                                loadingActions[`cancel-${booking.uuid}`]
                              }
                            >
                              <X className="mr-2 h-4 w-4" />
                              {loadingActions[`cancel-${booking.uuid}`]
                                ? "Canceling..."
                                : "Cancel Booking"}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {(currentPage > 1 || hasNextPage) && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) onPageChange(currentPage - 1);
                }}
                className={
                  currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink href="#" isActive>
                {currentPage}
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (hasNextPage) onPageChange(currentPage + 1);
                }}
                className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <AlertDialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) =>
          !open &&
          setConfirmDialog({ isOpen: false, type: null, booking: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === "confirm"
                ? "Confirm Booking"
                : "Cancel Booking"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === "confirm"
                ? "Are you sure you want to confirm this booking?"
                : "Are you sure you want to cancel this booking? This action cannot be undone."}
              {confirmDialog.booking && (
                <div className="mt-4 space-y-2 text-sm">
                  <div>
                    <strong>Booking ID:</strong> {confirmDialog.booking.uuid}
                  </div>
                  <div>
                    <strong>Court:</strong> {confirmDialog.booking.court.name}
                  </div>
                  <div>
                    <strong>Date:</strong>{" "}
                    {formatDate(confirmDialog.booking.booking_date)}
                  </div>
                  <div>
                    <strong>Time:</strong>{" "}
                    {formatTime(confirmDialog.booking.start_time)} -{" "}
                    {formatTime(confirmDialog.booking.end_time)}
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeBookingAction}
              className={
                confirmDialog.type === "confirm"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {confirmDialog.type === "confirm"
                ? "Confirm Booking"
                : "Cancel Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
