import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Componentes/Header';
import './StartPage.css';

const StartPage = () => {
    const navigate = useNavigate();

    // Handler para cerrar sesion
    const handleLogout = () => {
        console.log('🚪 Cerrando sesión...');
        localStorage.removeItem('usuario');
        navigate('/iniciar-sesion');
    };

    // Handler para navegar a la página de Buscador
    const handleSearchClick = () => {
        navigate('/buscar'); 
    };

    // Handler para navegar a la página de Listas (usamos un placeholder por ahora)
    const handleListsClick = () => {
        console.log("Navegando a Listas de Compras...");
        navigate('/listas'); // Suponemos que la ruta es /listas
    };

    // Handler para navegar a la página de Ayuda/Tips (usamos un placeholder por ahora)
    const handleHelpClick = () => {
        console.log("Navegando a Tips Educativos...");
        navigate('/ayuda'); // Suponemos que la ruta es /ayuda
    };

    const handleAilmentsClick = () => {
        console.log("Navegando a Lista de Padecimientos...");
        navigate('/padecimientos'); // Suponemos que la ruta es /ayuda
    };

    return (
        <div className="start-page-container">
            
            {/* Encabezado Superior con el Nombre de la Marca y el Logo */}
            <Header />

            <h2 className="mensaje-bienvenido">Bienvenido</h2>

            {/* Contenedor de Botones de Navegación */}
            <div className="botones">
                
                <button className="btn-buscador" onClick={handleSearchClick}>
                    Buscador <i className="fa-solid fa-magnifying-glass"></i>
                </button>
                
                <button className="btn-listas" onClick={handleListsClick}>
                    Listas <i className="fa-solid fa-list"></i>
                </button>
                
                <button className="btn-ayuda" onClick={handleHelpClick}>
                    Ayuda <i className="fa-regular fa-circle-question"></i>
                </button>

                <button className="btn-padecimientos" onClick={handleAilmentsClick}>
                    Padecimientos <i class="fa-solid fa-heart-pulse"></i>
                </button>

                <button className="btn-cerrar-sesion" onClick={handleLogout}>
                    Cerrar sesión <i class="fa-solid fa-door-open"></i>
                </button>
                
            </div>
        </div>
    );
};

export default StartPage;