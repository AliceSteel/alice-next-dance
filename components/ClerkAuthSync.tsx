"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/slices/user/userSlice";
import { addToCart } from "@/store/slices/cart/cartSlice";

export default function ClerkAuthSync() {
  const { isLoaded, isSignedIn, user } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      dispatch(
        setUser({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress ?? "",
          name: user.fullName ?? undefined,
          isAdmin: user.publicMetadata?.isAdmin === true, // we set this in Clerk dashboard or via API
        }),
      );
      const pendingRaw = sessionStorage.getItem("pendingCartItem");
      if (pendingRaw) {
        dispatch(addToCart(JSON.parse(pendingRaw)));
        sessionStorage.removeItem("pendingCartItem");
      }
    }
  }, [isLoaded, isSignedIn, user, dispatch]);

  return null;
}
