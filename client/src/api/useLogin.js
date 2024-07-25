import { useMutation } from "@tanstack/react-query";

import axiosInstance from "../lib/axios";

const useLogin = () => {
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/auth/login", data);
      if (!response.data.ok) throw new Error(response.data.message);
      return response.data;
    },
  });

  return mutation;
};

export default useLogin;
