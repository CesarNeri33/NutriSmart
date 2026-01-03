// src/Pantallas/ProductListPage.js
import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';

import './ProductListPage.css';
import Header from '../../Componentes/Header';
import RecentListItem from '../../Componentes/RecentListItem';

import { GET_PRODUCTOS } from '../../graphql/products';
import {
  GET_LISTA_BY_ID,
  GET_PRODUCTOS_DE_LISTA,
  INSERT_PRODUCTO_A_LISTA,
  TOGGLE_PRODUCTO_COMPRADO,
  UPDATE_UNIDAD_PRODUCTO,
  DELETE_PRODUCTO_DE_LISTA,
} from '../../graphql/listas';

import { evaluateProduct } from '../../rules/nutritionRules';
import {
  mapProductToSemaforo,
  mapProductValues,
} from '../../rules/mapToSemaforo';

import { useParams, useNavigate } from 'react-router-dom';

const ProductListPage = () => {
    const navigate = useNavigate();
  const { listaId } = useParams();

  // Obtener información de la lista
  const {
    data: listaData,
    loading: listaLoading,
    error: listaError,
  } = useQuery(GET_LISTA_BY_ID, {
    variables: { lista_id: Number(listaId) },
  });

  // Obtener todos los productos para sugerencias
  const { data, loading, error } = useQuery(GET_PRODUCTOS);

  // Obtener productos que ya están en la lista
  const {
    data: listaProductosData,
    loading: listaProductosLoading,
    error: listaProductosError,
  } = useQuery(GET_PRODUCTOS_DE_LISTA, {
    variables: { lista_id: Number(listaId) },
  });
console.log('Lista productos data:', listaProductosData);
  // Mutaciones
  const [insertProducto] = useMutation(INSERT_PRODUCTO_A_LISTA, {
    refetchQueries: [
      { query: GET_PRODUCTOS_DE_LISTA, variables: { lista_id: Number(listaId) } },
    ],
  });

  const [toggleComprado] = useMutation(TOGGLE_PRODUCTO_COMPRADO, {
    refetchQueries: [
      { query: GET_PRODUCTOS_DE_LISTA, variables: { lista_id: Number(listaId) } },
    ],
  });

  const [updateUnidad] = useMutation(UPDATE_UNIDAD_PRODUCTO, {
  refetchQueries: [
    { query: GET_PRODUCTOS_DE_LISTA, variables: { lista_id: Number(listaId) } },
  ],
});

const [deleteProducto] = useMutation(DELETE_PRODUCTO_DE_LISTA, {
  refetchQueries: [
    { query: GET_PRODUCTOS_DE_LISTA, variables: { lista_id: Number(listaId) } },
  ],
});

  const [queryText, setQueryText] = useState('');
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setQueryText('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
  console.log('listaId:', listaId);
}, [listaId]);

  // 🔹 Returns condicionales
  if (listaLoading || loading || listaProductosLoading) return <p>Cargando...</p>;
  if (listaError) return <p>Error al cargar la lista</p>;
  if (error) return <p>Error al cargar productos</p>;
  if (listaProductosError) return <p>Error al cargar productos de la lista</p>;

  const listTitle = listaData?.lista_compra_by_pk?.nombre || 'Lista';

  // Filtrado de sugerencias
  const suggestions =
    queryText.length >= 2
      ? data.producto
          .filter((producto) =>
            producto.nombre.toLowerCase().includes(queryText.toLowerCase())
          )
          .slice(0, 5)
      : [];

  return (
    <div className="product-page-wrapper">
      <Header />
      <div className="titulo_lista_wrapper">
        <button
            className="btn-regresar"
            onClick={() => navigate('/listas')} // reemplaza '/listas' con la ruta de tu pantalla de listas
        >
            ←
        </button>
        <h2 className="titulo_lista">{listTitle}</h2>
        </div>

         

      {/* Buscador */}
      <div className="search-card" ref={searchRef}>
        <div className="search-box">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Agregar producto a la lista..."
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
          />
        </div>

        {suggestions.length > 0 && (
          <div className="list-search-suggestions">
            {suggestions.map((producto) => {
              const evaluation = evaluateProduct(producto);
              const niveles = mapProductToSemaforo(evaluation);
              const valores = mapProductValues(producto);

              return (
                <RecentListItem
                  key={producto.producto_id}
                  nombre={producto.nombre}
                  cantidad={producto.cantidad_envase}
                  medida={producto.unidad_envase}
                  imagen={producto.foto_producto}
                  niveles={niveles}
                  valores={valores}
                  mode="suggestion"
                  onAddProducto={async () => {
                    try {
                      await insertProducto({
                        variables: {
                          lista_id: Number(listaId),
                          producto_id: producto.producto_id,
                          cantidad: 1, // unidad inicial
                        },
                      });
                      setQueryText('');
                    } catch (err) {
                      console.error('Error al agregar producto:', err);
                    }
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Productos de la lista */}
      <div className="lista_productos">
        {listaProductosData.lista_producto.length === 0 ? (
          <p className="text-center text-gray-600 mt-10 text-lg">
            Tu lista está vacía 👆
          </p>
        ) : (
          listaProductosData.lista_producto.map((item) => {
            const { producto, cantidad, comprado, id } = item;
            const evaluation = evaluateProduct(producto);
            const niveles = mapProductToSemaforo(evaluation);
            const valores = mapProductValues(producto);

            return (
              <RecentListItem
                key={id}
                nombre={producto.nombre}
                cantidad={producto.cantidad_envase}
                unidad={cantidad} // cantidad de la lista
                medida={producto.unidad_envase}
                imagen={producto.foto_producto}
                niveles={niveles}
                valores={valores}
                mode="list"
                comprado={comprado}
                onToggleComprado={async () => {
                    try {
                    // Optimistic UI: cambia visualmente antes de que termine la mutation
                    toggleComprado({
                        variables: { id, comprado: !comprado },
                        optimisticResponse: {
                        update_lista_producto_by_pk: {
                            id,
                            comprado: !comprado,
                            __typename: "lista_producto",
                        },
                        },
                    });
                    } catch (err) {
                    console.error('Error al marcar producto:', err);
                    }
                }}
                onCantidadChange={async (newCantidad) => {
                try {
                    if (newCantidad >= 1) {
                    await updateUnidad({
                        variables: {
                        id,           // id de la relación lista_producto
                        unidad: newCantidad,
                        },
                    });
                    }
                } catch (err) {
                    console.error('Error al actualizar cantidad:', err);
                }
                }}
                onDelete={() => {
                    deleteProducto({ variables: { id } });
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProductListPage;