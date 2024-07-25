import { useMutation } from "@tanstack/react-query";

import axiosInstance from "../lib/axios";

const useSignup = () => {
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/auth/register", data);
      return response.data;
    },
  });

  return mutation;
};

export default useSignup;
