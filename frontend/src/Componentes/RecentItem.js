// src/components/RecentItem.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecentItem.css';

const RecentItem = ({ id, nombre, cantidad, medida, imagen, niveles, valores, onSelect }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const handleProductClick = () => {
    if (onSelect) onSelect();
    navigate(`/producto/${id}`);
  };

  const mostrarImagen = imagen && !imgError;

  return (
    <div className="recent-item-card" onClick={handleProductClick}>
      
      {/* Columna izquierda */}
      <div className="recent-item-image">
        {mostrarImagen ? (
          <img
            src={imagen}
            alt={nombre}
            onError={() => setImgError(true)}
          />
        ) : (
          <i className="fa-solid fa-bottle-water icono-producto"></i>
        )}
      </div>

      {/* Columna derecha */}
      <div className="recent-item-content">
        <p className="recent-item-name">{nombre} {cantidad}{medida}</p>
        <div className="recent-item-bars">
          <div className={`bar ${niveles.grasas}`}>
            Grasas {valores.grasas} g
          </div>

          <div className={`bar ${niveles.azucar}`}>
            Azúcar {valores.azucar} g
          </div>

          <div className={`bar ${niveles.sodio}`}>
            Sodio {valores.sodio} mg
          </div>
        </div>
      </div>

    </div>
  );
};

export default RecentItem;