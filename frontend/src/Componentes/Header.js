import React from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../Componentes/Title';
import Logo from '../Componentes/Logo';
import UserP from '../Componentes/UserP';
import './Header.css'; // Reutilizamos los estilos del encabezado definidos en ListPage.css

const Header = () => {

    return (
        <header className="header-component">
            {/* Título de la Aplicación */}
            <Title />
            
            {/* Logo de la Aplicación (Centrado) */}
            <Logo />
            
            {/* Ícono de Usuario (Perfil) */}
            <UserP />
        </header>
    );

};

export default Header;