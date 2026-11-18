//pad(n) converts a number to text and adds a leading zero if it has only one digit
const pad = (n) => String(n).padStart(2, "0");

// Today as "YYYY-MM-DD"
export const todayString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// "2026-08-25T00:00:00.000Z" -> "25 Aug 2026",ISO date string
export const formatDate = (iso) => {
  if (!iso) return "No due date";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

// "2026-08-25T00:00:00.000Z" -> "2026-08-25"
export const toDateInput = (iso) => (iso ? iso.slice(0, 10) : "");

// "2026-08-25" -> "25/08/2026"
export const formatInputDate = (value) => {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
};

// A pending todo whose due date has passed
export const isOverdue = (todo) =>
  todo.status === "Pending" &&
  !!todo.dueDate &&
  toDateInput(todo.dueDate) < todayString();

  // "2026-11-04T10:30:00.000Z" -> "04 Nov 2026, 10:30"
export const formatDateTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};