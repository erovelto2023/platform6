import { IBooking } from "@/lib/db/models/Booking";
import { IAvailability } from "@/lib/db/models/Availability";
import { ICalendarService } from "@/lib/db/models/CalendarService";

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface BookingData {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string; // Add this
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  paymentStatus: 'unpaid' | 'paid' | 'refunded'; // Add this
  serviceId: any;
  service?: ServiceData;
  notes?: string;
  internalNotes?: string;
  location?: string; // Add this
  magicLinkToken?: string; // Add this
  createdAt: Date;
}

export interface ServiceData {
  id: string;
  name: string;
  description?: string;
  duration: number; // minutes
  bufferTime: number; // gap minutes
  price: number;
  location?: string;
}

export interface AvailabilityRule {
  dayOfWeek: number; // 0-6
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isActive: boolean;
}

export interface Slot {
  startTime: Date;
  endTime: Date;
  isAvailable: boolean;
}

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
