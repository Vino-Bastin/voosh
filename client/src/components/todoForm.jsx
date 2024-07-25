import useOpenNewTodoModal from "../store/useOpenNewTodoModal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import useCreateTodo from "../api/useCreateTodo";
import useUpdateTodo from "../api/useUpdateTodo";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useEffect } from "react";

const todoSchema = z.object({
  title: z.string().min(1, "Please enter a title"),
  description: z.string().min(1, "Please enter a description"),
});

const TodoForm = () => {
  const form = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });
  const { isOpen, close, id, title, description } = useOpenNewTodoModal();
  const newTodoMutation = useCreateTodo();
  const updateMutation = useUpdateTodo();

  useEffect(() => {
    if (isOpen) {
      form.reset({ title, description });
    }
  }, [title, isOpen, description, form]);

  const handleSubmit = (data) => {
    if (id) {
      updateMutation.mutate(
        { todoId: id, data },
        {
          onSuccess: () => {
            form.reset();
            toast.success("Todo updated successfully");
            close();
          },
          onError: () => {
            toast.error("Failed to update todo");
          },
        }
      );
    } else {
      newTodoMutation.mutate(data, {
        onSuccess: () => {
          form.reset();
          toast.success("New Todo added");
          close();
        },
        onError: () => {
          toast.error("Failed to create a new todo");
        },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left mb-3">
            {id ? "Update Task" : "Add Task"}
          </DialogTitle>
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(handleSubmit)}
            >
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="text" placeholder="Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea placeholder="Task Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end items-center gap-2">
                <Button type="submit" className="bg-blue-500">
                  {id ? "Update Task" : "Add Task"}
                </Button>
                <Button type="reset" onClick={close} className="bg-gray-400">
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default TodoForm;
