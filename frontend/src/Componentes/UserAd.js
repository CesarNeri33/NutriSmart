// src/Componentes/UserAd.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserP = () => {
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem('usuario'));

  useEffect(() => {
    // 1️⃣ No hay sesión → login
    if (!usuario) {
      console.log('⛔ Sin sesión, redirigiendo a login...');
      navigate('/iniciar-sesion');
      return;
    }

    // 2️⃣ Hay sesión pero NO es admin ni dev → inicio
    if (usuario.rol !== 'admin' && usuario.rol !== 'dev') {
      console.log('⛔ Rol no autorizado, redirigiendo a inicio...');
      navigate('/inicio');
    }
  }, [usuario, navigate]);

  // Evita render mientras redirige
  if (!usuario || (usuario.rol !== 'admin' && usuario.rol !== 'dev')) {
    return null;
  }

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
          onClick={handleProfileClick}
          title="Ir a Perfil"
        />
      ) : (
        <i
          className="fa-solid fa-user icono-usuario"
          onClick={handleProfileClick}
          title="Ir a Perfil"
        ></i>
      )}
    </div>
  );
};

export default UserP;