import { useMutation } from "@tanstack/react-query";

import axiosInstance from "../lib/axios";

const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      await axiosInstance.post("/auth/logout");
    },
  });
};

export default useLogout;
