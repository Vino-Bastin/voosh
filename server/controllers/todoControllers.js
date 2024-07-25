const { isValidObjectId } = require("mongoose");
const Todo = require("../schema/todos");

exports.createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { id } = req.user;

    const todo = new Todo({
      title,
      description,
      user: id,
    });
    await todo.save();

    res
      .status(201)
      .json({ ok: true, message: "Todo created successfully", todo });
  } catch (error) {
    console.error("Error occurred in todoControllers.createTodo", error);
    res.status(500).json({ ok: false, message: "Server Error" });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const { title, description } = req.body;
    const { id } = req.user;

    if (!isValidObjectId(todoId))
      return res.status(400).json({
        ok: false,
        message: "Invalid todo Id",
      });

    const todo = await Todo.findOne({
      _id: todoId,
      user: id,
    });
    if (!todo)
      return res.status(404).json({
        ok: false,
        message: "Todo not found",
      });

    todo.title = title;
    todo.description = description;
    await todo.save();

    res
      .status(200)
      .json({ ok: true, message: "Todo updated successfully", todo });
  } catch (error) {
    console.error("Error occurred in todoControllers.updateTodo", error);
  }
};

exports.updateTodoStatus = async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const { status } = req.body;
    const { id } = req.user;

    const validStatus = ["todo", "in-progress", "done"];
    if (!validStatus.includes(status))
      return res.status(400).json({
        ok: false,
        message: "Invalid status",
      });

    if (!isValidObjectId(todoId))
      return res.status(400).json({
        ok: false,
        message: "Invalid todo Id",
      });

    const todo = await Todo.findOne({
      _id: todoId,
      user: id,
    });

    if (!todo)
      return res.status(404).json({
        ok: false,
        message: "Todo not found",
      });

    todo.status = status;
    await todo.save();

    res
      .status(200)
      .json({ ok: true, message: "Todo status updated successfully", todo });
  } catch (error) {
    console.error("Error occurred in todoControllers.updateTodoStatus", error);
    res.status(500).json({ ok: false, message: "Server Error" });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const { id } = req.user;

    if (!isValidObjectId(todoId))
      return res.status(400).json({
        ok: false,
        message: "Invalid todo Id",
      });

    await Todo.deleteOne({
      _id: todoId,
      user: id,
    });

    res.status(200).json({ ok: true, message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error occurred in todoControllers.deleteTodo", error);
    res.status(500).json({ ok: false, message: "Server Error" });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const { id } = req.user;
    const todos = await Todo.find({ user: id }).sort({ createdAt: -1 });

    res.status(200).json({ ok: true, todos });
  } catch (error) {
    console.error("Error occurred in todoControllers.getTodos", error);
    res.status(500).json({ ok: false, message: "Server Error" });
  }
};
