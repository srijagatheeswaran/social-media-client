import React from "react";
import "./popup.css";

const Popup = ({ isOpen, config }) => {
    if (!isOpen || !config) return null;

    const { title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel" } = config;

    return (
        <div className="popup-overlay">
            <div className="popup-box">
                {title && <h3>{title}</h3>}
                {message && <p>{message}</p>}
                <div className="popup-actions">
                    <button className="btn cancel" onClick={onCancel}>
                        {cancelText}
                    </button>
                    <button className="btn confirm" onClick={onConfirm}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Popup;
