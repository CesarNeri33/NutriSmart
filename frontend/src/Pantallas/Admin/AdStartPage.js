import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdHeader from '../../Componentes/AdHeader';
import './AdStartPage.css';

const StartPage = () => {
    const navigate = useNavigate();

    // Handler para cerrar sesion
    const handleAdmLogout = () => {
        console.log('🚪 Cerrando sesión...');
        localStorage.removeItem('usuario');
        navigate('/iniciar-sesion');
    };

    // Handler para navegar a la página de usuarios del Administrador
    const handleAdmUsersClick = () => {
        navigate('/ad-usuarios'); 
    };

    // Handler para navegar a la página de productos del Administrador
    const handleAdmProductsClick = () => {
        navigate('/ad-productos'); 
    };

    // Handler para navegar a la página de listas del Administrador
    const handleAdmListsClick = () => {
        navigate('/ad-listas');
    };

    // Handler para navegar a la página de Tips del Administrador
    const handleAdmHelpClick = () => {
        navigate('/ad-ayudas');
    };
    
    // Handler para navegar a la página de padecimientos del Administrador
    const handleAdmAilmentsClick = () => {
        navigate('/ad-padecimientos');
    };

    return (
        <div className="start-page-container">
            
            {/* Encabezado Superior con el Nombre de la Marca y el Logo */}
            <AdHeader />

            <h2 className="mensaje-bienvenido">Bienvenido</h2>

            {/* Contenedor de Botones de Navegación */}
            <div className="ASPbotones">
                
                <button className="btn-usuario" onClick={handleAdmUsersClick}>
                    Usuarios <i className="fa-solid fa-user"></i>
                </button>

                <button className="btn-productos" onClick={handleAdmProductsClick}>
                    Productos <i className="fa-solid fa-bottle-water"></i>
                </button>
                
                <button className="btn-listas" onClick={handleAdmListsClick}>
                    Listas <i className="fa-solid fa-list"></i>
                </button>
                
                <button className="btn-ayuda" onClick={handleAdmHelpClick}>
                    Ayudas <i className="fa-regular fa-circle-question"></i>
                </button>

                <button className="btn-padecimientos" onClick={handleAdmAilmentsClick}>
                    Padecimientos <i class="fa-solid fa-heart-pulse"></i>
                </button>

                <button className="btn-cerrar-sesion" onClick={handleAdmLogout}>
                    Cerrar sesión <i class="fa-solid fa-door-open"></i>
                </button>
                
            </div>
        </div>
    );
};

export default StartPage;