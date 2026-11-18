import { FiCheckCircle } from "react-icons/fi";
import "./SuccessModal.css";

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="success-overlay" onClick={onClose}>
      <div className="success-modal" onClick={(e) => e.stopPropagation()}>
        <FiCheckCircle className="success-icon" />
        <h2 className="success-message">{message}</h2>
        <button className="btn btn-primary" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;