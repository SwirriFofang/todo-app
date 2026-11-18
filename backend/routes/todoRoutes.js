import express from "express";
import {
  getTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Every todo route requires authentication
router.use(protect);

router.route("/").get(getTodos).post(createTodo);
router.route("/:id").get(getTodo).put(updateTodo).delete(deleteTodo);

export default router;