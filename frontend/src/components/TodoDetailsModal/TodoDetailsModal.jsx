import { FiX } from "react-icons/fi";
import {
  formatDate,
  formatDateTime,
  isOverdue,
} from "../../utils/dateUtils";
import "../TodoCard/TodoCard.css"; // reuses the status badge and priority dot styles
import "./TodoDetailsModal.css";

const TodoDetailsModal = ({ todo, onClose }) => {
  const completed = todo.status === "Completed";
  const priority = todo.priority || "Medium";

  return (
    <div className="details-overlay" onClick={onClose}>
      <div className="details-modal" onClick={(e) => e.stopPropagation()}>
        <button className="details-close" onClick={onClose} aria-label="Close">
          <FiX />
        </button>

        <div className="details-head">
          <h2 className="details-title">{todo.title}</h2>
          <span
            className={`status-badge ${
              completed ? "status-completed" : "status-pending"
            }`}
          >
            {todo.status}
          </span>
        </div>

        <p className="details-desc">
          {todo.description || "No description provided."}
        </p>

        <div className="details-row">
          <span className="details-label">Priority</span>
          <span className="details-value">
            <span className={`dot dot-${priority.toLowerCase()}`}></span>{" "}
            {priority}
          </span>
        </div>
        <div className="details-row">
          <span className="details-label">Due date</span>
          <span className={`details-value ${isOverdue(todo) ? "overdue" : ""}`}>
            {formatDate(todo.dueDate)}
            {isOverdue(todo) && " (overdue)"}
          </span>
        </div>
        <div className="details-row">
          <span className="details-label">Created</span>
          <span className="details-value">{formatDateTime(todo.createdAt)}</span>
        </div>
        <div className="details-row">
          <span className="details-label">Last updated</span>
          <span className="details-value">{formatDateTime(todo.updatedAt)}</span>
        </div>

        <button className="btn btn-outline btn-block details-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TodoDetailsModal;