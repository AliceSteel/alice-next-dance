"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/slices/cart/cartSlice";

export default function ClearCartOnSuccess({ success }: { success?: string }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (success === "ordercreated") {
      dispatch(clearCart({ showToast: false }));
    }
  }, [dispatch, success]);

  return null;
}
