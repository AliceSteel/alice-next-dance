"use client";
import { toast } from "react-toastify";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { clearUser } from "@/store/slices/user/userSlice";
import { useDispatch } from "react-redux";

export default function SignOutLink() {
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(clearUser());
    toast.info("Signed out successfully");
  };
  return (
    <SignOutButton>
      <Link href="/" onClick={handleSignOut}>
        Sign Out
      </Link>
    </SignOutButton>
  );
}
