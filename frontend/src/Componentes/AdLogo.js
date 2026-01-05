// src/components/Logo.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
// Si tu logo.png está en la carpeta 'public', puedes usar la ruta directamente.
// Si está en 'src/assets', necesitarás importarlo (ej: import logo from '../assets/logo.png';)

const Logo = () => {

    const navigate = useNavigate();

    // Handler para navegar al Home (al hacer clic en el título)
    const handleHomeClick = () => {
        navigate('/ad-inicio'); 
    };

    return (
        <div className="logo-container">
            <img 
                /* El "/" inicial indica que busque en la raíz de la carpeta public */
                src={process.env.PUBLIC_URL + "/logo.png"} 
                className="logo" 
                alt="NutriSmart Logo"
                onClick={handleHomeClick}
                style={{ cursor: 'pointer' }}
            />
        </div>
    );
};

export default Logo;