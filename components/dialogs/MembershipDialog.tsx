"use client";

import { useDispatch } from "react-redux";
import AppButton from "@/components/formElements/Btn";
import { closeModal } from "@/store/slices/modal/modalSlice";

export default function MembershipDialog() {
  const dispatch = useDispatch();

  const handleGoToMembership = () => {
    const el = document.getElementById("membership-options");

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    dispatch(closeModal());
  };

  return (
    <div className="space-y-4 bg-white/50 rounded-lg p-2">
      <p className="pr-8">
        You don&apos;t have any credits or membership left. Please purchase a
        membership:
      </p>
      <AppButton
        label="View membership options"
        to="#membership-options"
        onClick={handleGoToMembership}
      />
    </div>
  );
}
