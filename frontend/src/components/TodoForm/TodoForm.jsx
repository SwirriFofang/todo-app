import { useState } from "react";
import DatePicker from "../DatePicker/DatePicker";
import "./TodoForm.css";
import { todayString } from "../../utils/dateUtils";

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 250;

const TodoForm = ({
    initialValues,
    onSubmit,
    onClose,
    submitLabel,
    submittingLabel,
    submitting,
    serverError,
    showStatus = false,
}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({ ...values, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validate = () => {
        const newErrors = {};
        if (!values.title.trim()) {
            newErrors.title = "Todo title is required.";
        }
        if (!values.priority) {
            newErrors.priority = "Please choose a priority.";
        }
        // Only check the date if the user picked a new one
        // (so editing an old todo doesn't get blocked by its original date)
        if (
            values.dueDate &&
            values.dueDate !== initialValues.dueDate &&
            values.dueDate < todayString()
        ) {
            newErrors.dueDate = "Due date cannot be in the past.";
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSubmit({
            ...values,
            title: values.title.trim(),
            description: values.description.trim(),
        });
    };

    return (
        <form className="form-card" onSubmit={handleSubmit} noValidate>
            {serverError && <div className="alert alert-error">{serverError}</div>}

            <div className="form-group">
                <div className="label-row">
                    <label htmlFor="title" className="form-label">
                        Title
                    </label>
                    <span className="counter">
                        {values.title.length}/{TITLE_MAX}
                    </span>
                </div>
                <input
                    id="title"
                    name="title"
                    type="text"
                    maxLength={TITLE_MAX}
                    className={`form-input ${errors.title ? "invalid" : ""}`}
                    placeholder="Complete React project"
                    value={values.title}
                    onChange={handleChange}
                />
                {errors.title && <p className="field-error">{errors.title}</p>}
            </div>

            <div className="form-group">
                <div className="label-row">
                    <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <span className="counter">
                        {values.description.length}/{DESCRIPTION_MAX}
                    </span>
                </div>
                <textarea
                    id="description"
                    name="description"
                    maxLength={DESCRIPTION_MAX}
                    className="form-input form-textarea"
                    placeholder="Finish the frontend implementation"
                    value={values.description}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="priority" className="form-label">
                    Choose priority
                </label>
                <select
                    id="priority"
                    name="priority"
                    className={`form-input ${errors.priority ? "invalid" : ""}`}
                    value={values.priority}
                    onChange={handleChange}
                >
                    <option value="">Choose priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                </select>
                {errors.priority && <p className="field-error">{errors.priority}</p>}
            </div>

            <div className="form-group">
                <label htmlFor="dueDate" className="form-label">
                    Due date
                </label>
                <DatePicker
                    id="dueDate"
                    value={values.dueDate}
                    onChange={(date) => {
                        setValues({ ...values, dueDate: date });
                        setErrors({ ...errors, dueDate: "" });
                    }}
                />
                {errors.dueDate && <p className="field-error">{errors.dueDate}</p>}
            </div>

            {showStatus && (
                <div className="form-group">
                    <label htmlFor="status" className="form-label">
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        className="form-input"
                        value={values.status}
                        onChange={handleChange}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
            )}

            <div className="form-actions">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                >
                    {submitting ? submittingLabel : submitLabel}
                </button>
                <button
                    type="button"
                    className="btn btn-outline"
                    onClick={onClose}
                    disabled={submitting}
                >
                    Close
                </button>
            </div>
        </form>
    );
};

export default TodoForm;