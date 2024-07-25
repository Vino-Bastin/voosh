import { useDrop } from "react-dnd";
import PropTypes from "prop-types";

import useUpdateTodoStatus from "../api/useUpdateTodoStatus";

import Todo from "./todo";

import { cn } from "../lib/utils";

const TodoList = ({ status, headerTitle, todos }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TODO",
    drop: (item) => handleOnDrop(item._id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });
  const updateTodoStatusMutation = useUpdateTodoStatus();

  const handleOnDrop = (itemId) => {
    updateTodoStatusMutation.mutate({
      todoId: itemId,
      data: { status },
    });
  };

  return (
    <div
      ref={drop}
      className={cn(
        "space-y-2 p-3 rounded-sm flex-1 border",
        isOver ? "bg-blue-200" : "bg-white"
      )}
    >
      <div className="text-base uppercase bg-blue-500 font-bold text-white p-2">
        {headerTitle}
      </div>
      {todos.map((todo) => (
        <Todo key={todo._id} {...todo} />
      ))}
    </div>
  );
};

TodoList.propTypes = {
  status: PropTypes.string.isRequired,
  headerTitle: PropTypes.string.isRequired,
  todos: PropTypes.array.isRequired,
};

export default TodoList;
