import mongoose from "mongoose";
import Todo from "../models/Todo.js";


// A due date is "in the past" if it is before yesterday (UTC).
// The one-day cushion avoids rejecting valid dates because of time zones.
const isPastDate = (value) => {
  const limit = new Date();
  limit.setUTCHours(0, 0, 0, 0);
  limit.setUTCDate(limit.getUTCDate() - 1);
  return new Date(value) < limit;
};

// GET /api/todos?status=Pending|Completed (status is optional)
export const getTodos = async (req, res) => {
  try {
    const filter = { user: req.user._id };
    if (req.query.status && ["Pending", "Completed"].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    const todos = await Todo.find(filter).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// GET /api/todos/:id
export const getTodo = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Todo not found in yam." });
    }

    // Ownership check: the todo must belong to the logged-in user
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// POST /api/todos
export const createTodo = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Todo title is required." });
    }
    if (title.length > 60) {
      return res
        .status(400)
        .json({ message: "Title cannot be more than 60 characters." });
    }
    if (description && description.length > 250) {
      return res
        .status(400)
        .json({ message: "Description cannot be more than 250 characters." });
    }
    if (priority && !["High", "Medium", "Low"].includes(priority)) {
      return res.status(400).json({ message: "Invalid priority." });
    }

    if (dueDate) {
      if (isNaN(new Date(dueDate))) {
        return res.status(400).json({ message: "Invalid due date." });
      }
      if (isPastDate(dueDate)) {
        return res
          .status(400)
          .json({ message: "Due date cannot be in the past." });
      }
    }

    const todo = await Todo.create({
      title,
      description,
      status,
      priority: priority || undefined,
      dueDate: dueDate || undefined,
      user: req.user._id,
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// PUT /api/todos/:id
export const updateTodo = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Todo not found." });
    }
      // Ownership check: the todo must belong to the logged-in user(create a server-side check to ensure 
      // that the user making the request is the owner of the 
      // todo item being updated. This prevents unauthorized users from modifying todos that do not belong to them.)
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    const { title, description, status, priority, dueDate } = req.body;

    // A completed todo is locked and cannot be edited again
    if (todo.status === "Completed") {
      return res
        .status(400)
        .json({ message: "Completed todos cannot be edited." });
    }

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: "Todo title is required." });
      }
      if (title.length > 60) {
        return res
          .status(400)
          .json({ message: "Title cannot be more than 60 characters." });
      }
      todo.title = title;
    }
    if (description !== undefined) {
      if (description.length > 250) {
        return res
          .status(400)
          .json({ message: "Description cannot be more than 250 characters." });
      }
      todo.description = description;
    }
    if (status !== undefined) {
      if (!["Pending", "Completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status." });
      }
      todo.status = status;
    }
    if (priority !== undefined) {
      if (!["High", "Medium", "Low"].includes(priority)) {
        return res.status(400).json({ message: "Invalid priority." });
      }
      todo.priority = priority;
    }

    if (dueDate !== undefined) {
      if (dueDate) {
        if (isNaN(new Date(dueDate))) {
          return res.status(400).json({ message: "Invalid due date." });
        }
        // Only check when the date is actually being changed
        const changed =
          !todo.dueDate ||
          new Date(dueDate).getTime() !== todo.dueDate.getTime();
        if (changed && isPastDate(dueDate)) {
          return res
            .status(400)
            .json({ message: "Due date cannot be in the past." });
        }
        todo.dueDate = dueDate;
      } else {
        todo.dueDate = undefined;
      }
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

// DELETE /api/todos/:id
export const deleteTodo = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Todo not found." });
    }

    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!todo) {
      return res.status(404).json({ message: "Todo not found." });
    }

    res.json({ message: "Todo deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};