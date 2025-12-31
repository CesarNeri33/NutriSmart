// src/components/UserP.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Si tu logo.png está en la carpeta 'public', puedes usar la ruta directamente.
// Si está en 'src/assets', necesitarás importarlo (ej: import logo from '../assets/logo.png';)

const UserP = () => {

    const navigate = useNavigate();

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
        console.log('⛔ Sin sesión en pagina de inicio, redirigiendo...');
        navigate('/iniciar-sesion');
    }
    }, [navigate]);

    if (!usuario) {
        return null;
    }

    // Handler para navegar al Home (al hacer clic en el título)
    const handleProfileClick = () => {
        navigate('/perfil'); 
    };

    return (
        <div>
            {usuario.foto_perfil ? (
            <img
                src={`http://191.96.31.39:4000${usuario.foto_perfil}`}
                alt="Foto de perfil"
                width="110"
                className="avatar-imagen-header"
                onClick={handleProfileClick} title="Ir a Perfil"
            />
                ) : (
                <i className="fa-solid fa-user icono-usuario" onClick={handleProfileClick} title="Ir a Perfil"></i>
            )}
        </div>
    );

};

export default UserP;