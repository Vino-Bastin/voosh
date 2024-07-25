import { createContext, useEffect, useLayoutEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PropType from "prop-types";

import axiosInstance from "../lib/axios";

export const AuthContext = createContext();

const AuthProviders = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // * get the auth token using refresh token
  useEffect(() => {
    const getAuthToken = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.post("/auth/refresh-token");
        if (response.data.accessToken) setToken(response.data.accessToken);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    getAuthToken();
  }, []);

  // * attach the token to the axios instance request headers
  useLayoutEffect(() => {
    if (token) {
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  }, [token]);

  // * refetch the refresh token if axios instance returns 401
  useLayoutEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response?.status === 401 &&
          !error.config.isRetried &&
          error.config.url !== "/auth/refresh-token"
        ) {
          try {
            error.config.isRetried = true;
            const response = await axiosInstance.post("/auth/refresh-token");
            if (response.data.accessToken) {
              setToken(response.data.accessToken);
              error.config.headers[
                "Authorization"
              ] = `Bearer ${response.data.accessToken}`;
              return axiosInstance(error.config);
            }
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);

  if (loading)
    return (
      <div className="w-screen h-screen flex items-center justify-center flex-col gap-2">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        Loading...
      </div>
    );

  return (
    <AuthContext.Provider value={{ token, setToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProviders.propTypes = {
  children: PropType.node.isRequired,
};

export default AuthProviders;
