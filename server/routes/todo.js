const express = require("express");

const todoControllers = require("../controllers/todoControllers");
const useAuth = require("../middlewares/auth/userAuth");

const router = express.Router();

router.use(useAuth.accessToken);
router.post("/", todoControllers.createTodo);
router.put("/:todoId", todoControllers.updateTodo);
router.put("/:todoId/status", todoControllers.updateTodoStatus);
router.delete("/:todoId", todoControllers.deleteTodo);
router.get("/", todoControllers.getTodos);

module.exports = router;
