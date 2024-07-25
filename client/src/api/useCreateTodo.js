import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../lib/axios";

const useCreateTodo = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/todos", data);
      if (!response.data.ok) throw new Error(response.data.message);
      return response.data.todo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });

  return mutation;
};

export default useCreateTodo;
