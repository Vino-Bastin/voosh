import { create } from "zustand";

const useViewTodoDetails = create((set) => ({
  isOpen: false,
  title: "",
  description: "",
  createdAt: "",
  open: (title, description, createdAt) =>
    set({ isOpen: true, title, description, createdAt }),
  close: () =>
    set({ isOpen: false, title: "", description: "", createdAt: "" }),
}));

export default useViewTodoDetails;
