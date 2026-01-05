import React from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../Componentes/Title';
import AdLogo from '../Componentes/AdLogo';
import UserAd from '../Componentes/UserAd';
import './AdHeader.css'; // Reutilizamos los estilos del encabezado definidos en ListPage.css

const Header = () => {

    return (
        <header className="ad-header-component">
            {/* Título de la Aplicación */}
            <Title />
            
            {/* Logo de la Aplicación (Centrado) */}
            <AdLogo />
            
            {/* Ícono de Usuario (Perfil) */}
            <UserAd />
        </header>
    );

};

export default Header;