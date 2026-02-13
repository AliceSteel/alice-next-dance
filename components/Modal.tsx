import { closeModal } from "@/store/slices/modal/modalSlice";
import type { RootState } from "@/store/store";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { XmarkOutlined } from "@lineiconshq/free-icons";
import { useDispatch, useSelector } from "react-redux";

export default function Modal({ children }: { children?: React.ReactNode }) {
  const isModalOpen = useSelector(
    (state: RootState) => state.modal.isModalOpen,
  );
  const dispatch = useDispatch();

  if (!isModalOpen) return null;
  document.body.style.overflow = "hidden";

  const onClose = () => {
    dispatch(closeModal());
    document.body.style.overflow = "auto";
  };

  return (
    <div className="fixed z-20 inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
      <div
        className="relative bg-[#272727] text-black rounded-3xl w-4/6 max-w-sm
        transform-gpu opacity-0 shadow-lg shadow-blue-500/60
        motion-safe:animate-[modal-drop-bounce_700ms_ease-out_forwards]
        motion-reduce:opacity-100 motion-reduce:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-20 hover:cursor-pointer"
        >
          <Lineicons icon={XmarkOutlined} size={20} className="text-white/50" />
        </button>
        {children}
      </div>
    </div>
  );
}
