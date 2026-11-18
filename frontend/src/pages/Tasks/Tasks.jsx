import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import {
  getTodos,
  updateTodo,
  deleteTodo,
} from "../../services/todoService";
import { getErrorMessage } from "../../services/api";
import TodoList from "../../components/TodoList/TodoList";
import Loading from "../../components/Loading/Loading";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import "./Tasks.css";

const FILTERS = ["All", "Pending", "Completed"];

const Tasks = () => {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [filter, setFilter] = useState("All");
  const [todoToDelete, setTodoToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadTodos = async () => {
    setLoading(true);
    setError("");
    try {
      setTodos(await getTodos());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleComplete = async (todo) => {
    setActionError("");
    try {
      const updated = await updateTodo(todo._id, { status: "Completed" });
      setTodos(todos.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setActionError("");
    try {
      await deleteTodo(todoToDelete._id);
      setTodos(todos.filter((t) => t._id !== todoToDelete._id));
      setTodoToDelete(null);
    } catch (err) {
      setActionError(getErrorMessage(err));
      setTodoToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const countFor = (name) =>
    name === "All" ? todos.length : todos.filter((t) => t.status === name).length;

  const visibleTodos =
    filter === "All" ? todos : todos.filter((t) => t.status === filter);

  return (
    <div>
      <Link to="/" className="back-link">
        ← Back to home
      </Link>

      <div className="page-header">
        <h1 className="page-title">My tasks</h1>
        <Link to="/todos/new" className="btn btn-primary">
          <FiPlus /> Add todo
        </Link>
      </div>

      <div className="filter-tabs">
        {FILTERS.map((name) => (
          <button
            key={name}
            className={`filter-tab ${filter === name ? "active" : ""}`}
            onClick={() => setFilter(name)}
          >
            {name} ({countFor(name)})
          </button>
        ))}
      </div>

      {actionError && <div className="alert alert-error">{actionError}</div>}

      {loading && <Loading text="Loading your todos..." />}

      {error && (
        <div className="alert alert-error">
          {error}{" "}
          <button className="link-btn" onClick={loadTodos}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <TodoList
          todos={visibleTodos}
          onComplete={handleComplete}
          onEdit={(todo) => navigate(`/todos/${todo._id}/edit`)}
          onDelete={(todo) => setTodoToDelete(todo)}
        />
      )}

      {todoToDelete && (
        <ConfirmModal
          title="Delete todo"
          message="Are you sure you want to delete this todo?"
          loading={deleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setTodoToDelete(null)}
        />
      )}
    </div>
  );
};

export default Tasks;