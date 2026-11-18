import { useEffect, useRef, useState } from "react";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { formatInputDate, todayString } from "../../utils/dateUtils";
import "./DatePicker.css";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const pad = (n) => String(n).padStart(2, "0");

const DatePicker = ({ id, value, onChange }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const today = todayString();

  // Which month the calendar is showing (the selected date's month, or today's)
  const getView = (v) => {
    if (!v) return { y: currentYear, m: currentMonth };
    const [y, m] = v.split("-").map(Number);
    return { y, m: m - 1 };
  };

  const [open, setOpen] = useState(false);
  const [view, setView] = useState(getView(value));
  const wrapRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = () => {
    if (!open) setView(getView(value));
    setOpen(!open);
  };

  // True when the visible month is the current month (or earlier)
  const atMinMonth =
    view.y < currentYear ||
    (view.y === currentYear && view.m <= currentMonth);

  const changeMonth = (delta) => {
    if (delta < 0 && atMinMonth) return;
    //stops backward navigation when the calendar is already at the earliest allowed month.
    let m = view.m + delta;
    let y = view.y;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setView({ y, m });
  };

  const changeYear = (newYear) => {
    // If we land on the current year, don't allow a month that already passed
    const m =
      newYear === currentYear && view.m < currentMonth ? currentMonth : view.m;
    setView({ y: newYear, m });
  };

  const selectDate = (dateStr) => {
    onChange(dateStr);
    setOpen(false);
  };

  // Build the day cells for the visible month
  const firstDay = new Date(view.y, view.m, 1).getDay();
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Years: from this year to 20 years ahead
  const startYear = Math.min(currentYear, view.y);
  const endYear = Math.max(currentYear + 20, view.y);
  const years = [];
  for (let y = startYear; y <= endYear; y++) years.push(y);

  return (
    <div className="datepicker" ref={wrapRef}>
      <input
        id={id}
        type="text"
        readOnly
        className="form-input datepicker-input"
        placeholder="Pick a date"
        value={formatInputDate(value)}
        onClick={toggle}
      />
      <FiCalendar className="datepicker-icon" />

      {open && (
        <div className="calendar">
          <div className="calendar-header">
            <button
              type="button"
              className="cal-nav"
              onClick={() => changeMonth(-1)}
              disabled={atMinMonth}
              aria-label="Previous month"
            >
              <FiChevronLeft />
            </button>

            <div className="cal-selects">
              <select
                className="cal-select"
                value={view.m}
                onChange={(e) => setView({ ...view, m: Number(e.target.value) })}
                aria-label="Month"
              >
                {MONTHS.map((name, i) => (
                  <option
                    key={name}
                    value={i}
                    disabled={view.y === currentYear && i < currentMonth}
                  >
                    {name}
                  </option>
                ))}
              </select>
              <select
                className="cal-select"
                value={view.y}
                onChange={(e) => changeYear(Number(e.target.value))}
                aria-label="Year"
              >
                {years.map((y) => (
                  <option key={y} value={y} disabled={y < currentYear}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="cal-nav"
              onClick={() => changeMonth(1)}
              aria-label="Next month"
            >
              <FiChevronRight />
            </button>
          </div>

          <div className="cal-grid cal-weekdays">
            {WEEKDAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="cal-grid">
            {/* creates the calendar’s day cells by looping through the cells array. */}
            {cells.map((day, i) => {
              if (day === null) return <span key={`empty-${i}`}></span>;
              const dateStr = `${view.y}-${pad(view.m + 1)}-${pad(day)}`;
              const isPast = dateStr < today;
              const classes = ["cal-day"];
              if (dateStr === value) classes.push("selected");
              else if (dateStr === today) classes.push("today");
              return (
                <button
                  type="button"
                  key={dateStr}
                  className={classes.join(" ")}
                  disabled={isPast}
                  onClick={() => selectDate(dateStr)}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="cal-footer">
            <button
              type="button"
              className="cal-link"
              onClick={() => selectDate(today)}
            >
              Today
            </button>
            <button
              type="button"
              className="cal-link"
              onClick={() => selectDate("")}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;