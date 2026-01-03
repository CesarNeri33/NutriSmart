// src/screens/LoginPage.js

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';

import Title from '../Componentes/Title';
import Logo from '../Componentes/Logo';
import { LOGIN_USUARIO } from '../graphql/query';

import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

const [formData, setFormData] = useState({
  email: '',
  password_hash: '',
});

const [error, setError] = useState('');

const [loginUsuario, { loading }] = useLazyQuery(LOGIN_USUARIO, {
  onCompleted: (data) => {
    console.log("📥 Respuesta completa de Hasura:", data);

    if (!data || !data.usuario || data.usuario.length === 0) {
      console.log("⚠️ Respuesta inválida del servidor");
      setError('Email o contraseña incorrectos');
      return;
    }

    const usuario = data.usuario[0];

    localStorage.setItem('usuario', JSON.stringify(usuario));

    // 🔀 Redirección por rol
    switch (usuario.rol) {
      case 'admin':
        navigate('/ad-inicio');
        break;

      case 'dev':
        window.location.href = 'http://191.96.31.39:8080/console';
        break;

      case 'usuario':
      default:
        navigate('/inicio');
        break;
    }
  },
  onError: (error) => {
    console.error("🔥 Error al ejecutar login:", error);
    setError('Error al conectar con el servidor');
  }
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

const handleSubmit = (e) => {
  e.preventDefault();

  console.log("📨 Intentando login con:");
  console.log({
    email: formData.email,
    password_hash: formData.password_hash,
  });

  loginUsuario({
    variables: {
      email: formData.email,
      password_hash: formData.password_hash,
    }
  });
};

const handleGoBack = () => {
  navigate('/');
};

  return (
    <div className="login-screen-container">

      <header className="top">
        <Title />
      </header>

      <div className="login-logo-container">
        <Logo />
      </div>

      <div className="LoginCard">

        <div className="back" onClick={handleGoBack}>
          <i className="fa-solid fa-chevron-left"></i>
        </div>

        <h2 className="title">Inicio de Sesión</h2>

        <form className="form" onSubmit={handleSubmit}>

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            name="password_hash"
            value={formData.password_hash}
            onChange={handleChange}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Verificando...' : 'INICIAR SESIÓN'}
          </button>

        </form>

        <div className="register-link">
          <Link to="/registro">Regístrate aquí</Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
