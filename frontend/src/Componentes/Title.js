// src/components/Title.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
// Si tu logo.png está en la carpeta 'public', puedes usar la ruta directamente.
// Si está en 'src/assets', necesitarás importarlo (ej: import logo from '../assets/logo.png';)

const Title = () => {

    const navigate = useNavigate();

    // Handler para navegar al Home (al hacer clic en el título)
    const handleHomeClick = () => {
        navigate('/inicio'); 
    };

    return (
        <>
            <h1 className="title" onClick={handleHomeClick} style={{ cursor: 'pointer' }}>NutriSmart</h1>
        </>
    );

};

export default Title;