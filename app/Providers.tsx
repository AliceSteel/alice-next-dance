"use client";

import { Provider } from "react-redux";
import { makeStore } from "@/store/store";
import { useMemo } from "react";
import type { StoreProps } from "@/types/StoreProps";

export function Providers({ children, preloadedState }: StoreProps) {
  const store = useMemo(() => makeStore(preloadedState), [preloadedState]);
  return <Provider store={store}>{children}</Provider>;
}
