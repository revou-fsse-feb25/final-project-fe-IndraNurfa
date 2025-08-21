export type CourtType = {
  id: number;
  name: string;
  price: string;
};

export type Court = {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
  master_court_types: CourtType;
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
