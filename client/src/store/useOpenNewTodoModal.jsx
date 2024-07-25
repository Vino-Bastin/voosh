import { create } from "zustand";

const useOpenNewTodoModal = create((set) => ({
  isOpen: false,
  id: null,
  title: "",
  description: "",
  open: () => set({ isOpen: true, id: null, title: "", description: "" }),
  close: () => set({ isOpen: false, id: null, title: "", description: "" }),
  openWithTodo: (todo) =>
    set({
      isOpen: true,
      id: todo.id,
      title: todo.title,
      description: todo.description,
    }),
}));

export default useOpenNewTodoModal;
