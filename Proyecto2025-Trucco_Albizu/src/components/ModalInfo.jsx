import React from 'react';

function ModalInfo({ isVisible, message, onClose }) {
    if (!isVisible) return null;

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
                <p className="modal-msg">{message}</p>
                <button className="btn primary" onClick={onClose}>
                    Aceptar
                </button>
            </div>
        </div>
    );
}

export default ModalInfo;

