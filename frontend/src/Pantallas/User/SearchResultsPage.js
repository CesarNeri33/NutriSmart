// src/screens/SearchResultsPage.js

import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Header from '../../Componentes/Header';
import RecentItem from '../../Componentes/RecentItem';
import { GET_PRODUCTOS } from '../../graphql/products';
import { evaluateProduct } from '../../rules/nutritionRules';
import {
  mapProductToSemaforo,
  mapProductValues,
} from '../../rules/mapToSemaforo';

import './SearchResultsPage.css';

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);

  const { data, loading, error } = useQuery(GET_PRODUCTOS);

  // ✅ DECLARAR PRIMERO
  const productos = data?.producto ?? [];

  // ✅ LUEGO usar en hooks
  const filteredProducts = useMemo(() => {
    if (!query) return [];
    return productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, productos]);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>Error al cargar productos</p>;

  return (
    <div className="search-page-container">
      <Header />

      {/* Barra de búsqueda */}
      <div className="search-card">
        <div className="back-search" onClick={() => navigate(-1)}>
          <i className="fa-solid fa-chevron-left"></i>
        </div>

        <h2 className="titleSerch">Resultados</h2>

        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar producto..."
          />
        </div>
      </div>

      {/* Resultados filtrados */}
      <div className="results-grid">
        {filteredProducts.map((producto) => {
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
              onSelect={() => setQuery('')}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SearchResultsPage;