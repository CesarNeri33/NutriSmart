// src/components/RecentListItem.js
import React, { useState } from 'react';
import './RecentListItem.css';

const RecentListItem = ({
  nombre,
  cantidad,
  unidad,
  medida,
  imagen,
  niveles,
  valores,
  comprado = false,
  mode = 'list',
  onToggleComprado,
  onAddProducto,
  onCantidadChange,
  onDelete,
}) => {
  const [imgError, setImgError] = useState(false);
  
  // URL de tu servidor backend
  const SERVER_URL = 'http://191.96.31.39:4000';

  // Lógica para construir la URL de la imagen
  let rutaImagenFinal = imagen;
  if (imagen) {
    if (imagen.startsWith('/upload')) {
      rutaImagenFinal = `${SERVER_URL}${imagen}`;
    } else if (imagen.startsWith('/products')) {
      // Por si queda algún rastro de la ruta vieja en la DB
      rutaImagenFinal = `${SERVER_URL}${imagen.replace('/products', '/upload/products')}`;
    }
  }

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
            src={rutaImagenFinal} // <--- Usamos la ruta procesada
            alt={nombre}
            onError={() => setImgError(true)}
          />
        ) : (
          <i className="fa-solid fa-bottle-water list-icono-producto"></i>
        )}
      </div>

      {/* ... resto del código (contenido y cantidad) se mantiene exactamente igual */}
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
          <button onClick={() => onCantidadChange(unidad + 1)}>+</button>
          <button
            className="list-item-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentListItem;