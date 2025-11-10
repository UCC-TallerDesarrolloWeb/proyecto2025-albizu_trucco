import React from 'react';
import Button from '@components/componente generico/Button';

function ModalInfo({ isVisible, message, onClose }) {
    if (!isVisible) return null;

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
                <p className="modal-msg">{message}</p>
                <Button variant="primary" onClick={onClose}>
                    Aceptar
                </Button>
            </div>
        </div>
    );
}

export default ModalInfo;

