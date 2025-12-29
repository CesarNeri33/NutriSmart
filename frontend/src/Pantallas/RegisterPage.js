// src/screens/RegisterPage.js

import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';

import Title from '../Componentes/Title';
import Logo from '../Componentes/Logo';
import { REGISTER_USUARIO } from '../graphql/mutations';

import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password_hash: '',
    foto_perfil: '',
  });

  const [error, setError] = useState('');

  const [registerUsuario, { loading }] = useMutation(REGISTER_USUARIO);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let fotoPath = null;

      if (formData.foto_perfil) {
        fotoPath = await uploadImage(formData.foto_perfil);
      }

      await registerUsuario({
        variables: {
          nombre: formData.nombre,
          email: formData.email,
          password_hash: formData.password_hash,
          foto_perfil: fotoPath,
        },
      });

      navigate('/iniciar-sesion');
    } catch (err) {
      console.error(err);
      setError('Error al registrar usuario');
    }
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append('file', file);

    const res = await fetch('http://localhost:4000/upload', {
      method: 'POST',
      body: data,
    });

    const result = await res.json();
    return result.filePath;
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

        <h2 className="title">Registro</h2>

        <form className="form" onSubmit={handleSubmit}>

          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

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

          {/* Foto de perfil */}


          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];

              if (file) {
                setFormData({
                  ...formData,
                  foto_perfil: file,
                });

                setPreview(URL.createObjectURL(file));
              }
            }}
          />

          {preview && (
            <img
              src={preview}
              alt="Vista previa"
              className="avatar-preview"
            />
          )}

          {error && <p className="error">{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Registrando...' : 'Terminar Registro'}
          </button>

        </form>

      </div>
    </div>
  );
};

export default RegisterPage;