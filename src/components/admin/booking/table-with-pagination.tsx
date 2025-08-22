import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
import { Booking } from "@/types";

// const products = [
//   {
//     id: 101,
//     name: "Wireless Headphones",
//     category: "Electronics",
//     price: 59.99,
//     rating: 4.5,
//   },
//   {
//     id: 102,
//     name: "Yoga Mat",
//     category: "Sports & Fitness",
//     price: 25.0,
//     rating: 4.8,
//   },
//   {
//     id: 103,
//     name: "Coffee Maker",
//     category: "Home Appliances",
//     price: 80.0,
//     rating: 4.2,
//   },
//   {
//     id: 104,
//     name: "Running Shoes",
//     category: "Sportswear",
//     price: 70.0,
//     rating: 4.6,
//   },
//   {
//     id: 105,
//     name: "Smartwatch",
//     category: "Electronics",
//     price: 120.0,
//     rating: 4.7,
//   },
//   {
//     id: 106,
//     name: "Bluetooth Speaker",
//     category: "Electronics",
//     price: 45.5,
//     rating: 4.4,
//   },
//   {
//     id: 107,
//     name: "Electric Kettle",
//     category: "Home Appliances",
//     price: 30.0,
//     rating: 4.1,
//   },
//   {
//     id: 108,
//     name: "Dumbbell Set",
//     category: "Sports & Fitness",
//     price: 55.0,
//     rating: 4.6,
//   },
//   {
//     id: 109,
//     name: "Fitness Tracker",
//     category: "Electronics",
//     price: 65.0,
//     rating: 4.3,
//   },
//   {
//     id: 110,
//     name: "Air Fryer",
//     category: "Home Appliances",
//     price: 95.0,
//     rating: 4.5,
//   },
//   {
//     id: 111,
//     name: "Tennis Racket",
//     category: "Sports & Fitness",
//     price: 60.0,
//     rating: 4.2,
//   },
//   {
//     id: 112,
//     name: "LED Monitor",
//     category: "Electronics",
//     price: 150.0,
//     rating: 4.6,
//   },
//   {
//     id: 113,
//     name: "Electric Toothbrush",
//     category: "Home Appliances",
//     price: 40.0,
//     rating: 4.4,
//   },
//   {
//     id: 114,
//     name: "Gym Bag",
//     category: "Sportswear",
//     price: 35.0,
//     rating: 4.3,
//   },
//   {
//     id: 115,
//     name: "Smart Light Bulb",
//     category: "Electronics",
//     price: 18.99,
//     rating: 4.1,
//   },
// ];

interface BookingDetailProps {
  bookings: Booking[];
}

export default function TableAdminBooking({ bookings }: BookingDetailProps) {
  return (
    <div className="w-full">
      <div className="w-full overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Court</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id} className="odd:bg-muted/50">
                <TableCell className="pl-4">{booking.uuid}</TableCell>
                <TableCell className="font-medium">
                  {booking.created_by_type}
                </TableCell>
                <TableCell>{booking.court_id}</TableCell>
                <TableCell>
                  {booking.booking_date.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {booking.start_time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -
                  {booking.end_time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
