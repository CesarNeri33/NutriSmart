// src/Componentes/ModalCard.js
import React from 'react';
import './ModalCard.css';

const ModalCard = ({ isOpen, onClose, children }) => {
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalCard;