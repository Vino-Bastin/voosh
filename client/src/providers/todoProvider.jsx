import { createContext, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

import useGetTodos from "../api/useGetTodos";

export const TodoContext = createContext();

const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);

  const todoQuery = useGetTodos();
  useEffect(() => {
    if (todoQuery.isSuccess) setTodos(todoQuery.data);
  }, [todoQuery]);

  function resetTodos() {
    setTodos(todoQuery.data || []);
  }

  if (todoQuery.isLoading)
    return (
      <div className="h-[500px] w-full flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <TodoContext.Provider
      value={{
        todos,
        setTodos,
        resetTodos,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

TodoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TodoProvider;
