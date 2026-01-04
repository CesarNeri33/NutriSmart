// src/Pantallas/User/SearchResultsPage.js
import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

/* 🔹 Componentes */
import Header from '../../Componentes/Header';
import RecentItem from '../../Componentes/RecentItem';

/* 🔹 GraphQL */
import { GET_PRODUCTOS } from '../../graphql/products';

/* 🔹 Reglas */
import { evaluateProduct } from '../../rules/nutritionRules';
import {
  mapProductToSemaforo,
  mapProductValues,
} from '../../rules/mapToSemaforo';

/* 🔹 Estilos */
import './SearchResultsPage.css';

const SERVER_URL = 'http://191.96.31.39:4000'; // Ajusta a tu IP/dominio

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1️⃣ Leer parámetros iniciales de la URL
  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('q') || '';
  const initialCategoria = searchParams.get('categoria') || '';
  const initialEmpaquetado = searchParams.get('tipoEmpaquetado') || '';

  /* 🔎 Estados */
  const [query, setQuery] = useState(initialQuery);
  const [categoria, setCategoria] = useState(initialCategoria);
  const [tipoEmpaquetado, setTipoEmpaquetado] = useState(initialEmpaquetado);

  /* 📡 GraphQL */
  const { data, loading, error } = useQuery(GET_PRODUCTOS);
  const productos = data?.producto ?? [];

  /* 🖼️ Función para corregir rutas de imágenes */
  const getFullImageUrl = (foto) => {
    if (!foto) return null;
    if (foto.startsWith('/upload')) return `${SERVER_URL}${foto}`;
    if (foto.startsWith('/products')) return `${SERVER_URL}${foto.replace('/products', '/upload/products')}`;
    return foto;
  };

  /* 🔍 Filtros combinados */
  const filteredProducts = useMemo(() => {
    return productos.filter((producto) => {
      // 1. Filtro por Nombre
      const matchNombre = query
        ? producto.nombre.toLowerCase().includes(query.toLowerCase())
        : true;

      // 2. Filtro por Categoría
      const matchCategoria = categoria
        ? producto.categoria === categoria
        : true;

      // 3. Filtro por Empaquetado
      const matchEmpaquetado = tipoEmpaquetado
        ? producto.tipo_empaquetado === tipoEmpaquetado
        : true;

      return matchNombre && matchCategoria && matchEmpaquetado;
    });
  }, [query, categoria, tipoEmpaquetado, productos]);

  /* 🔄 Sincronizar la URL con los filtros actuales */
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (categoria) params.append('categoria', categoria);
    if (tipoEmpaquetado) params.append('tipoEmpaquetado', tipoEmpaquetado);
    
    navigate({ search: params.toString() }, { replace: true });
  }, [query, categoria, tipoEmpaquetado, navigate]);

  if (loading) return <p className="status-msg">Cargando productos...</p>;
  if (error) return <p className="status-msg">Error de conexión</p>;

  return (
    <div className="search-page-container">
      <Header />

      {/* 🔍 Barra de búsqueda + filtros */}
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

        {/* 🔽 Selectores de Filtros */}
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
      </div>

      {/* 🧱 Grid de Resultados */}
      <div className="results-grid">
        {filteredProducts.length === 0 ? (
          <p className="empty-msg">No se encontraron productos con estos filtros.</p>
        ) : (
          filteredProducts.map((producto) => {
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
                onSelect={() => navigate(`/producto/${producto.producto_id}`)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;