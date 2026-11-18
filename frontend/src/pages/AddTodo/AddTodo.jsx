import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import TodoForm from "../../components/TodoForm/TodoForm";
import { createTodo } from "../../services/todoService";
import { getErrorMessage } from "../../services/api";

const AddTodo = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setServerError("");
    try {
      await createTodo(values);
      navigate("/tasks");
    } catch (err) {
      setServerError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Link to="/tasks" className="back-link">
        <FiArrowLeft /> Back to tasks
      </Link>
      <div className="page-header">
        <h1 className="page-title">Add todo</h1>
      </div>

      <TodoForm
        initialValues={{
          title: "",
          description: "",
          priority: "",
          status: "Pending",
          dueDate: "",
        }}
        onSubmit={handleSubmit}
        onClose={() => navigate("/tasks")}
        submitLabel="Add todo"
        submittingLabel="Adding..."
        submitting={submitting}
        serverError={serverError}
      />
    </div>
  );
};

export default AddTodo;