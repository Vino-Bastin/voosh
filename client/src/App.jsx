import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient();

import RootLayout from "./layout/rootLayout";
import Protected from "./components/protected";
import TodoProvider from "./providers/todoProvider";

import Login from "./page/login";
import Signup from "./page/signup";
import Todo from "./page/todo";

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_O_AUTH_CLIENT_ID}>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route
                index
                element={
                  <Protected>
                    <TodoProvider>
                      <Todo />
                    </TodoProvider>
                  </Protected>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
          </Routes>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
