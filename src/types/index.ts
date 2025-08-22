export type CourtType = {
  id: number;
  name: string;
  price: string;
  created_at?: Date;
  updated_at?: Date;
};

export type Court = {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  master_court_types: CourtType;
  created_at?: Date;
  updated_at?: Date;
  court_type_id?: number;
};

export type Booking = {
  id: number;
  uuid: string;
  created_by_type: string;
  user_id: number;
  court_id: number;
  status: string;
  booking_date: Date;
  start_time: Date;
  end_time: Date;
  cancel_reason: null;
  created_at: Date;
  updated_at: Date;
};

export interface AvailableBooking {
  date: Date;
  court: string;
  price: number;
  available_slots: AvailableSlot[];
}

export interface AvailableSlot {
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface UserData {
  email: string;
  full_name: string;
  role?: string;
}

export interface BookingDashboard {
  id: number;
  uuid: string;
  booking_date: Date;
  start_time: Date;
  end_time: Date;
  status: string;
  court: CourtBooking;
}

export interface CourtBooking {
  name: string;
}

export interface BookingDetail {
  id: number;
  uuid: string;
  created_by_type: string;
  user_id: number;
  court_id: number;
  status: string;
  booking_date: Date;
  start_time: Date;
  end_time: Date;
  cancel_reason: null;
  created_at: Date;
  updated_at: Date;
  details: Details;
  court: Court;
}

export interface CourtBookingDetail {
  name: string;
}

export interface Details {
  id: number;
  booking_id: number;
  name: string;
  total_price: string;
  total_hour: number;
  created_at: Date;
  updated_at: Date;
}
