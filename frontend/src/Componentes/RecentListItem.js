// src/components/RecentListItem.js
import React, { useState } from 'react';
import './RecentListItem.css';

const RecentListItem = ({
  nombre,
  cantidad,
  unidad,          // unidades (BD, solo en list)
  medida,
  imagen,
  niveles,
  valores,

  comprado = false,

  mode = 'list',     // 'list' | 'suggestion'

  onToggleComprado,
  onAddProducto,
  onCantidadChange,
  onDelete,
}) => {
  const [imgError, setImgError] = useState(false);

  const mostrarImagen = imagen && !imgError;

    const handleClick = () => {
        if (mode === 'list') {
            onToggleComprado?.();
        }
        if (mode === 'suggestion') {
            onAddProducto?.();
        }
    };

  return (
    <div
      className={`list-item-card ${comprado ? 'list-item-comprado' : ''}`}
      onClick={handleClick}
    >
      {/* Imagen */}
      <div className="list-item-image">
        {mostrarImagen ? (
          <img
            src={imagen}
            alt={nombre}
            onError={() => setImgError(true)}
          />
        ) : (
          <i className="fa-solid fa-bottle-water list-icono-producto"></i>
        )}
      </div>

      {/* Contenido */}
      <div className="list-item-content">
        <p className="list-item-name">
          {nombre} {cantidad}{medida}
        </p>

        <div className="list-item-bars">
          <div className={`list-bar ${niveles.grasas}`}>
            Grasas {valores.grasas} g
          </div>
          <div className={`list-bar ${niveles.azucar}`}>
            Azúcar {valores.azucar} g
          </div>
          <div className={`list-bar ${niveles.sodio}`}>
            Sodio {valores.sodio} mg
          </div>
        </div>
      </div>

      {/* Cantidad */}
      {mode === 'list' && (
        <div
            className="list-item-cantidad"
            onClick={(e) => e.stopPropagation()}
        >
            <button
            onClick={() => onCantidadChange(unidad - 1)}
            disabled={unidad <= 1}
            >
            −
            </button>

            <span>{unidad}</span>

            <button onClick={() => onCantidadChange(unidad + 1)}>
            +
            </button>
            <button
                className="list-item-delete"
                onClick={(e) => {
                e.stopPropagation(); // evitar marcar como comprado
                onDelete?.();
                }}
            >🗑️</button>
        </div>
        )}
    </div>
  );
};

export default RecentListItem;