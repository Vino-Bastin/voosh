import { useContext, useEffect, useState } from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import useOpenNewTodoModal from "../store/useOpenNewTodoModal";
import { TodoContext } from "../providers/todoProvider";

import TodoList from "../components/todoList";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const Todo = () => {
  const [searchKey, setSearchKey] = useState("");
  const [orderBy, setOrderBy] = useState("asc");
  const { todos } = useContext(TodoContext);
  const [filteredTodos, setFilteredTodos] = useState([]);

  useEffect(() => {
    let filteredTodos = todos;
    if (searchKey) {
      filteredTodos = todos.filter((todo) =>
        todo.title.toLowerCase().includes(searchKey.toLowerCase())
      );
    }
    if (orderBy === "desc") {
      filteredTodos = filteredTodos.slice().reverse();
    }
    setFilteredTodos(filteredTodos);
  }, [searchKey, orderBy, todos]);

  const { open } = useOpenNewTodoModal();
  return (
    <div className="max-w-screen-lg mx-auto p-2">
      <Button className="my-3 px-6" variant="secondary" onClick={() => open()}>
        Add Task
      </Button>
      <div className="mb-3 flex sm:items-center gap-2 justify-between flex-col sm:flex-row border p-2">
        <div className="flex items-center gap-2 font-semibold">
          Search:
          <Input
            placeholder="Search Task"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 font-semibold">
          sort by:
          <select
            className="border rounded-md p-1"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
          >
            <option value="asc">Recent First</option>
            <option value="desc">Oldest First</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 flex-col sm:flex-row">
        <DndProvider backend={HTML5Backend}>
          <TodoList
            todos={filteredTodos.filter((todo) => todo.status === "todo")}
            status="todo"
            headerTitle="Todo"
          />
          <TodoList
            todos={filteredTodos.filter(
              (todo) => todo.status === "in-progress"
            )}
            status="in-progress"
            headerTitle="In Progress"
          />
          <TodoList
            todos={filteredTodos.filter((todo) => todo.status === "done")}
            status="done"
            headerTitle="Done"
          />
        </DndProvider>
      </div>
    </div>
  );
};

export default Todo;
