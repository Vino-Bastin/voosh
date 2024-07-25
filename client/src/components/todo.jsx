import moment from "moment";
import { useDrag } from "react-dnd";
import { toast } from "sonner";
import PropTypes from "prop-types";

import useDeleteTodo from "../api/useDeleteTodo";
import useViewTodoDetails from "../store/useViewTodoDetails";
import useOpenNewTodoModal from "../store/useOpenNewTodoModal";

import { Badge } from "./ui/badge";

import { cn } from "../lib/utils";

const Todo = ({ title, description, createAt, _id }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TODO",
    item: { _id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });
  const deleteMutation = useDeleteTodo();
  const { open } = useViewTodoDetails();
  const { openWithTodo } = useOpenNewTodoModal();

  const handleDelete = () =>
    deleteMutation.mutate(_id, {
      onSuccess: () => {
        toast.success("Todo deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete todo");
      },
    });

  const handleEdit = () =>
    openWithTodo({
      id: _id,
      title,
      description,
    });
  const handleViewDetails = () => open(title, description, createAt);

  return (
    <div
      ref={drag}
      className={cn(
        "rounded-sm bg-blue-300 cursor-grab p-2",
        isDragging ? "opacity-50" : "opacity-100"
      )}
    >
      <p className="font-bold text-xl">{title}</p>
      <p className="min-h-[60px] overflow-hidden text-gray-700">
        {description}
      </p>
      <p className="text-[12px] text-muted-foreground">
        Create at: {moment(createAt).format("MM/DD/yyy hh:mm:ss")}
      </p>
      <div className="flex mt-2 justify-end gap-2 items-center">
        <Badge
          className="rounded-sm cursor-pointer font-normal bg-red-500"
          onClick={handleDelete}
        >
          Delete
        </Badge>
        <Badge
          className="rounded-sm cursor-pointer font-normal bg-blue-400"
          onClick={handleEdit}
        >
          Edit
        </Badge>
        <Badge
          className="rounded-sm cursor-pointer font-normal bg-blue-700"
          onClick={handleViewDetails}
        >
          View Details
        </Badge>
      </div>
    </div>
  );
};

Todo.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  createAt: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
};

export default Todo;
