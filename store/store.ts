import { configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/user/userSlice';
import modalReducer from './slices/modal/modalSlice';
import cartReducer from './slices/cart/cartSlice';
import classesReducer from './slices/classes/classesSlice';

const preloadedAuth = (() => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return undefined;
    const user = JSON.parse(raw);
    return {
      user,
      token: null,
      status: "authenticated",
      bookingPackages: [{ id: 'pkg-10-2025-01', numberOfCredits: 10, usedAt: [], expiresAt: "2026-12-31" }],
      availablePackages: [{ id: 'pkg-10-2025-01', numberOfCredits: 10, usedAt: [], expiresAt: "2026-12-31" }],
    };
  } catch {
    return undefined;
  }
})();

export const store = configureStore({
  reducer: {
    auth: userReducer,
    modal: modalReducer,
    cart: cartReducer,
    classes: classesReducer
  },
  preloadedState: preloadedAuth ? { auth: preloadedAuth } : undefined,
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;