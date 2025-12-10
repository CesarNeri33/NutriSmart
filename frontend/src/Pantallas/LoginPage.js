// src/screens/LoginPage.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Usaremos useNavigate para el botón de "Atrás"
import Title from '../Componentes/Title'; // ⬅️ Reutilizamos el componente
import Logo from '../Componentes/Logo'; // ⬅️ Reutilizamos el componente
import './LoginPage.css'; // ⬅️ Importamos los estilos específicos

const LoginPage = () => {
    // useNavigate es un Hook de React Router que permite navegar programáticamente
    const navigate = useNavigate();

    // Función para manejar el clic en el ícono de "Atrás"
    const handleGoBack = () => {
        navigate('/'); // Regresa a la página anterior en el historial
    };

    // Función que manejará el envío del formulario (por ahora solo previene la recarga)
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Intentando iniciar sesión...");
        // Navegacion provicional
        navigate('/inicio')
        // Aquí iría la lógica real de autenticación
    };

    return (
        <div className="login-screen-container">
            {/* 1. Encabezado superior con el título */}
            <header className="top">
                <Title />
            </header>
            <div className="login-logo-container">
                <Logo />
            </div>
            
            {/* 2. La tarjeta de Login */}
            <div className="LoginCard">

                {/* Botón de Atrás */}
                {/* Reemplazamos el <div> con un <i> por una función onClick */}
                <div className="back" onClick={handleGoBack}>
                    <i className="fa-solid fa-chevron-left"></i>
                </div>

                {/* 3. Reutilizamos el Logo y Título, pero solo mostramos el Logo */}
                

                <h2 className="title">Inicio de Sesión.</h2>

                {/* 4. Formulario de Inicio de Sesión */}
                <form className="form" onSubmit={handleSubmit}>

                    <label htmlFor="username">Nombre:</label>
                    <input type="text" id="username" />

                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" id="password" />

                    <button type="submit" className="login-btn">INICIAR SESIÓN</button>

                </form>

                {/* 5. Enlace para registrarse */}
                <div className="register-link">
                    {/* Usamos <Link> con la ruta que definimos en App.js */}
                    <Link to="/registro">Regístrate Aquí</Link>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;