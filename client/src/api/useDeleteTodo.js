import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../lib/axios";

const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (todoId) => {
      const response = await axiosInstance.delete(`/todos/${todoId}`);
      if (!response.data.ok) throw new Error(response.data.message);
      return response.data.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
      });
    },
  });

  return mutation;
};

export default useDeleteTodo;
