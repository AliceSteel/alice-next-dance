import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ModalState, ModalType } from "@/types/ModalState";

const initialState: ModalState = {
  isModalOpen: false,
  type: null
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalType>) => {
      state.isModalOpen = true;
      state.type = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.type = null;
      document.body.style.overflow = "auto";
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;


export const selectModalState = (state: { modal: ModalState }) => state.modal as ModalState;