import { Outlet } from "react-router-dom";

import AuthProvider from "../providers/authProvider";

import { Toaster } from "../components/ui/sonner";
import Navbar from "../components/navbar";
import TodoForm from "../components/todoForm";
import TodoDetails from "../components/todoDetails";

const RootLayout = () => {
  return (
    <AuthProvider>
      <Toaster />
      <TodoForm />
      <TodoDetails />
      <Navbar />
      <Outlet />
    </AuthProvider>
  );
};

export default RootLayout;
