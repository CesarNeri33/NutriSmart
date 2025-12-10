import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './App.css'; 

import WelcomePage from './Pantallas/WelcomePage'; 
import LoginPage from './Pantallas/LoginPage';
import RegisterPage from './Pantallas/RegisterPage';
import SearchPage from './Pantallas/SearchPage';
import AccountPage from './Pantallas/AccountPage';
import StartPage from './Pantallas/StartPage';
import ListPage from './Pantallas/ListPage';
import HelpPage from './Pantallas/HelpPage';
import AilmentsPage from './Pantallas/AilmentsPage';
import ProductListPage from './Pantallas/ProductListPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de Autenticación */}
        <Route path="/" element={<WelcomePage />} /> 
        <Route path="/iniciar-sesion" element={<LoginPage />} /> 
        <Route path="/registro" element={<RegisterPage />} /> 

        {/* Rutas Principales (Hub) */}
        <Route path="/inicio" element={<StartPage />} />
        <Route path="/buscar" element={<SearchPage />} /> 
        <Route path="/perfil" element={<AccountPage />} />
        <Route path="/listas" element={<ListPage />} />
        <Route path="/ayuda" element={<HelpPage />} />
        <Route path="/padecimientos" element={<AilmentsPage />} />
        <Route path="/lista_productos" element={<ProductListPage />} />

        <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;