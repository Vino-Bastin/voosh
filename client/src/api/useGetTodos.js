import { useQuery } from "@tanstack/react-query";

import axiosInstance from "../lib/axios";

const useGetTodos = () => {
  const query = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await axiosInstance.get("/todos");
      if (!response.data.ok) throw new Error(response.data.message);
      return response.data.todos;
    },
  });

  return query;
};

export default useGetTodos;
