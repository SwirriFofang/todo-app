import { FiClipboard } from "react-icons/fi";
import TodoCard from "../TodoCard/TodoCard";
import "./TodoList.css";

const TodoList = ({ todos, onComplete, onEdit, onDelete, onView }) => {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <FiClipboard size={28} />
        <p>No task</p>
      </div>
    );
  }

  return (
    <div>
      {todos.map((todo) => (
        <TodoCard
          key={todo._id}
          todo={todo}
          onComplete={onComplete}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
};

export default TodoList;