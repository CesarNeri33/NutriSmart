import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './App.css'; 

import WelcomePage from './Pantallas/WelcomePage'; 
import LoginPage from './Pantallas/LoginPage';
import RegisterPage from './Pantallas/RegisterPage';
import SearchPage from './Pantallas/User/SearchPage';
import AccountPage from './Pantallas/User/AccountPage';
import StartPage from './Pantallas/User/StartPage';
import ListPage from './Pantallas/User/ListPage';
import HelpPage from './Pantallas/User/HelpPage';
import AilmentsPage from './Pantallas/User/AilmentsPage';
import ProductListPage from './Pantallas/User/ProductListPage';
import TestQuery from './Pantallas/User/TestHasuraPage';
import ProductsTestPage from './Pantallas/User/ProductsTestPage';
import SearchResultsPage from './Pantallas/User/SearchResultsPage';
import ProductPage from './Pantallas/User/ProductPage';

import AdminStartPage from './Pantallas/Admin/AdStartPage';
import AdminUsersPage from './Pantallas/Admin/AdUsersPage';


import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas de Autenticación */}
        <Route path="/" element={<WelcomePage />} /> 
        <Route path="/iniciar-sesion" element={<LoginPage />} /> 
        <Route path="/registro" element={<RegisterPage />} /> 

        {/* Rutas del Usuario */}
        <Route path="/inicio" element={<StartPage />}/>
        <Route path="/buscar" element={<SearchPage />} />
        <Route path="/buscar/resultados" element={<SearchResultsPage />} />
        <Route path="/perfil" element={<AccountPage />} />
        <Route path="/listas" element={<ListPage />} />
        <Route path="/ayuda" element={<HelpPage />} />
        <Route path="/padecimientos" element={<AilmentsPage />} />
        <Route path="/listas/:listaId" element={<ProductListPage />} />
        <Route path="/producto/:id" element={<ProductPage />} />

        {/* Rutas del Administrador */}
        <Route path="/ad-inicio" element={<AdminStartPage />} />
        <Route path="/ad-usuarios" element={<AdminUsersPage />} />

        {/* Ruta de Prueba */}
        <Route path="/test" element={<TestQuery />} />
        <Route path="/test-productos" element={<ProductsTestPage />} />

        <Route path="*" element={<h1>404 | Página no encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;