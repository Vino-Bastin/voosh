import { useContext } from "react";
import { NotepadText } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

import { AuthContext } from "../providers/authProvider";
import useLogout from "../api/useLogout";

import { Button } from "./ui/button";

const Navbar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { token, setToken } = useContext(AuthContext);
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate("", {
      onSuccess: () => {
        setToken(null);
      },
    });
  };

  return (
    <nav className="bg-blue-500">
      <div className="max-w-screen-lg mx-auto px-2 py-3 flex items-center justify-between">
        <NotepadText
          className="text-white size-8"
          onClick={() => navigate("/")}
        />
        {token ? (
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <div>
            <Button
              variant={pathname === "/login" ? "primary" : "secondary"}
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              className="ml-5"
              variant={pathname === "/signup" ? "primary" : "secondary"}
              onClick={() => navigate("/signup")}
            >
              Signup
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
