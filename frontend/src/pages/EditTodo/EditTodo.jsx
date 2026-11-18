import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import TodoForm from "../../components/TodoForm/TodoForm";
import Loading from "../../components/Loading/Loading";
import { getTodo, updateTodo } from "../../services/todoService";
import { getErrorMessage } from "../../services/api";
import { toDateInput } from "../../utils/dateUtils";
import SuccessModal from "../../components/SuccessModal/SuccessModal";

const EditTodo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadTodo = async () => {
      try {
        setTodo(await getTodo(id));
      } catch (err) {
        setLoadError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    loadTodo();
  }, [id]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setServerError("");
    try {
      await updateTodo(id, values);
      setSaved(true); // show the success popup
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const isCompleted = todo?.status === "Completed";

  return (
    <div>
      <Link to="/tasks" className="back-link">
        <FiArrowLeft /> Back to tasks
      </Link>
      <div className="page-header">
        <h1 className="page-title">Edit todo</h1>
      </div>

      {loading && <Loading text="Loading todo..." />}

      {loadError && <div className="alert alert-error">{loadError}</div>}

      {isCompleted && (
        <div className="alert alert-error">
          This todo is completed and can no longer be edited.
        </div>
      )}

      {todo && !isCompleted && (
        <TodoForm
          initialValues={{
            title: todo.title,
            description: todo.description || "",
            priority: todo.priority || "Medium",
            status: todo.status,
            dueDate: toDateInput(todo.dueDate),
          }}
          onSubmit={handleSubmit}
          onClose={() => navigate("/tasks")}
          submitLabel="Save changes"
          submittingLabel="Saving..."
          submitting={submitting}
          serverError={serverError}
          showStatus
        />
      )}

      {saved && (
        <SuccessModal
          message="Edited successfully"
          onClose={() => navigate("/tasks")}
        />
      )}
    </div>
  );
};

export default EditTodo;