//import { closeModal } from "@/store/slices/modal/modalSlice";
//import type { RootState } from "@/store/store";
//import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { faXmark } from "@fortawesome/free-solid-svg-icons";
//import { useDispatch, useSelector } from "react-redux";

export default function Modal({ children }: { children?: React.ReactNode }) {
  /*  const isModalOpen = useSelector(
    (state: RootState) => state.modal.isModalOpen
  );
  const dispatch = useDispatch();
   */
  let isModalOpen = true; // REMOVE THIS LINE WHEN USING REDUX
  if (!isModalOpen) return null;
  document.body.style.overflow = "hidden";

  const onClose = () => {
    //dispatch(closeModal());
    document.body.style.overflow = "auto";
  };

  return (
    <div className="fixed z-20 inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
      <div
        className="relative bg-[#272727] text-black p-6 rounded-3xl w-4/6 max-w-sm
        transform-gpu opacity-0 shadow-lg shadow-blue-500/60
        motion-safe:animate-[modal-drop-bounce_700ms_ease-out_forwards]
        motion-reduce:opacity-100 motion-reduce:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="float-right hover:cursor-pointer">
          {/*  <FontAwesomeIcon
            icon={faXmark}
            size="lg"
            className="text-white/50 h-4"
          /> */}
          X
        </button>
        {children}
      </div>
    </div>
  );
}
