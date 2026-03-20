"use client";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { ActionFnType } from "@/types/actionFnType";

const initialState = {
  errorMessage: "",
  successMessage: "",
};
export default function FormContainer({
  action,
  children,
  border = false,
  onSuccess,
}: {
  action: ActionFnType;
  children: React.ReactNode;
  border?: boolean;
  onSuccess?: () => void;
}) {
  const [state, formAction] = useFormState(action, initialState);
  useEffect(() => {
    if (state.errorMessage) {
      toast.error(state.errorMessage);
    }
    if (state.successMessage) {
      toast.success(state.successMessage);
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className={` ${border ? "border-gray-500 border-[0.5px] border-dotted flex flex-col gap-5 p-5 rounded-md w-full items-stretch" : ""}`}
    >
      {children}
    </form>
  );
}
