import moment from "moment";
import useViewTodoDetails from "../store/useViewTodoDetails";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

const TodoDetails = () => {
  const { isOpen, title, description, createdAt, close } = useViewTodoDetails();
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left mb-3">Task Details</DialogTitle>
          <div className="space-y-1 min-h-[200px]">
            <p className="font-semibold text-xl">Title : {title}</p>
            <p className="text-gray-700">Description : {description}</p>
            <p className="text-[12px] text-muted-foreground">
              Created At : {moment(createdAt).format("DD/MM/yyyy HH:mm:ss")}
            </p>
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={close} variant="secondary">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TodoDetails;
