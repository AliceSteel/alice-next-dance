import { createSlice, type PayloadAction, createSelector } from "@reduxjs/toolkit";
import type { AuthState, BookingPackage, RootState } from "@/types/User";
import { toast } from "react-toastify";
import type { ScheduleEntry } from "@/types/ScheduleItem";

type ConsumePayload = {
  entry: ScheduleEntry;
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: null,
    status: "idle",
    bookingPackages: [{ id: 'pkg-10-2025-01', numberOfCredits: 10, usedAt: [], expiresAt: "2026-12-31" }],
    availablePackages: [{ id: 'pkg-10-2025-01', numberOfCredits: 10, usedAt: [], expiresAt: "2026-12-31" }],
  } as AuthState,

  reducers: {
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
      state.status = action.payload ? "authenticated" : "idle";
      localStorage.setItem("user", JSON.stringify(action.payload));
      toast.success("Logged in successfully");
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.bookingPackages = [];
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
    },

    addBookingPackage: (state, action: PayloadAction<BookingPackage>) => {
      const pkg = action.payload;
      state.bookingPackages.push(pkg);

      const notExpired = new Date(pkg.expiresAt) >= new Date();
      const hasCreditsLeft = pkg.numberOfCredits > (pkg.usedAt?.length ?? 0);
      // only add to availablePackages if not expired and has credits left:
      if (notExpired && hasCreditsLeft) {
        state.availablePackages?.push(pkg);
      }
    },

    consumeBookingCredit: (state, action: PayloadAction<ConsumePayload>) => {
      const now = new Date();

      // find first non-expired package with remaining credits
      const candidates = (state.availablePackages ?? []).filter(
        (p) =>
          new Date(p.expiresAt) >= now && p.usedAt.length < p.numberOfCredits
      );
      if (candidates.length === 0) {
        toast.error("No available credits for this booking");
        return;
      }
      candidates.sort(
        (a, b) =>
          new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
      );
      const creditPkg = candidates[0];

      const scheduleEntry = action.payload.entry;
      creditPkg.usedAt.push(scheduleEntry); // mark one credit as used for this entry

      // mirror change in bookingPackages
      const pkgIdx = state.bookingPackages.findIndex((p) => p.id === creditPkg.id);
      if (pkgIdx !== -1) {
        state.bookingPackages[pkgIdx].usedAt = creditPkg.usedAt;
      }

      // if fully used or expired, remove from availableBookings
      const fullyUsed =
        creditPkg.usedAt.length >= creditPkg.numberOfCredits ||
        new Date(creditPkg.expiresAt) < now;

      if (fullyUsed) {
        state.availablePackages = (state.availablePackages ?? []).filter(
          (p) => p.id !== creditPkg.id
        );
      }
      toast.success("Class booked using a credit");
    },
  },
});

export const { setUser, clearUser, addBookingPackage, consumeBookingCredit } =
  userSlice.actions;
export default userSlice.reducer;

// SELECTORS
export const selectBookingPackages = (state: RootState) => {
  const now = new Date();
  return state.auth.bookingPackages
    .filter((p) => new Date(p.expiresAt) >= now)
    .reduce(
      (sum, p) => sum + Math.max(p.numberOfCredits - p.usedAt.length, 0),
      0
    );
  }

export const selectAvailableCredits = (state: RootState) => {
  return state.auth.availablePackages;
}
export const selectIsLoggedIn = (state: RootState) =>
  state.auth.status === "authenticated";

export const collectBookingsForUser = createSelector(
  (state: RootState) => state.auth.bookingPackages,
  (bookingPackages) => {
    return bookingPackages.flatMap(pkg => pkg.usedAt.map(e => e.id));
  }
);