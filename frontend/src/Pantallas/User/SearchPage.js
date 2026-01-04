// src/Pantallas/User/SearchPage.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Header from '../../Componentes/Header';
import RecentItem from '../../Componentes/RecentItem';
import { GET_PRODUCTOS } from '../../graphql/products';
import { evaluateProduct } from '../../rules/nutritionRules';
import { mapProductToSemaforo, mapProductValues } from '../../rules/mapToSemaforo';

import './SearchPage.css';

const RECENT_KEY = 'recent_products';
const SERVER_URL = 'http://191.96.31.39:4000';

const SearchPage = () => {
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_PRODUCTOS);

  const [query, setQuery] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipoEmpaquetado, setTipoEmpaquetado] = useState('');
  const [recentProducts, setRecentProducts] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) setRecentProducts(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // Opcional: solo limpiar si quieres que desaparezcan las sugerencias
        // setQuery(''); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFullImageUrl = (foto) => {
    if (!foto) return null;
    if (foto.startsWith('/upload')) return `${SERVER_URL}${foto}`;
    if (foto.startsWith('/products')) return `${SERVER_URL}${foto.replace('/products', '/upload/products')}`;
    return foto;
  };

  const handleSearch = () => {
    if (query.trim().length >= 1 || categoria !== '' || tipoEmpaquetado !== '') {
      const params = new URLSearchParams();
      if (query.trim()) params.append('q', query);
      if (categoria) params.append('categoria', categoria);
      if (tipoEmpaquetado) params.append('tipoEmpaquetado', tipoEmpaquetado);
      navigate(`/buscar/resultados?${params.toString()}`);
    }
  };

  const handleSelect = (producto) => {
    // Al seleccionar de sugerencias, guardamos en recientes
    const filtered = recentProducts.filter((p) => p.producto_id !== producto.producto_id);
    const updated = [...filtered, producto].slice(-3);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
    
    setQuery('');
    navigate(`/producto/${producto.producto_id}`);
  };

  if (loading) return <p className="status-msg">Cargando productos...</p>;
  if (error) return <p className="status-msg">Error al cargar productos</p>;

  // --- 🚀 LÓGICA DE SUGERENCIAS FILTRADAS ---
  // Ahora las sugerencias consideran el nombre Y la categoría Y el empaque
  const suggestions = query.length >= 2 
    ? data.producto.filter((producto) => {
        const matchNombre = producto.nombre.toLowerCase().includes(query.toLowerCase());
        const matchCategoria = categoria ? producto.categoria === categoria : true;
        const matchEmpaque = tipoEmpaquetado ? producto.tipo_empaquetado === tipoEmpaquetado : true;
        
        return matchNombre && matchCategoria && matchEmpaque;
      }).slice(0, 5)
    : [];

  return (
    <div className="search-page-container">
      <Header />

      <div className="search-card" ref={searchRef}>
        <div className="back-search" onClick={() => navigate('/inicio')}>
          <i className="fa-solid fa-chevron-left"></i>
        </div>

        <h2 className="titleSerch">Buscar Producto</h2>

        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Escribe un producto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
          <i className="fa-solid fa-barcode" style={{ cursor: "pointer" }} onClick={() => navigate('/escaner')}></i>
        </div>

        <div className="filters-container" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <select 
                className="filter-select"
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }}
                value={categoria} 
                onChange={(e) => setCategoria(e.target.value)}
            >
                <option value="">Todas las Categorías</option>
                <option value="refresco">Refrescos</option>
                <option value="jugo">Jugos</option>
                <option value="lacteo">Lácteos</option>
                <option value="sabrita">Sabritas</option>
                <option value="galleta">Galletas</option>
                <option value="pan">Pan</option>
                <option value="cereal">Cereales</option>
                <option value="embutido">Embutidos</option>
                <option value="pescado">Atún/Pescado</option>
                <option value="leguminosa">Frijoles</option>
                <option value="verdura">Verduras</option>
                <option value="salsa">Salsas</option>
            </select>

            <select 
                className="filter-select"
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #ddd' }}
                value={tipoEmpaquetado} 
                onChange={(e) => setTipoEmpaquetado(e.target.value)}
            >
                <option value="">Cualquier Empaque</option>
                <option value="embotellado">Embotellado</option>
                <option value="enlatado">Enlatado</option>
                <option value="embolsado">Embolsado</option>
                <option value="caja">Caja / Cartón</option>
            </select>
        </div>

        {suggestions.length > 0 && (
          <div className="search-suggestions">
            {suggestions.map((producto) => {
              const evaluation = evaluateProduct(producto);
              const niveles = mapProductToSemaforo(evaluation);
              const valores = mapProductValues(producto);

              return (
                <RecentItem
                  key={producto.producto_id}
                  id={producto.producto_id}
                  nombre={producto.nombre}
                  cantidad={producto.cantidad_envase}
                  medida={producto.unidad_envase}
                  imagen={getFullImageUrl(producto.foto_producto)}
                  niveles={niveles}
                  valores={valores}
                  onSelect={() => handleSelect(producto)}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="recent-card">
        <h3>Búsquedas Recientes</h3>
        {recentProducts.length === 0 ? (
          <p style={{color: '#888', textAlign: 'center'}}>No hay búsquedas recientes</p>
        ) : (
          [...recentProducts].reverse().map((producto) => {
            const evaluation = evaluateProduct(producto);
            const niveles = mapProductToSemaforo(evaluation);
            const valores = mapProductValues(producto);

            return (
              <RecentItem
                key={producto.producto_id}
                id={producto.producto_id}
                nombre={producto.nombre}
                cantidad={producto.cantidad_envase}
                medida={producto.unidad_envase}
                imagen={getFullImageUrl(producto.foto_producto)}
                niveles={niveles}
                valores={valores}
                onSelect={() => handleSelect(producto)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default SearchPage;