// src/screens/SearchPage.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Header from '../Componentes/Header';
import RecentItem from '../Componentes/RecentItem'; // ⬅️ Importamos el componente de lista
import './SearchPage.css'; // ⬅️ Importamos los estilos de la pantalla

// Datos ficticios para simular búsquedas recientes
const recentSearches = [
    { id: 1, name: 'Cereal Integral', fat: 'low', sugar: 'high', sodium: 'low' },
    { id: 2, name: 'Sopa Instantánea', fat: 'high', sugar: 'low', sodium: 'high' },
    { id: 3, name: 'Jugo de Naranja', fat: 'low', sugar: 'high', sodium: 'low' },
];

const SearchPage = () => {
    // useNavigate es un Hook de React Router que permite navegar programáticamente
    const navigate = useNavigate();

    // Función para manejar el clic en el ícono de "Atrás"
    const handleGoBack = () => {
        navigate('/inicio'); // Regresa a la página anterior en el historial
    };

    return (
        <div className="search-page-container">
            
            {/* 1. Encabezado Superior con Perfil */}
            <Header />

            {/* 3. Tarjeta de Búsqueda */}
            <div className="search-card">
                
                <div className="back-search" onClick={handleGoBack}>
                    <i className="fa-solid fa-chevron-left"></i>
                </div>

                <h2 className="titleSerch" >Buscar Producto</h2>
                <div className="search-box">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Escribe un producto..." />
                    <i className="fa-solid fa-barcode"></i> {/* Icono de escáner de código de barras */}
                </div>
            </div>

            {/* 4. Tarjeta de Búsquedas Recientes */}
            <div className="recent-card">
                <h3>Búsquedas Recientes</h3>

                {/* 5. Iteración sobre la lista de productos */}
                {recentSearches.map(item => (
                    <RecentItem 
                        key={item.id} 
                        data={item} // Pasamos los datos del producto al componente hijo
                    />
                ))}

                {/* Icono de flecha para expandir/ver más */}
                <i className="fa-solid fa-angle-down flecha"></i>
            </div>
        </div>
    );
};

export default SearchPage;