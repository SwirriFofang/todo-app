import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Home.css";

import { useEffect, useState } from "react";
import { Link, } from "react-router-dom";
import { FiArrowRight, FiZap } from "react-icons/fi";

import { getTodos } from "../../services/todoService";
import { getErrorMessage } from "../../services/api";
import TodoList from "../../components/TodoList/TodoList";
import Loading from "../../components/Loading/Loading";

import TodoDetailsModal from "../../components/TodoDetailsModal/TodoDetailsModal";

const CARDS = [
  { key: "Total", label: "Total tasks", className: "stat-total" },
  { key: "Active", label: "Active", className: "stat-active" },
  { key: "Completed", label: "Completed", className: "stat-completed" },
];

const PANEL_TITLES = {
  Total: "All tasks",
  Active: "Active tasks",
  Completed: "Completed tasks",
};

const Home = () => {
  const { user } = useAuth();
  const { state } = useLocation();

  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(null); // null | "Total" | "Active" | "Completed"

  const [selectedTodo, setSelectedTodo] = useState(null);

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

  const firstName = user.name.split(" ")[0];
  const isNewUser = state?.welcome === "new";

  // "Active" in the UI means "Pending" in the database
  const activeTodos = todos.filter((t) => t.status === "Pending");
  const completedTodos = todos.filter((t) => t.status === "Completed");

  const counts = {
    Total: todos.length,
    Active: activeTodos.length,
    Completed: completedTodos.length,
  };

  const completionRate = todos.length
    ? Math.round((completedTodos.length / todos.length) * 100)
    : 0;

  const visibleTodos =
    filter === "Total"
      ? todos
      : filter === "Active"
        ? activeTodos
        : completedTodos;

  return (
    <div>
      <h1 className="welcome">
        {isNewUser ? "Welcome" : "Welcome back"} {firstName}
      </h1>

      <div className="hero">
        <div>
          <h2 className="hero-title">My todo list</h2>
          <p className="hero-sub">
            {counts.Active === 0
              ? "You have no active tasks to complete today"
              : `You have ${counts.Active} active task${counts.Active === 1 ? "" : "s"
              } to complete today`}
          </p>
        </div>
        <Link to="/tasks" className="btn btn-blue">
          View tasks <FiArrowRight />
        </Link>
      </div>

      {loading && <Loading text="Loading your todos..." />}

      {error && (
        <div className="alert alert-error">
          {error}{" "}
          <button className="retry" onClick={loadTodos}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="stats">
            {CARDS.map((card) => (
              <button
                key={card.key}
                type="button"
                className={`stat-card ${card.className} ${filter === card.key ? "selected" : ""
                  }`}
                onClick={() => setFilter(card.key)}
              >
                <span className="stat-label">{card.label}</span>
                <span className="stat-number">{counts[card.key]}</span>
              </button>
            ))}

            <div className="stat-card stat-rate">
              <span className="stat-label">Completion rate</span>
              <span className="stat-number">{completionRate}%</span>
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="panel">
            {filter ? (
              <>
                <div className="panel-header">
                  <h3>{PANEL_TITLES[filter]}</h3>
                  <button className="retry" onClick={() => setFilter(null)}>
                    Clear
                  </button>
                </div>
                <TodoList todos={visibleTodos} onView={setSelectedTodo} />
              </>
            ) : (
              <p className="panel-hint">
                Select a card above to see your tasks.
              </p>
            )}
          </div>
        </>
      )}

      <div className="quote">
        <div className="quote-icon">
          <FiZap />
        </div>
        <div>
          <p className="quote-label">Takeaway</p>
          <p className="quote-text">
            LUCK IS WHEN OPPORTUNITY MEETS PREPARATION
          </p>
        </div>
      </div>
      {selectedTodo && (
        <TodoDetailsModal
          todo={selectedTodo}
          onClose={() => setSelectedTodo(null)}
        />
      )}
    </div>
  );
};

export default Home;