// src/screens/SearchPage.js
// src/screens/SearchPage.js
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Header from '../Componentes/Header';
import RecentItem from '../Componentes/RecentItem';
import { GET_PRODUCTOS } from '../graphql/products';
import { evaluateProduct } from '../rules/nutritionRules';
import { mapProductToSemaforo, mapProductValues } from '../rules/mapToSemaforo';

import './SearchPage.css';

const RECENT_KEY = 'recent_products'; // clave en localStorage

const SearchPage = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_PRODUCTOS);

  const [query, setQuery] = useState('');
  const [recentProducts, setRecentProducts] = useState([]);
  const searchRef = useRef(null);

  // Cargar recientes de localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) {
      setRecentProducts(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGoBack = () => navigate('/inicio');

  const handleSearch = (value) => {
    if (value.trim().length >= 2) {
      navigate(`/buscar/resultados?q=${encodeURIComponent(value)}`);
      addToRecent(value);
    }
  };

  const addToRecent = (producto) => {
    setRecentProducts((prev) => {
      // Remover si ya existe
      const filtered = prev.filter((p) => p.producto_id !== producto.producto_id);
      // Agregar al final
      const updated = [...filtered, producto];
      // Mantener máximo 3
      const sliced = updated.slice(-3);
      // Guardar en localStorage
      localStorage.setItem(RECENT_KEY, JSON.stringify(sliced));
      return sliced;
    });
  };

  const handleSelect = (producto) => {
    addToRecent(producto);
    setQuery('');
    navigate(`/producto/${producto.producto_id}`);
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error al cargar productos</p>;

  const suggestions =
    query.length >= 2
      ? data.producto
          .filter((producto) =>
            producto.nombre.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5)
      : [];

  return (
    <div className="search-page-container">
      <Header />

      {/* Tarjeta de búsqueda */}
      <div className="search-card" ref={searchRef}>
        <div className="back-search" onClick={handleGoBack}>
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch(query);
            }}
          />
          <i className="fa-solid fa-barcode"></i>
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
                  imagen={producto.foto_producto}
                  niveles={niveles}
                  valores={valores}
                  onSelect={() => handleSelect(producto)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Búsquedas recientes */}
      <div className="recent-card">
        <h3>Búsquedas Recientes</h3>
        {recentProducts.length === 0 ? (
          <p>No hay búsquedas recientes</p>
        ) : (
          recentProducts.map((producto) => {
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
                imagen={producto.foto_producto}
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