// src/components/RecentItem.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecentItem.css';
// Importamos el CSS para que conozca las clases .item, .bars, .bar, .rojo, .verde, etc.
// En este caso, como los estilos son específicos, lo importamos del CSS de la pantalla.
// Si esta tarjeta se usara en muchas pantallas, sería mejor un 'RecentItem.css'.

// Por ahora, usamos una prop llamada 'data' para simular un producto
const RecentItem = ({ data }) => {
    const navigate = useNavigate();

    // Handler para navegar al Home (al hacer clic en el título)
    const handleProductClick = () => {
        navigate('/producto'); 
    };

    // Simulación de niveles (si fueran bajo, medio, alto)
    const fatClass = 'rojo'; // Ejemplo: nivel de grasa alto
    const sugarClass = 'amarillo'; // Ejemplo: nivel de azúcar medio
    const sodiumClass = 'verde'; // Ejemplo: nivel de sodio bajo

    return (
        <div className="recent-item"
            onClick={handleProductClick}
            title="Ir al Producto"
        >
            <p><strong>{data.name || 'Nombre del Producto'}</strong></p>
            <div className="bars">
                {/* Nota: En una app real, estas clases se determinarían dinámicamente con lógica */}
                <i class="fa-solid fa-bottle-water fa-2xl icono-producto"></i>
                <div className={`bar ${fatClass}`}></div>
                <div className={`bar ${sugarClass}`}></div>
                <div className={`bar ${sodiumClass}`}></div>
            </div>
        </div>
    );
};

export default RecentItem;