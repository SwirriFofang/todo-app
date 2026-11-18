import {
  FiCalendar,
  FiCheck,
  FiEdit2,
  FiEye,
  FiTrash2,
} from "react-icons/fi";
import { formatDate, isOverdue } from "../../utils/dateUtils";
import "./TodoCard.css";

const TodoCard = ({ todo, onComplete, onEdit, onDelete, onView }) => {
  const completed = todo.status === "Completed";
  const overdue = isOverdue(todo);
  const priority = todo.priority || "Medium";
  const hasActions = onComplete || onEdit || onDelete || onView;

  return (
    <div
      className={`todo-card ${completed ? "is-completed" : ""} ${
        onView ? "compact" : ""
      }`}
    >
      <div className="todo-top">
        <h3 className="todo-title">{todo.title}</h3>
        <span
          className={`status-badge ${
            completed ? "status-completed" : "status-pending"
          }`}
        >
          {todo.status}
        </span>
      </div>

      {todo.description && <p className="todo-desc">{todo.description}</p>}

      <div className="todo-meta">
        <span className={`todo-date ${overdue ? "overdue" : ""}`}>
          <FiCalendar /> {formatDate(todo.dueDate)}
          {overdue && " (overdue)"}
        </span>
        <span className="priority">
          <span className={`dot dot-${priority.toLowerCase()}`}></span>
          {priority} priority
        </span>
      </div>

      {hasActions && (
        <div className="todo-actions">
          {onView && (
            <button className="action-btn" onClick={() => onView(todo)}>
              <FiEye /> View more
            </button>
          )}
          {!completed && onComplete && (
            <button className="action-btn" onClick={() => onComplete(todo)}>
              <FiCheck /> Mark as completed
            </button>
          )}
          {!completed && onEdit && (
            <button className="action-btn" onClick={() => onEdit(todo)}>
              <FiEdit2 /> Edit
            </button>
          )}
          {onDelete && (
            <button
              className="action-btn danger"
              onClick={() => onDelete(todo)}
            >
              <FiTrash2 /> Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoCard;