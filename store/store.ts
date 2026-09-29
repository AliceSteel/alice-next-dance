import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/user/userSlice";
import modalReducer from "./slices/modal/modalSlice";
import cartReducer from "./slices/cart/cartSlice";
import classesReducer from "./slices/classes/classesSlice";

const rootReducer = combineReducers({
  auth: userReducer,
  modal: modalReducer,
  cart: cartReducer,
  classes: classesReducer,
});

function getPreloadedAuth() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return undefined;
    const user = JSON.parse(raw);
    return {
      user,
      token: null,
      status: "authenticated",
      bookingPackages: [],
      availablePackages: [],
    };
  } catch {
    return undefined;
  }
}

export function makeStore(preloadedState?: any) {
  const preloadedAuth = getPreloadedAuth();
  const authState = preloadedAuth ? { auth: preloadedAuth } : {};

  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      ...authState,
      ...(preloadedState ?? {}),
    },
  });
}

export type RootState = ReturnType<ReturnType<typeof makeStore>["getState"]>;
export type AppDispatch = ReturnType<typeof makeStore>["dispatch"];
