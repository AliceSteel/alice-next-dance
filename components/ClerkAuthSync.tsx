"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/slices/user/userSlice";

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
        }),
      );
    }
  }, [isLoaded, isSignedIn, user, dispatch]);

  return null;
}
