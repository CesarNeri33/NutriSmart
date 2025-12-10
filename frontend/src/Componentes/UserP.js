// src/components/UserP.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
// Si tu logo.png está en la carpeta 'public', puedes usar la ruta directamente.
// Si está en 'src/assets', necesitarás importarlo (ej: import logo from '../assets/logo.png';)

const UserP = () => {

    const navigate = useNavigate();

    // Handler para navegar al Home (al hacer clic en el título)
    const handleProfileClick = () => {
        navigate('/perfil'); 
    };

    return (
        <i 
            className="fa-solid fa-user icono-usuario" 
            onClick={handleProfileClick}
            title="Ir a Perfil"
        ></i>
    );

};

export default UserP;