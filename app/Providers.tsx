"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { useMemo } from "react";
import type { StoreProps } from "@/types/StoreProps";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children, preloadedState }: StoreProps) {
  const store = useMemo(() => makeStore(preloadedState), [preloadedState]);
  return (
    <Provider store={store}>
      {children}
      <ToastContainer position="top-center" />
    </Provider>
  );
}
