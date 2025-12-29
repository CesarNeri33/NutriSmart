// src/pages/ProductsTestPage.js

import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTOS } from '../graphql/products';
import RecentItem from '../Componentes/RecentItem';
import { evaluateProduct } from '../rules/nutritionRules';
import {
  mapProductToSemaforo,
  mapProductValues,
} from '../rules/mapToSemaforo';

const ProductsTestPage = () => {
  const { data, loading, error } = useQuery(GET_PRODUCTOS);

  if (loading) return <p>Cargando productos...</p>;
if (error) return <p>Error al cargar productos</p>;

return (
  <div style={{ padding: '20px' }}>
    <h2>🧪 Pantalla de prueba de productos</h2>

    {data.producto.length === 0 && (
      <p>No hay productos registrados</p>
    )}

    <div style={{ display: 'grid', gap: '16px' }}>

      {data.producto.map((producto) => {
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
            />
          );
        })}
    </div>
  </div>
);
};

export default ProductsTestPage;