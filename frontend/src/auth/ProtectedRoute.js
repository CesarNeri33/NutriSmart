import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const usuario = localStorage.getItem('usuario');

  if (!usuario) {
    console.log('⛔ Acceso denegado: no hay sesión');
    return <Navigate to="/iniciar-sesion" replace />;
  }

  console.log('✅ Sesión válida, acceso permitido');
  return children;
};

export default ProtectedRoute;
