import {
  createSlice,
  type PayloadAction,
  createSelector,
} from "@reduxjs/toolkit";
import type { AuthState, BookingPackage, RootState } from "@/types/User";
import { toast } from "react-toastify";
import type { ConsumePayload } from "@/types/ScheduleItem";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: null,
    status: "idle",
    bookingPackages: [],
    availablePackages: [],
  } as AuthState,

  reducers: {
    setUser: (state, action: PayloadAction<AuthState["user"]>) => {
      state.user = action.payload;
      state.status = action.payload ? "authenticated" : "idle";
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.bookingPackages = [];
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
    },

    setBookingPackages: (state, action: PayloadAction<BookingPackage[]>) => {
      const now = new Date();
      state.bookingPackages = action.payload;
      state.availablePackages = action.payload.filter(
        (p) =>
          new Date(p.expiresAt) >= now &&
          p.numberOfCredits > (p.usedAt?.length ?? 0),
      );
    },

    consumeBookingCredit: (state, action: PayloadAction<ConsumePayload>) => {
      const now = new Date();

      // find first non-expired package with remaining credits
      const creditPkg = state.bookingPackages.find(
        (p) => p.id === action.payload.passId,
      );
      if (!creditPkg) {
        toast.error("No available credits for this booking");
        return;
      }

      const scheduleEntry = action.payload.entry;
      creditPkg.usedAt.push(scheduleEntry.id); // mark one credit as used for this entry

      // mirror change in bookingPackages
      const pkgIdx = state.bookingPackages.findIndex(
        (p) => p.id === creditPkg.id,
      );
      if (pkgIdx !== -1) {
        state.bookingPackages[pkgIdx].usedAt = creditPkg.usedAt;
      }

      // if fully used or expired, remove from availableBookings
      const fullyUsed =
        creditPkg.usedAt.length >= creditPkg.numberOfCredits ||
        new Date(creditPkg.expiresAt) < now;

      if (fullyUsed) {
        state.availablePackages = (state.availablePackages ?? []).filter(
          (p) => p.id !== creditPkg.id,
        );
      }
      toast.success(
        `Successfully booked ${scheduleEntry.label} with ${scheduleEntry.teacher}`,
      );
    },
  },
});

export const { setUser, clearUser, setBookingPackages, consumeBookingCredit } =
  userSlice.actions;
export default userSlice.reducer;

// SELECTORS
export const selectBookingPackages = (state: RootState) => {
  const now = new Date();
  return state.auth.bookingPackages
    .filter((p) => new Date(p.expiresAt) >= now)
    .reduce(
      (sum, p) => sum + Math.max(p.numberOfCredits - p.usedAt.length, 0),
      0,
    );
};

export const selectAvailableCredits = (state: RootState) => {
  return state.auth.availablePackages;
};
export const selectIsLoggedIn = (state: RootState) =>
  state.auth.status === "authenticated";

export const collectBookingsForUser = createSelector(
  (state: RootState) => state.auth.bookingPackages,
  (bookingPackages) => {
    return bookingPackages.flatMap((pkg) => pkg.usedAt);
  },
);

export const isUserAdmin = (state: RootState) =>
  state.auth.user?.isAdmin === true;
