// src/screens/RegisterPage.js

import React from 'react';
import {Link, useNavigate } from 'react-router-dom';
import Title from '../Componentes/Title'; // Reutilizamos el LogoTitle (aunque solo usaremos el logo aquí)
import Logo from '../Componentes/Logo';
import './RegisterPage.css'; // Importamos los estilos específicos

const RegisterPage = () => {
    // Hook para la navegación
    const navigate = useNavigate();

    // Función para manejar el clic en el ícono de "Atrás"
    const handleGoBack = () => {
        navigate('/'); // Regresa a la página anterior (debe ser la de Login o Welcome)
    };

    // Función que manejará el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Intentando registrar nuevo usuario...");
        // Aquí iría la lógica real de registro

        // Navegacion provicional
        navigate('/iniciar-sesion')
    };

    return (
        <div className="register-screen-container">
            
            {/* 1. Encabezado Superior (Manteniendo la clase 'top' para estilos de fuente) */}
            <header className="top">
                <Title />
            </header>
            
            {/* 2. Contenedor del Logo (Reutilizado) */}
            <div className="register-logo-container">
                {/* NOTA: Si quieres que el logo se muestre como un componente independiente, 
                   podrías usar <LogoTitle />, pero en este caso solo necesitamos la imagen
                   para aplicar los estilos de .logo, por lo que la dejamos como <img>.
                */}
                <Logo />
            </div>

            {/* 3. La tarjeta principal */}
            <div className="RegisterCard">

                {/* Botón de Atrás (funcional con React Router) */}
                <div className="back" onClick={handleGoBack}>
                    <i className="fa-solid fa-chevron-left"></i>
                </div>

                <h2 className="title">Registro.</h2>

                {/* 4. Formulario de Registro */}
                <form className="form" onSubmit={handleSubmit}>

                    <label htmlFor="nombre">Nombre:</label>
                    <input type="text" id="nombre" />

                    <label htmlFor="apellidoPaterno">Apellido Paterno:</label>
                    <input type="text" id="apellidoPaterno" />

                    <label htmlFor="apellidoMaterno">Apellido Materno:</label>
                    <input type="text" id="apellidoMaterno" />

                    <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
                    <input type="date" id="fechaNacimiento" />

                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" id="password" />

                    {/* Sección de Foto de Perfil */}
                    <div className="photo-section">
                        {/* El botón debe ser type="button" para no enviar el formulario */}
                        <button type="button" className="photo-btn">Sube tu Foto</button>
                        <div className="photo-box"></div>
                    </div>

                    <button type="submit" className="submit-btn">Terminar Registro</button>

                </form>

            </div>
        </div>
    );
};

export default RegisterPage;