import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Title from '../Componentes/Title'; 
import Logo from '../Componentes/Logo';
import './RegisterPage.css'; 

const RegisterPage = () => {
    const navigate = useNavigate();
    
    // 1. Estados para guardar los datos del formulario
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState(''); // AGREGADO: Strapi lo necesita obligatorio
    const [password, setPassword] = useState('');
    
    // Estos campos son visuales por ahora (Strapi por defecto no los trae, 
    // pero los dejamos aquí para que tu formulario no pierda su forma)
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');

    const [error, setError] = useState('');

    const handleGoBack = () => {
        navigate('/'); 
    };

    // 2. Función de Registro real conectada a Strapi
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validación simple
        if (!nombre || !email || !password) {
            setError("Por favor llena Nombre, Email y Contraseña.");
            return;
        }

        try {
            console.log("Enviando datos a Strapi...");
            
            const response = await fetch('http://localhost:1337/api/auth/local/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: nombre, // Usaremos el Nombre como Username
                    email: email,     // OBLIGATORIO
                    password: password,
                }),
            });

            const data = await response.json();

            if (data.error) {
                setError("Error: El usuario o correo ya existen.");
            } else {
                console.log("Registro exitoso:", data);
                
                // Auto-login: Guardamos el token
                localStorage.setItem('token', data.jwt);
                localStorage.setItem('user', JSON.stringify(data.user));

                alert(`¡Cuenta creada! Bienvenido ${data.user.username}`);
                
                // Redirigimos directo al inicio (ya logueado)
                navigate('/inicio');
            }
        } catch (err) {
            console.error(err);
            setError("Error de conexión con el servidor.");
        }
    };

    return (
        <div className="register-screen-container">
            
            <header className="top">
                <Title />
            </header>
            
            <div className="register-logo-container">
                <Logo />
            </div>

            <div className="RegisterCard">

                <div className="back" onClick={handleGoBack}>
                    <i className="fa-solid fa-chevron-left"></i>
                </div>

                <h2 className="title">Registro.</h2>

                <form className="form" onSubmit={handleSubmit}>

                    {/* Nombre (Lo usaremos como Username) */}
                    <label htmlFor="nombre">Nombre de Usuario:</label>
                    <input 
                        type="text" 
                        id="nombre" 
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />

                    {/* --- NUEVO CAMPO EMAIL (OBLIGATORIO PARA STRAPI) --- */}
                    <label htmlFor="email">Correo Electrónico:</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        required
                    />
                    {/* --------------------------------------------------- */}

                    <label htmlFor="apellidoPaterno">Apellido Paterno:</label>
                    <input 
                        type="text" 
                        id="apellidoPaterno" 
                        value={apellidoPaterno}
                        onChange={(e) => setApellidoPaterno(e.target.value)}
                    />

                    <label htmlFor="apellidoMaterno">Apellido Materno:</label>
                    <input 
                        type="text" 
                        id="apellidoMaterno"
                        value={apellidoMaterno}
                        onChange={(e) => setApellidoMaterno(e.target.value)}
                    />

                    <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
                    <input 
                        type="date" 
                        id="fechaNacimiento"
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                    />

                    <label htmlFor="password">Contraseña:</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                    />

                    <div className="photo-section">
                        <button type="button" className="photo-btn">Sube tu Foto</button>
                        <div className="photo-box"></div>
                    </div>

                    {/* Mensaje de error si falla */}
                    {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}

                    <button type="submit" className="submit-btn">Terminar Registro</button>

                </form>

            </div>
        </div>
    );
};

export default RegisterPage;