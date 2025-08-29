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
import { BookingDashboard } from "@/types";
import { Edit, Eye, MoreHorizontal } from "lucide-react";
import { Session } from "next-auth";
import { useState } from "react";
import EditBookingModal from "./edit-booking-modal";
import { useRouter } from "next/navigation";

interface BookingDetailProps {
  bookings: BookingDashboard[];
  currentPage: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  session: Session | null;
  onBookingUpdated: () => void;
}

export default function TableUserBooking({
  bookings,
  currentPage,
  hasNextPage,
  onPageChange,
  session,
  onBookingUpdated,
}: BookingDetailProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] =
    useState<BookingDashboard | null>(null);
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
    // Convert to string to extract raw time without timezone conversion
    const timeString = typeof time === "string" ? time : time.toISOString();

    // Extract time portion from ISO string (YYYY-MM-DDTHH:MM:SS.sssZ)
    const timeMatch = timeString.match(/T(\d{2}:\d{2})/);
    if (timeMatch) {
      return timeMatch[1]; // Returns HH:MM format directly from backend
    }

    // Fallback: if it's already in time format
    if (typeof time === "string" && time.match(/^\d{2}:\d{2}/)) {
      return time.substring(0, 5); // Return HH:MM
    }

    // Last fallback
    return String(time).substring(0, 5);
  };

  const handleEdit = (booking: BookingDashboard) => {
    setSelectedBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedBooking(null);
  };

  const handleViewDetails = (booking: BookingDashboard) => {
    router.push(`/user/booking/${booking.uuid}`);
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
                          <DropdownMenuItem onClick={() => handleEdit(booking)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Booking
                          </DropdownMenuItem>
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

      <EditBookingModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        booking={selectedBooking}
        session={session}
        onBookingUpdated={onBookingUpdated}
      />
    </>
  );
}
