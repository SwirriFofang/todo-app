import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./PasswordInput.css";

const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  placeholder,
  invalid = false,
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="password-wrap">
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        className={`form-input password-input ${invalid ? "invalid" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setShow(!show)}
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
};

export default PasswordInput;