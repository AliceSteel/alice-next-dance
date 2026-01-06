export type ModalType = "login" | "membership" | 'purchase' | 'basket' | null;

export type ModalState = {
  isModalOpen: boolean;
  type: ModalType;
};
