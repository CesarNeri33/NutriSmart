// src/components/RecentItem.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecentItem.css';

const RecentItem = ({ id, nombre, cantidad, medida, imagen, niveles, valores, onSelect }) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const SERVER_URL = 'http://191.96.31.39:4000';

  // Lógica mejorada:
  let rutaImagenFinal = imagen;

  if (imagen) {
    // Caso 1: Ya tiene la ruta nueva (/upload/products/...)
    if (imagen.startsWith('/upload')) {
      rutaImagenFinal = `${SERVER_URL}${imagen}`;
    } 
    // Caso 2: Tiene la ruta vieja (/products/...)
    else if (imagen.startsWith('/products')) {
      // Reemplazamos /products por /upload/products
      const nuevaRuta = imagen.replace('/products', '/upload/products');
      rutaImagenFinal = `${SERVER_URL}${nuevaRuta}`;
    }
  }

  const handleProductClick = () => {
    if (onSelect) onSelect();
    navigate(`/producto/${id}`);
  };

  const mostrarImagen = imagen && !imgError;

  return (
    <div className="recent-item-card" onClick={handleProductClick}>
      
      {/* Columna izquierda: Imagen */}
      <div className="recent-item-image">
        {mostrarImagen ? (
          <img
            src={rutaImagenFinal}
            alt={nombre}
            onError={() => setImgError(true)}
          />
        ) : (
          <i className="fa-solid fa-bottle-water icono-producto"></i>
        )}
      </div>

      {/* Columna derecha: Información */}
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