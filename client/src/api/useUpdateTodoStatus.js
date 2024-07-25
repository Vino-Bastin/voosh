import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "../lib/axios";

const useUpdateTodoStatus = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ todoId, data }) => {
      const response = await axiosInstance.put(`/todos/${todoId}/status`, data);
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

export default useUpdateTodoStatus;
