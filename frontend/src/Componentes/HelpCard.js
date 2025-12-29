//src/Componentes/HelpPage.js

import React from 'react';
import './HelpCard.css';

const HelpCard = ({
    title,
    content,
    type,
    isOpen,
    onToggle
}) => {
    return (
        <div className={`help-card help-${type}`}>
            <div className="help-card-header" onClick={onToggle}>
                <span className="help-card-title">{title}</span>

                <button className="help-card-toggle">
                    {isOpen ? '−' : '+'}
                </button>
            </div>

            <div
                className={`help-card-content ${isOpen ? 'open' : ''}`}
                style={{
                    maxHeight: isOpen ? '300px' : '0',
                    opacity: isOpen ? 1 : 0
                }}
            >
                <p>{content}</p>
            </div>
        </div>
    );
};

export default HelpCard;