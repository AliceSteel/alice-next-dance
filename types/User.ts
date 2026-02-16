import type { ScheduleEntry } from "./ScheduleItem";

export type User = { 
    id: string; 
    email: string; 
    name?: string 
    isAdmin?:boolean
};
export type AuthState = {
  user: User | null;
  token: string | null;
  status: 'idle' | 'authenticating' | 'authenticated' | 'error';
  bookingPackages: BookingPackage[];
  availablePackages?: BookingPackage[];
};

export type BookingPackage = {
  id: string;   // e.g. "pkg-10-2025-01"
  numberOfCredits: number;            // 5 | 10 | 20
  usedAt: ScheduleEntry[];    // how many already used
  expiresAt: string;       // ISO date string "2025-12-31"
};

export type RootState = {
  auth: AuthState; 
}; 